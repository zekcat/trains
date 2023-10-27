<script setup>
import { createTrains } from "@/controller/trainFactory";
import { controller } from "@/controller/roadController";
import { SettingsTeamplate as SetTmp, InfoToltip } from "@/components";
import { stations, roadmaps } from "@/controller/station";
import { ref } from "vue";
import { SETTINGS, ERRORS } from "@/assets/values";

/**@constant inform инфо поле для вывода возможных ошибок*/
const inform = ref("");
/**@constant proxyLog логи по событиям поездов*/
const proxyLog = ref([]);

// Работа с дорожными картами для поездов
const roadmapsObj = ref(roadmaps);
const updateRoadMap = (index, newValue) => {
  roadmapsObj.value[index] = newValue.split(':');
}

const roadmapsErrors = ref(false);
// храним дублирующие элементы
const errRoadMapIndex = ref([]);

/**
 * @function errorRoadmapsCheck
 * @description валидация поля при изменении путей поездов на корректные значения 
 * @param {Number} index 
 * @param {String} newValue 
 */
const errorRoadmapsCheck = (index, newValue) => {
  const newArr = newValue.split(':');

  switch (true) {
    case newValue === '':
      trainRef.value[index].innerText = ERRORS.empData;
      updateErrState(SETTINGS[1], true);
      return;
    default:
      dropErrors(SETTINGS[1], index);
      break;
  }

  // проверяем чтобы поезда не стартовали с одной станции
  // попутно проверяем что маршрут корректный и не пытается перепрыгнуть по различным путям
  const mapsStart = ref([]);
  const roadErrors = ref([]);

  Object.entries(roadmapsObj.value).forEach(([key, val]) => {
    if (newArr[0] === val[0]) {
      mapsStart.value.push(key);
    }

    if (!checkRoad(val)) roadErrors.value.push(key);
  });

  if (mapsStart.value.length > 1) {
    mapsStart.value.forEach((el) => { trainRef.value[el].innerText = ERRORS.stTrain; errRoadMapIndex.value.push(el) });
    updateErrState(SETTINGS[1], true);
  }

  if (roadErrors.value.length !== 0) {
    roadErrors.value.forEach((el) => { trainRef.value[el].innerText = ERRORS.errRoad; errRoadMapIndex.value.push(el) });
    updateErrState(SETTINGS[1], true);
  }
}

const checkRoad = (path) => {
  for (let i = 0; i < path.length - 1; i += 1) {
    const idId = `${path[i]}${path[i + 1]}`
    const pathIsCurr = stationsArr.value.find((el) => el[0] + el[1] === idId || idId === el[1] + el[0]);

    if (pathIsCurr === undefined) return false;
  }

  return true;
};


// Работа со станциями
const stationsArr = ref(stations);
const updateStation = (index, newValue) => {
  stationsArr.value[index] = newValue.split(':');
}

const stationErrors = ref(false);
// храним дублирующие элементы
const errStationIndex = ref([]);

/**
 * @function errorRoadmapsCheck
 * @description валидация поля при изменении станций на корректные значения 
 * @param {Number} index 
 * @param {String} newValue 
 */
const errorStationCheck = (index, newValue) => {
  const newArr = newValue.split(':');

  switch (true) {
    case newValue === '':
      stationRef.value[index].innerText = ERRORS.empData;
      updateErrState(SETTINGS[0], true);

      return;
    case newArr.length < 3:
      stationRef.value[index].innerText = ERRORS.errFormat;
      updateErrState(SETTINGS[0], true);

      return;
    case newArr[0] === "" || newArr[1] === "" || newArr[2] === "":
      stationRef.value[index].innerText = ERRORS.errFormat;
      updateErrState(SETTINGS[0], true);

      return;
    case isNaN(+newArr[2]):
      stationRef.value[index].innerText = ERRORS.lngErr;
      updateErrState(SETTINGS[0], true);

      return;
    default:
      stationsArr.value[index][2] = +newArr[2];
      dropErrors(SETTINGS[0], index);
  }

  const stations = newArr[0] + newArr[1];

  stationsArr.value.forEach((element, ind) => {
    if (stations === element[0] + element[1] || stations === element[1] + element[0]) {
      const newLng = newArr[2];
      const elLng = element[2];
      const checkNum = !!(+newLng !== +elLng);

      if (checkNum) {
        stationRef.value[index].innerText = ERRORS.lngDiff;
        stationRef.value[ind].innerText = ERRORS.lngDiff;

        errStationIndex.value.push(ind);
        updateErrState(SETTINGS[0], true);
      }
    }
  });
}

// общие компоненты по проверке ошибок
const updateErrState = (errName, newState) => {
  if (errName === SETTINGS[0]) {
    stationErrors.value = newState;
    return
  }

  roadmapsErrors.value = newState;
};

const dropErrors = (arrName, index) => {
  if (arrName === SETTINGS[0]) {
    updateErrState(arrName, false);
    stationRef.value[index].innerText = "";

    if (errStationIndex.value.length !== 0) {
      errStationIndex.value.forEach((el) => stationRef.value[el].innerText = "");
      errStationIndex.value = [];
    };
    return
  }

  updateErrState(arrName, false);
  trainRef.value[index].innerText = "";

  if (errRoadMapIndex.value.length !== 0) {
    errRoadMapIndex.value.forEach((el) => trainRef.value[el].innerText = "");
    errRoadMapIndex.value = [];
  };
};

const checkFieldsForRun = (numTrains) => {
  const isRun = false;

  if (stationErrors.value || roadmapsErrors.value) {
    inform.value = ERRORS.mStart;
    return isRun
  }

  if (numTrains === 0) {
    inform.value = ERRORS.emtTrains;
    return isRun
  }

  if (numTrains > stationsArr.value.length) {
    inform.value = ERRORS.delTrains;
    return isRun
  }

  return !isRun;
};

const startTest = () => {
  const numTrains = Object.keys(roadmapsObj.value).length;
  if (!checkFieldsForRun(numTrains)) return;

  let emptyFields = 0

  stationsArr.value.forEach((el) => { if (!el.length) emptyFields += 1 });
  Object.values(roadmapsObj.value).forEach((el) => { if (!el.length) emptyFields += 1 });

  if (emptyFields) {
    inform.value = ERRORS.empGlob;
    return
  }

  const trains = createTrains(numTrains, Object.values(roadmapsObj.value));
  proxyLog.value = controller(trains);
};

/**@constant trainRef stationRef - локальные айди для вывода ошибок*/
const trainRef = ref([]);
const stationRef = ref([]);

// управление состоянием элемнетов
const addItem = (name) => {
  if (name === SETTINGS[0]) {
    stationsArr.value.push([]);
    return
  }

  // первый ключ начинается с 1
  const newKey = Object.keys(roadmapsObj.value).length + 1;
  roadmapsObj.value[newKey] = [];
};

const delItem = (name, index) => {
  if (name === SETTINGS[0]) {
    stationsArr.value.splice(index, 1);

    dropErrors(name, index);
    return
  }

  delete roadmapsObj.value[index];
}
</script>

<template>
  <div class="main-page">
    <!-- TODO в иной ситуации разделил бы на 2 компоента main и инфо -->
    <main class="main-page__settings">
      <h1 class="main-page__title">Settings</h1>
      <!-- TODO тут по хорошему надо сделать еще один компонент и выводить 2 тега через v-for -->
      <set-tmp class="main-page__tmp" @action="addItem(SETTINGS[0])">
        <template #body>
          <h2>Stations</h2>

          <p>set line like id:id:length</p>

          <div v-for="(station, index) in stationsArr" :key="index" class="input-card">
            <span :ref="(el) => { stationRef[index] = el }" class="input-card__err"></span>

            <input placeholder="set line like id:id:length" type="text" class="input-card__input"
              :value="station.join(':')" @input="updateStation(index, $event.target.value)"
              @change="errorStationCheck(index, $event.target.value)">

            <button class="input-card__btn" @click="delItem(SETTINGS[0], index)">
              <img src="/delete.svg" alt="del" class="input-card__img">
            </button>
          </div>
        </template>

        <template #button>
          Add Station
        </template>
      </set-tmp>

      <set-tmp class="main-page__tmp" @action="addItem(SETTINGS[1])">
        <template #body>
          <h2>Trains</h2>

          <p>set roadmap like station:station:...:station</p>

          <div v-for="(train, index) in roadmapsObj" :key="index" class="input-card">
            <span :ref="(el) => { trainRef[index] = el }" class="input-card__err"></span>

            <input placeholder="set roadmap like station:station:...:station" type="text" class="input-card__input"
              :value="roadmapsObj[index].join(':')" @input="updateRoadMap(index, $event.target.value)"
              @change="errorRoadmapsCheck(index, $event.target.value)" />

            <button class="input-card__btn" @click="delItem(SETTINGS[1], index)">
              <img src="/delete.svg" alt="del" class="input-card__img">
            </button>
          </div>
        </template>

        <template #button>
          Add Train
        </template>
      </set-tmp>

      <button class="main-page__btn" @click="startTest">Start test</button>
    </main>

    <div class="main-page__info">
      <p v-for="(info, index) in proxyLog" :key="index" class="main-page__text">
        <img src="/train.svg" alt="train" class="main-page__icon" />
        <img src="/btoom.svg" alt="btoom" class="main-page__icon" />
        <img src="/train.svg" alt="train" class="main-page__icon" />

        {{ info }}
      </p>
    </div>

    <Teleport to="body">
      <info-toltip v-if="inform" :title="inform" :timeout="3000" class="tooltip-info" @close="inform = ''">
      </info-toltip>
    </Teleport>
  </div>
</template>

<style lang="scss" scoped>
.main-page {
  display: flex;
  justify-content: space-between;
  height: 100vh;

  padding: 20px 0 0 15px;
  background-color: #fafafa;
  overflow: hidden;

  &__title {
    width: 100%;
    padding: 20px 20px 0;
    border: 3px solid #2c3e505b;
  }

  &__text {
    font-size: 20px;
  }

  // .main-page__settings
  &__settings {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    flex-basis: 30%;
    max-width: 400px;
    overflow: auto;

    margin: 0 5px 0 0;
  }

  &__tmp {
    margin: 40px 0 0;
  }

  // .main-page__info
  &__info {
    border: 40px outset #67696bf6;
    flex-basis: 68%;
    padding: 5px 10px 5px;
    margin: 0 20px 10px auto;

    overflow: auto;
  }

  &__btn {
    width: 100%;
    height: 35px;
    font-size: 20px;

    margin: 30px 0 0;
  }

  &__icon {
    width: 20px;
    height: 20px;
    margin: 0 5px;
  }
}

.input-card {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 45px;

  margin: 0 0 15px 0;
  padding: 18px 0 0;

  position: relative;

  // .input-card__input
  &__input {
    width: 100%;
    height: 100%;
    font-size: 16px;
  }

  // .input-card__btn
  &__btn {
    width: 30px;
    height: 100%;

    margin: 0 0 0 10px;
  }

  // .input-card__img
  &__img {
    width: 100%;
    height: 100%;
  }

  &__err {
    color: red;
    position: absolute;
    left: 0;
    top: 0;
  }
}

.tooltip-info {
  position: fixed;
  bottom: 20px;
  left: 35vw;
}
</style>

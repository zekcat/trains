<script setup>
import { createTrains } from "@/controller/trainFactory";
import { controller, infoLog } from "@/controller/roadController";
import { SettingsTeamplate as SetTmp } from "@/components";
import { stations, roadmaps, hashMapStation } from "@/controller/station";
import { ref, computed } from "vue";


const proxyLog = computed(() => infoLog.getEvents);

const trains = createTrains(3);

controller(trains);

console.log("trains", trains);

const roadmapsArr = ref(roadmaps);
const updateRoadMap = (index, newValue) => {
  roadmapsArr.value[index] = newValue.split(':');
}

const stationsArr = ref(stations);
const updateStation = (index, newValue) => {
  stationsArr.value[index] = newValue.split(':');
}

const createPoints = (index, newValue) => {
  const newArr = newValue.split(':');
  console.log(newArr, newArr.length);
  switch (true) {
    case newValue === '':
      stationRef.value[index].innerText = "Empty data";
      break;
    case newArr.length < 3:
      stationRef.value[index].innerText = "Error format";
      break;
    case (hashMapStation[newArr[0]] === undefined || hashMapStation[newArr[1]] === undefined):
      stationRef.value[index].innerText = "";
      break;
    default:
      break;
  }
}

const startTest = () => {

};

const trainRef = ref([]);
const stationRef = ref([]);
</script>

<template>
  <div class="main-page">
    <main class="main-page__settings">
      <h1 class="main-page__title">Settings</h1>

      <set-tmp class="main-page__tmp" @action="tt += 1">
        <template #body>
          <h2>Stations</h2>

          <p>set line like id:id:length</p>

          <div v-for="(station, index) in stationsArr" :key="index" class="input-card">
            <span :ref="(el) => { stationRef[index] = el }" class="input-card__err"></span>

            <input placeholder="set line like id:id:length" type="text" class="input-card__input"
              :value="station.join(':')" @input="updateStation(index, $event.target.value)"
              @change="createPoints(index, $event.target.value)">

            <button class="input-card__btn" @click="tt -= 1">
              <img src="/delete.svg" alt="del" class="input-card__img">
            </button>
          </div>
        </template>

        <template #button>
          Add Station
        </template>
      </set-tmp>

      <set-tmp class="main-page__tmp" @action="tt2 += 1">
        <template #body>
          <h2>Trains</h2>

          <p>set roadmap like station:station:...:station</p>

          <div v-for="(train, index) in roadmapsArr" :key="index" class="input-card">
            <span :ref="(el) => { trainRef[index] = el }" class="input-card__err"></span>

            <input placeholder="set roadmap like station:station:...:station" type="text" class="input-card__input"
              :value="roadmapsArr[index].join(':')" @input="updateRoadMap(index, $event.target.value)"
              @change="createPoints(index, $event.target.value)" />

            <button class="input-card__btn" @click="tt2 -= 1">
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
    overflow: auto;
  }

  &__tmp {
    margin: 50px 0;
  }

  // .main-page__info
  &__info {
    border: 40px outset #67696bf6;
    flex-basis: 68%;
    padding: 5px 10px 5px;
    margin: 0 10px 10px;

    overflow: auto;
  }

  &__btn {
    width: 100%;
    height: 35px;
    font-size: 20px;
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
</style>

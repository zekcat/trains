import { findStationPath } from "@/controller/station";
// import TrainInfo from "@/controller/TrainInfo";
import InfoLog from "@/controller/InfoLog";


export const infoLog = new InfoLog();

/**
 * @private
 * @function _createRoadStates
 * @description собираем массив нахождения поезда в каждый конкретный момент пути
 * @param { Object } params
 * * @param { Number } params.stationLength 
 * * @param { String | Number } params.currIdStation
 * * @param { String | Number } params.nextIdStation
 * * @param { Array } params.state
 * @returns { undefined }
 */
const _createRoadStates = ({ stationLength, currIdStation, nextIdStation, state }) => {
    for (let i = 0; i < stationLength; i += 1) {
        switch (true) {
            case state.length === 0:
                state.push(currIdStation)

                continue;
            case i === stationLength - 1:
                state.push(nextIdStation)

                continue;
            default:
                state.push(currIdStation + ":" + nextIdStation);
        }
    }
};

/**
 * @private
 * @function _checkMaxLength
 * @description проверка больше ли новое значение длинны
 * @param {Number} maxLength 
 * @param {Number} newLength 
 * @returns {Boolean}
 */
const _checkMaxLength = (maxLength, newLength) => {
    if (isNaN(Number(maxLength)) && isNaN(Number(newLength))) return false;

    return maxLength < newLength;
};

/**
 * @private
 * @function _initStates
 * @description инитим местоположения поездов в разлиный момент итераций
 * и находим максимальную длину пути которую проходит поезд 
 * @param {Object} train - передаем экзеипляр поезда класса {@link Train}  
 * @returns 
 */
const _initStates = (train) => {
    const { name: trainName, roadMap } = train;

    let findRoadLength = 0;

    const state = [];

    roadMap.forEach((el, index) => {
        if (el === roadMap.at(-1)) return;

        const currIdStation = el;
        const nextIdStation = roadMap[index + 1];

        const idStations = `${currIdStation}:${nextIdStation}`;

        const pathStationBtween = findStationPath(idStations);

        if (pathStationBtween === undefined) return;

        const stationLength = pathStationBtween[2];
        findRoadLength += stationLength;

        _createRoadStates({ stationLength, currIdStation, nextIdStation, state, trainName });
    })

    return { findRoadLength, state };
};

/**
 * @private
 * @function _initRoads
 * @description находим наибольшую длину пути, создаем обьект
 * местоположения поездов в различные моменты итераций
 * @param {*} trains 
 * @returns 
 */
const _initRoads = (trains) => {
    let maxLength = 0;

    let states = {};

    trains.forEach((train) => {
        const { findRoadLength, state } = _initStates(train, states);

        const trainName = train.name;
        states[trainName] = state;

        if (_checkMaxLength(maxLength, findRoadLength)) maxLength = findRoadLength;
    });

    return { maxLength, states };
}


const _setCrushTrain = ({ states, idValue, trainsWork, name }) => {
    states[name] = [idValue];
    delete trainsWork[name];
};

const _createTicket = () => {
    return { trainNames: [], iteration: -1, logs: '' };
};

const _initTicket = ({ tiket, place, value, msgByPrevEvent, index, logMsg, states, trainsWork, name }) => {
    const reverseValue = value.split(":").reverse().join(":");

    switch (true) {
        case !!(tiket[reverseValue] === undefined && msgByPrevEvent):
            console.log("inside");
            tiket[reverseValue] = _createTicket();
            tiket[reverseValue].iteration = index;

            logMsg += `произошло столкновение поезда  ${name} ${place} ${value} ${msgByPrevEvent}`;

            tiket[reverseValue].trainNames.push(name);
            tiket[reverseValue].logs = logMsg;
            _setCrushTrain({ states, idValue: reverseValue, trainsWork, name });
            return;
        case tiket[reverseValue] !== undefined:
            if (tiket[reverseValue].iteration === -1) tiket[reverseValue].iteration = index;

            if (tiket[reverseValue].trainNames.length === 1) {
                const [getSecondTrainName] = tiket[reverseValue].trainNames;
                _setCrushTrain({ states, idValue: reverseValue, trainsWork, name: getSecondTrainName });
            }

            tiket[reverseValue].trainNames.push(name);
            logMsg += `произошло столкновение поездов  ${tiket[reverseValue].trainNames.join(", ")} ${place} ${value} ${msgByPrevEvent}`;
            tiket[reverseValue].logs = logMsg;
            _setCrushTrain({ states, idValue: reverseValue, trainsWork, name });

            return;
        case tiket[value] === undefined:
            tiket[value] = _createTicket();
            tiket[value].trainNames.push(name);
            return;
        default:
            return;
    }
};

/**
 * @private
 * @function _testIterationEvent
 * @description 
 * @param {*} param0 
 */
const _testIterationEvent = ({ states, trainNames, index, trainsWork }) => {
    const tiket = {};

    trainNames.forEach((name) => {
        if (trainsWork[name] === undefined) return;

        let value = states[name][index] ?? states[name].at(-1);

        let logMsg = `итерация ${index}: `;
        // определяем где произошла проблема
        const place = value.split(":").length === 1 ? "на станции" : "на линии";

        // проверяем наличие уже случившегося события, создаем строку для добавления информации
        const prevEvent = infoLog.checkOnEvent(value);
        console.log("prevEvent", prevEvent);
        const msgByPrevEvent = prevEvent === undefined ? "" : `с поездами ${prevEvent.trainNames.join(", ")} находящимися в аварии`;

        _initTicket({ tiket, place, value, msgByPrevEvent, index, logMsg, states, trainsWork, name })
    });

    infoLog.updateEvent(tiket);
};

/**
 * @function controller
 * @description проверяем условия по избежанию аварии на транспортных путях
 * @param {*} trains 
 */
export const controller = (trains) => {
    let { maxLength: maxRoadTrain, states } = _initRoads(trains);

    const trainNames = Object.keys(states);

    const trainsWork = {};
    trainNames.forEach((name) => trainsWork[name] = true);

    // проходим по максимальному пути поезда проверяем возможные события
    for (let index = 0; index < maxRoadTrain; index += 1) {
        if (Object.keys(trainsWork).length === 0) break;

        _testIterationEvent({ states, trainNames, index, trainsWork });
    }
};
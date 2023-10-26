/**
 * @description Задаем графы с длиной линий
 * храним станции и расстояния между ними
 */
export const stations = [['123', '321', 20], ['123', '213', 12], ['321', '213', 4], ['213', '132', 10], ['321', '132', 5]];


export const hashMapStation = {};

const initHashMap = () => {
    stations.forEach((el) => {
        if (hashMapStation[el[0]] === undefined) hashMapStation[el[0]] = true;
        if (hashMapStation[el[1]] === undefined) hashMapStation[el[1]] = true;
    });

    console.log("hashMapStation", hashMapStation);
};

initHashMap();

/**
 * @public
 * @function findStationPath
 * @description поиск пути между станциями
 * @param {String} idStations - id точки отправления и назначения 
 * @returns { Object | undefined }
 */
export const findStationPath = (idStations) => {
    return stations.find((item) => `${item[0]}:${item[1]}` === idStations ||
        `${item[1]}:${item[0]}` === idStations);
}

/**
 * @description на основе существущих станций можем генерить маршруты
 * генерить маршруты будем по количеству поездов
 */
export const roadmaps = {
    1: ['123', '321', '213', '132'],
    2: ['213', '321', '123'],
    3: ['132', '213', '123', '321'],
};


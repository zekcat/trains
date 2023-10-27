import { Train } from '@/controller/Train';

/**
 * @function createTrans
 * @description создаем и возвращаем нужное количество поездов
 * @param {Number} numberOfTrains - количество поездов
 * @returns {Array} - массив с поездами
 */
export const createTrains = (numberOfTrains, roadMaps) => {
    const trainsNumParse = Number.parseInt(numberOfTrains, 10);

    if (isNaN(trainsNumParse)) return;

    const trains = [];

    for (let num = 0; num < numberOfTrains; num += 1) {
        const trainParams = {
            model: "train-m001",
            name: `name-${num + 1}`,
            roadMap: roadMaps[num],
            log: [],
            isWork: true,
        }

        trains.push(new Train(trainParams));
    }
    return trains
};
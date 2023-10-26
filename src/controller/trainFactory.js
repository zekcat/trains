import { Train } from '@/controller/Train';
import { roadmaps } from "@/controller/station";

/**
 * @function createTrans
 * @description создаем и возвращаем нужное количество поездов
 * @param {Number} numberOfTrains - количество поездов
 * @returns {Array} - массив с поездами
 */
export const createTrains = (numberOfTrains) => {
    const trainsNumParse = Number.parseInt(numberOfTrains, 10);

    if (isNaN(trainsNumParse)) return;

    const trains = [];

    for (let num = 0; num < numberOfTrains; num += 1) {
        const trainParams = {
            model: "train-m001",
            name: `name-${num + 1}`,
            roadMap: roadmaps[num + 1],
            log: [],
            isWork: true,
        }

        trains.push(new Train(trainParams));
    }
    console.log("createTrains", trains);
    return trains
};
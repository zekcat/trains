import { describe, expect, test } from "vitest";
import { createTrains } from "@/controller/trainFactory";

describe("unit tests by create trains", () => {
    const getReqParams = () => {
        const numberOfTrains = 3;
        const roadMaps = [[2], [2]];

        return { numberOfTrains, roadMaps };
    };

    test("check createTrains on curr work with all params", () => {
        const { numberOfTrains, roadMaps } = getReqParams();

        const trains = createTrains(numberOfTrains, roadMaps);
        expect(trains).toHaveLength(numberOfTrains);
    });

    test("check createTrains on curr work without roadMaps", () => {
        const { numberOfTrains } = getReqParams();

        const withOutRoadMaps = createTrains(numberOfTrains);
        expect(withOutRoadMaps).toHaveLength(numberOfTrains);
    });

    test("check createTrains on curr work with out numberOfTrains", () => {
        const { roadMaps } = getReqParams();

        const withOutParams = createTrains(undefined, roadMaps);
        expect(withOutParams).toHaveLength(0);
    });

    test("check createTrains on curr work with out params", () => {
        const withOutParams = createTrains();
        expect(withOutParams).toHaveLength(0);
    });
});
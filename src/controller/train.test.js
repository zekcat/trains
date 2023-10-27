import { describe, expect, test} from "vitest";
import { Train } from "@/controller/Train";
describe("unit tests train class", () => {
    const initClass = () => {
        const trainParams = {
            model: "train-m001",
            name: `test-1`,
            roadMap: ["T", "E", "S", "T"],
            log: [],
            isWork: true,
        };

        const train = new Train(trainParams);

        return { train, trainParams };
    };

    test("validate that functions exist", async () => {
        const { train } = initClass();

        expect(!!train.getName).toBe(true);
        expect(!!train.getWorkState).toBe(true);
        expect(!!train.updateWorkState).toBe(true);
    });

    test("check functions work", async () => {
        const { train, trainParams } = initClass();

        expect(train.getName()).toBe(trainParams.name);
        expect(train.getWorkState()).toBe(trainParams.isWork);

        await train.updateWorkState(false);
        expect(train.getWorkState()).not.toBe(trainParams.isWork);
    });
});

export class Train {
    model;
    name;
    roadMap;
    log;
    isWork;

    constructor({ model, name, roadMap, log = [], isWork = true }) {
        this.model = model;
        this.name = name;
        this.roadMap = roadMap;
        this.log = log;
        this.isWork = isWork;
    }

    getName() {
        return this.name;
    }

    updateWorkState(isWork) {
        this.isWork = isWork;
    }

    getWorkState() {
        return this.isWork;
    }
}
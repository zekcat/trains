export default class InfoLog {
    events = {};

    updateEvent(events) {
        Object.entries(events).forEach(([key, event]) => {
            const { iteration, logs, trainNames } = event;

            if (iteration === -1) return;

            const currKey = this.events[key] ? key : this._getReverseKey(key);

            if (this.events[currKey] === undefined) {
                this.events[key] = {
                    logs: [],
                    trainNames: [],
                }

                this.events[key].logs.push(logs);
                this.events[key].trainNames = trainNames;
                return;
            }

            console.log('currKey', currKey, key);
            this.events[currKey].logs.push(logs);
            this.events[currKey].trainNames = this.events[currKey].trainNames.concat(trainNames);
        });
    }

    _getReverseKey(key) {
        return key.split(":").reverse().join(":")
    }

    checkOnEvent(keyEvent) {
        const revKey = this._getReverseKey(keyEvent);
        return this.events[keyEvent] ?? this.events[revKey];
    }

    get getEvents() {
        let arrEvents = [];
        Object.values(this.events).forEach((el) => { arrEvents = arrEvents.concat(el.logs) })
        return arrEvents;
    }
}
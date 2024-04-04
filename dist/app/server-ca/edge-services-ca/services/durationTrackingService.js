"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { PerformanceObserver, performance } = require('perf_hooks');
const uuid_1 = require("uuid");
const ENTRY_TYPE_MEASURE = 'measure';
const START_PREFIX = 'start_';
const END_PREFIX = 'end_';
const MEASURE_PREFIX = 'measure_';
class DurationTrackingService {
    constructor() {
        this.entries = null;
        new PerformanceObserver(items => {
            this.entries = items.getEntries();
        }).observe({ entryTypes: [ENTRY_TYPE_MEASURE] });
    }
    start() {
        const id = uuid_1.v4();
        performance.mark(`${START_PREFIX}${id}`);
        return id;
    }
    end(id) {
        performance.mark(`${END_PREFIX}${id}`);
        performance.measure(`${MEASURE_PREFIX}${id}`, `${START_PREFIX}${id}`, `${END_PREFIX}${id}`);
        performance.clearMarks(`${START_PREFIX}${id}`);
        performance.clearMarks(`${END_PREFIX}${id}`);
        return this._getDuration(id);
    }
    _getDuration(id) {
        const measureName = `${MEASURE_PREFIX}${id}`;
        const entry = this.entries && this.entries.find(item => item.name === measureName);
        if (measureName) {
            performance.clearMeasures(measureName);
        }
        return entry ? entry.duration : 0;
    }
}
module.exports = new DurationTrackingService();
//# sourceMappingURL=durationTrackingService.js.map
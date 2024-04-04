"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs-extra"));
const node_cron_1 = require("node-cron");
const path_1 = require("path");
const constants_1 = require("../config/constants");
const externalDependencies_1 = require("../externalDependencies");
class ReportStoreJob {
    constructor() {
        this.storeDir = path_1.resolve(__dirname, '..', constants_1.REPORTS_STORE_DIR);
        this.createStore();
    }
    start() {
        if (!this.jobTask) {
            this.jobTask = node_cron_1.schedule(this.getRandomTimeRule(), () => {
                this.clearStore();
            });
        }
        this.jobTask.start();
        externalDependencies_1.logService.info(constants_1.REPORT_CLEANING_JOB_START);
    }
    stop() {
        this.jobTask.stop();
        externalDependencies_1.logService.info(constants_1.REPORT_CLEANING_JOB_STOP);
    }
    createStore() {
        try {
            fs.ensureDirSync(this.storeDir);
        }
        catch (error) {
            if (error.code !== 'EEXIST') {
                externalDependencies_1.logService.error(constants_1.CREATING_REPORTS_STORE_FAIL_MESSAGE, error);
            }
        }
    }
    getRandomTimeRule() {
        const randomHour = Math.random() * constants_1.REPORT_HOURS;
        const hour = Math.floor(randomHour);
        const minute = Math.floor((randomHour - hour) * constants_1.REPORT_MINUTES);
        return `${minute} ${hour} * * *`;
    }
    clearStore() {
        externalDependencies_1.logService.info(constants_1.REPORT_CLEANING_JOB_RUN);
        fs.readdir(this.storeDir, (err, dirList) => {
            if (err) {
                externalDependencies_1.logService.error(constants_1.REPORT_CLEANING_JOB_REPORTS_UNAVAILABLE_ERROR_MESSAGE, err);
                return;
            }
            const date = Number(new Date());
            dirList.forEach(file => {
                const filePath = path_1.join(this.storeDir, file);
                fs.stat(filePath, (statsError, stats) => {
                    if (statsError) {
                        externalDependencies_1.logService.error(constants_1.REPORT_CLEANING_JOB_REPORT_STATS_UNAVAILABLE_ERROR_MESSAGE, statsError);
                        return;
                    }
                    if (date - Number(stats.mtime) > constants_1.REPORTS_SAFE_PERIOD) {
                        fs.unlinkSync(filePath);
                        externalDependencies_1.logService.info(`${file} ${constants_1.REPORT_CLEANING_JOB_REMOVE}`);
                    }
                });
            });
        });
    }
}
exports.default = new ReportStoreJob();
//# sourceMappingURL=reportStoreJob.js.map
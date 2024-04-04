"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmartChartsTopic = void 0;
const first_1 = __importDefault(require("lodash/first"));
const last_1 = __importDefault(require("lodash/last"));
const pull_1 = __importDefault(require("lodash/pull"));
class SmartChartsTopic {
    constructor(topic, parent) {
        this.id = topic.id;
        this.title = topic['title'];
        this.parent = parent;
        this.children = [];
    }
    getPathTitles() {
        const fullPath = this.getFullPath();
        return pull_1.default(fullPath, first_1.default(fullPath), last_1.default(fullPath)).map((topic) => topic.title);
    }
    getFullPath() {
        return this.parent ? this.parent.getFullPath().concat(this) : [this];
    }
}
exports.SmartChartsTopic = SmartChartsTopic;
//# sourceMappingURL=SmartChartsTopic.js.map
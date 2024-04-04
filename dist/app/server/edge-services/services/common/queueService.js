"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueService = void 0;
const queue_1 = __importDefault(require("queue"));
const constants_1 = require("../../config/constants");
class QueueService {
    constructor(config = {}) {
        this.queue = queue_1.default(Object.assign(Object.assign({}, constants_1.DEFAULT_QUEUE_CONFIG), config));
    }
    getLength() {
        return this.queue.length;
    }
    pushPromiseAction(action) {
        this.queue.push(cb => action().then(cb));
    }
    pushAction(action) {
        this.queue.push(cb => cb(action()));
    }
}
exports.QueueService = QueueService;
exports.default = new QueueService();
//# sourceMappingURL=queueService.js.map
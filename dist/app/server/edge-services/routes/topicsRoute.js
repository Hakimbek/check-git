"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const topicService_1 = __importDefault(require("../services/topics/topicService"));
class TopicsRoute {
    topicRequestHandler(req, res) {
        topicService_1.default.makeTopicsRequest(req, res);
    }
    topicRedirectHandler(req, res) {
        topicService_1.default.redirectTopicRequest(req, res);
    }
    middleware(req, res, next) {
        next();
    }
}
exports.default = new TopicsRoute();
//# sourceMappingURL=topicsRoute.js.map
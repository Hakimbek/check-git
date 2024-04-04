"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = require("body-parser");
const express_1 = require("express");
const path_1 = require("path");
const serve_static_1 = __importDefault(require("serve-static"));
const reportRoute_1 = __importDefault(require("./reportRoute"));
const constants_1 = require("../../config/constants");
class Routes {
    constructor() {
        this.router = express_1.Router();
        this.router.use('/document', serve_static_1.default(path_1.resolve(__dirname, '../..', constants_1.REPORTS_STORE_DIR)));
        this.router.post('/topic-list', body_parser_1.json(), reportRoute_1.default.middleware, reportRoute_1.default.topicReportHandler);
    }
}
exports.default = new Routes().router;
//# sourceMappingURL=routes.js.map
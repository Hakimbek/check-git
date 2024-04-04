"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const compression_1 = __importDefault(require("compression"));
const express_1 = require("express");
const edge_services_1 = require("../edge-services");
class Routes {
    constructor() {
        this.router = express_1.Router();
        this.router.use(compression_1.default());
        this.router.use('/services', edge_services_1.servicesAPIRouter);
    }
}
exports.default = new Routes().router;
//# sourceMappingURL=routes.js.map
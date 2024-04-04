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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.smartChartsRouter = void 0;
const bodyParser = __importStar(require("body-parser"));
const express_1 = require("express");
const SmartChartService = __importStar(require("./SmartCharts.service"));
const constants_1 = require("../../config/constants");
const externalDependencies_1 = require("../../externalDependencies");
function getTopHitSmartChart(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { query, states } = req.body;
            const topHitSmartCharts = yield SmartChartService.getTopHitSmartCharts(req, query, states);
            res.send(topHitSmartCharts);
        }
        catch (error) {
            console.log(error);
            res.status((_a = error.status) !== null && _a !== void 0 ? _a : constants_1.RESPONSE_STATUSES.INTERNAL_SERVER_ERROR).send({ error: error.message });
        }
    });
}
function setIsFreemiumMiddleware(req, res, next) {
    req.isFreemium = externalDependencies_1.userTypeService.isFreemium(req);
    next();
}
// Full API url:
// /service/edge/services/search/smart-chart
const router = express_1.Router();
router.post('/top-hit', setIsFreemiumMiddleware, bodyParser.json(), getTopHitSmartChart);
exports.smartChartsRouter = router;
//# sourceMappingURL=SmartCharts.routes.js.map
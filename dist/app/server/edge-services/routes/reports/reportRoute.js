"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../config/constants");
const externalDependencies_1 = require("../../externalDependencies");
const cryptoService_1 = __importDefault(require("../../services/common/cryptoService"));
const reportService_1 = __importDefault(require("../../services/report/reportService"));
class ReportRoute {
    topicReportHandler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const emailList = yield cryptoService_1.default.encoding(req.body.emailList.toString());
            if (reportService_1.default.isGenerationQueueFull()) {
                externalDependencies_1.logService.info(constants_1.REPORT_GENERATION_LOCKED, { emailList });
                res.sendStatus(constants_1.RESPONSE_STATUSES.LOCKED);
            }
            else {
                externalDependencies_1.logService.info(constants_1.REPORT_GENERATION_OK, { emailList });
                reportService_1.default.sendTopicListCSVReport(req);
                res.sendStatus(constants_1.RESPONSE_STATUSES.SUCCESS);
            }
        });
    }
    middleware(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            next();
        });
    }
}
exports.default = new ReportRoute();
//# sourceMappingURL=reportRoute.js.map
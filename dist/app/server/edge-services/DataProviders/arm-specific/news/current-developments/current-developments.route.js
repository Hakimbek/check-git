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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentDevelopmentsMiddleware = void 0;
const express_1 = require("express");
const current_developments_service_1 = require("./current-developments.service");
const logger_1 = require("../../../../utils/logger");
const arm_data_providers_constants_1 = require("../../arm.data-providers.constants");
// /service/edge/services/arm/news/current-developments/wnc/last-three-months-items
function getCurrentDevelopmentsMiddleware() {
    const router = express_1.Router();
    const currentDevelopementsService = current_developments_service_1.getCurrentDevelopmentsService();
    router.get('/current-developments/wnc/last-three-months-items', logger_1.withAsyncRequestLogging((req, resp) => __awaiter(this, void 0, void 0, function* () {
        try {
            const wncLastThreeMonthsItems = yield currentDevelopementsService.getWNCLastThreeMonthsItems(req);
            resp.setHeader('Content-Type', 'application/json');
            resp.status(arm_data_providers_constants_1.RESPONSE_STATUSES.SUCCESS).send(wncLastThreeMonthsItems);
        }
        catch (error) {
            resp.status(arm_data_providers_constants_1.RESPONSE_STATUSES.INTERNAL_SERVER_ERROR).send(error);
            throw error;
        }
    }), {
        enableStdOutput: true,
        getErrorMessage: (error) => `[ARMAC] Cannot get wncLastThreeMonthsItems: ${error.message}`,
        getSuccessMessage: () => `[ARMAC] Getting wncLastThreeMonthsItems successful`,
    }));
    return {
        router,
        services: { currentDevelopementsService },
    };
}
exports.getCurrentDevelopmentsMiddleware = getCurrentDevelopmentsMiddleware;
//# sourceMappingURL=current-developments.route.js.map
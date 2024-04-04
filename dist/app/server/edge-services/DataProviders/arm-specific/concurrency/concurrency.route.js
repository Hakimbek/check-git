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
exports.getConcurrencyCoreMiddleware = void 0;
const express_1 = require("express");
const concurrency_service_1 = require("./concurrency.service");
const externalDependencies_1 = require("../../../externalDependencies");
const arm_data_providers_constants_1 = require("../arm.data-providers.constants");
function getConcurrencyCoreMiddleware() {
    const router = express_1.Router();
    const concurrencyService = new concurrency_service_1.ConcurrencyCore({ logService: externalDependencies_1.logService, analyticsService: externalDependencies_1.analyticsService });
    router.get('/concurrency/release-document', (req, resp, _next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const releasedSeatsNumber = yield concurrencyService.releaseSeat(req.forwardedSub);
            resp.status(arm_data_providers_constants_1.RESPONSE_STATUSES.SUCCESS).send(`${releasedSeatsNumber}`);
        }
        catch (error) {
            resp.status(arm_data_providers_constants_1.RESPONSE_STATUSES.INTERNAL_SERVER_ERROR).send(error);
        }
    }));
    return {
        router,
        services: { concurrency: concurrencyService },
    };
}
exports.getConcurrencyCoreMiddleware = getConcurrencyCoreMiddleware;
//# sourceMappingURL=concurrency.route.js.map
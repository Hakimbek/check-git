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
exports.trialUserRouter = void 0;
const trialUserService_1 = require("../services/trialUserService");
const express_1 = require("express");
const { RESPONSE_STATUSES } = require('../config/appConfig');
const router = express_1.Router();
router.post('/CreateTrialUser', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield trialUserService_1.TrialUserService.createTrialUser(req, res);
    }
    catch (error) {
        res.status(RESPONSE_STATUSES.INTERNAL_SERVER_ERROR).send(error.message);
    }
}));
router.post('/ActivateTrialUser', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield trialUserService_1.TrialUserService.ActivateTrialUser(req, res);
    }
    catch (error) {
        res.status(RESPONSE_STATUSES.INTERNAL_SERVER_ERROR).send(error.message);
    }
}));
exports.trialUserRouter = router;
//# sourceMappingURL=trialUserRoute.js.map
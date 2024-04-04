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
exports.beyondRouter = void 0;
const express_1 = require("express");
const beyond_service_1 = require("./beyond.service");
const constants_1 = require("../../config/constants");
const beyondService = beyond_service_1.getBeyondService();
function harvest(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { harvestData } = req.body;
            yield beyondService.harvest(req, harvestData);
            res.send({});
        }
        catch (error) {
            res.status((_a = error.status) !== null && _a !== void 0 ? _a : constants_1.RESPONSE_STATUSES.INTERNAL_SERVER_ERROR).send({ error: error.message });
        }
    });
}
function retrieveAnswers(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { answersParams } = req.body;
            const answers = yield beyondService.retrieveAnswers(req, answersParams);
            res.send(answers);
        }
        catch (error) {
            res.status((_a = error.status) !== null && _a !== void 0 ? _a : constants_1.RESPONSE_STATUSES.INTERNAL_SERVER_ERROR).send({ error: error.message });
        }
    });
}
function warmEntitlementsCache(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield beyondService.warmEntitlementsCache(req);
            res.send();
        }
        catch (error) {
            res.status((_a = error.status) !== null && _a !== void 0 ? _a : constants_1.RESPONSE_STATUSES.INTERNAL_SERVER_ERROR).send({ error: error.message });
        }
    });
}
function retrieveSuggestions(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { body: { query, dictionary, scope }, } = req;
            const answers = yield beyondService.retrieveSuggestions(req, query, dictionary, scope);
            res.send(answers);
        }
        catch (error) {
            res.status((_a = error.status) !== null && _a !== void 0 ? _a : constants_1.RESPONSE_STATUSES.INTERNAL_SERVER_ERROR).send({ error: error.message });
        }
    });
}
// Full API url:
// /service/edge/services/beyond
const router = express_1.Router();
router.post('/harvest', harvest);
router.post('/retrieve-answers', retrieveAnswers);
router.post('/retrieve-suggestions', retrieveSuggestions);
router.get('/warm-entitlements-cache', warmEntitlementsCache);
exports.beyondRouter = router;
//# sourceMappingURL=beyond.routes.js.map
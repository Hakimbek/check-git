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
exports.urmRouter = void 0;
const express_1 = require("express");
const urm_service_1 = require("./urm.service");
const constants_1 = require("../../config/constants");
const urmService = urm_service_1.getURMService();
function getUserSubscriptionsStatus(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield urmService.getUserSubscriptionsStatus(req);
            res.send(response);
        }
        catch (error) {
            res.status((_a = error.status) !== null && _a !== void 0 ? _a : constants_1.RESPONSE_STATUSES.INTERNAL_SERVER_ERROR).send({ error: error.message });
        }
    });
}
// Full API url:
// /service/edge/services/urm
const router = express_1.Router();
router.get('/get-user-subscriptions-status', getUserSubscriptionsStatus);
exports.urmRouter = router;
//# sourceMappingURL=urm.routes.js.map
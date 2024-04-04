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
exports.userSubscriptionsServiceRouter = void 0;
const express_1 = require("express");
const constants_1 = require("./constants");
const user_subscriptions_services_1 = require("./user-subscriptions.services");
const constants_2 = require("../../../config/constants");
function sendUserSubscriptions(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userSubscriptions = yield user_subscriptions_services_1.getUserSubscriptions(req);
            res.send({ userSubscriptions: userSubscriptions });
        }
        catch (error) {
            res.status((_a = error.status) !== null && _a !== void 0 ? _a : constants_2.RESPONSE_STATUSES.INTERNAL_SERVER_ERROR).send({ error: error.message });
        }
    });
}
const router = express_1.Router();
router.post(constants_1.USER_SUBSCRIPTIONS_URL, sendUserSubscriptions);
exports.userSubscriptionsServiceRouter = router;
//# sourceMappingURL=user-subscriptions.routes.js.map
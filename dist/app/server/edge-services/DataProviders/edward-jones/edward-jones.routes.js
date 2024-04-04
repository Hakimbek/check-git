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
exports.edwardJonesRouter = void 0;
const express_1 = require("express");
const edward_jones_service_1 = require("./edward-jones.service");
const constants_1 = require("../../config/constants");
const edwardJonesService = edward_jones_service_1.getEdwardJonesService();
function validateCouponCode(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { body: { userCouponCode }, } = req;
            const response = yield edwardJonesService.validateCouponCode(req, userCouponCode);
            res.send(response);
        }
        catch (error) {
            res.status((_a = error.status) !== null && _a !== void 0 ? _a : constants_1.RESPONSE_STATUSES.INTERNAL_SERVER_ERROR).send({
                error: error.message,
            });
        }
    });
}
// Full API url:
// /service/edge/services/edward-jones
const router = express_1.Router();
router.post('/validate-code', validateCouponCode);
exports.edwardJonesRouter = router;
//# sourceMappingURL=edward-jones.routes.js.map
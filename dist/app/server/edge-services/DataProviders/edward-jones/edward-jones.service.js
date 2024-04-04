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
exports.getEdwardJonesService = void 0;
function getEdwardJonesService() {
    function validateCouponCode(req, userCouponCode) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validCouponCodes = JSON.parse(((_a = process === null || process === void 0 ? void 0 : process.env) === null || _a === void 0 ? void 0 : _a.AWS_EDWARD_JONES_COUPON_CODES_KEY) || '') || [];
                const isUserCouponCodeValid = validCouponCodes.some(validCode => validCode.toLocaleLowerCase() === userCouponCode.toLocaleLowerCase());
                return { isUserCouponCodeValid };
            }
            catch (error) {
                throw error;
            }
        });
    }
    return {
        validateCouponCode,
    };
}
exports.getEdwardJonesService = getEdwardJonesService;
//# sourceMappingURL=edward-jones.service.js.map
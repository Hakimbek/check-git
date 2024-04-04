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
exports.hasAccessToProduct = exports.isShowLicenseAgreementByPreference = void 0;
const DAO = __importStar(require("./SubcriptionServiceDAO.osa2"));
const varsService_1 = require("../../../services/varsService");
const LICENSE_AGREEMENT_PREFERENCE_KEY = 'answerconnect.license.agreement.accepted';
const PRODUCT_ID = varsService_1.VarsService.get('cpid');
const isShowLicenseAgreementByPreference = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const preference = yield DAO.getPreference(req, LICENSE_AGREEMENT_PREFERENCE_KEY);
    if (!preference || !(preference === null || preference === void 0 ? void 0 : preference.length)) {
        return true;
    }
    return preference.shift().value !== 'true';
});
exports.isShowLicenseAgreementByPreference = isShowLicenseAgreementByPreference;
const hasAccessToProduct = req => DAO.getProducts(req).then(productList => productList.includes(PRODUCT_ID));
exports.hasAccessToProduct = hasAccessToProduct;
//# sourceMappingURL=SubcriptionService.js.map
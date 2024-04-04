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
exports.getSessions = exports.getProducts = exports.getPreference = void 0;
const osa_personalitem_1 = require("@wk/osa-personalitem");
const osa_identity_1 = require("@wk/osa-identity");
const { osaService } = require('@wk/acm-osa-service/edge-services');
const getPreference = (req, preferenceKey) => __awaiter(void 0, void 0, void 0, function* () {
    const osaPersonalItemService = osaService.createDomainServiceInstance(osa_personalitem_1.PersonalitemOsaService, osa_personalitem_1.domain.name, req);
    return osaPersonalItemService.preferences.many({ $filter: `Id eq '${preferenceKey}'` });
});
exports.getPreference = getPreference;
const getProducts = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const identityService = osaService.createDomainServiceInstance(osa_identity_1.IdentityOsaService, osa_identity_1.domain.name, req);
        return yield identityService.products.many().then(products => products.map(product => product.id));
    }
    catch (error) {
        return [];
    }
});
exports.getProducts = getProducts;
const getSessions = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const identityService = osaService.createDomainServiceInstance(osa_identity_1.IdentityOsaService, osa_identity_1.domain.name, req);
    return identityService.sessions.many().catch(() => []);
});
exports.getSessions = getSessions;
//# sourceMappingURL=SubcriptionServiceDAO.osa2.js.map
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUserAdministrationUrl = exports.getUserProfile = exports.getUserPreferences = void 0;
const pick_1 = __importDefault(require("lodash/pick"));
const edge_services_1 = require("@wk/acm-osa-service/edge-services");
const osa_identity_1 = require("@wk/osa-identity");
const osa_personalitem_1 = require("@wk/osa-personalitem");
const constants_1 = require("./constants");
const externalDependencies_1 = require("../../../externalDependencies");
const icAdminUrl = externalDependencies_1.vars.get('ICAdminUrl');
const velvetCPID = externalDependencies_1.vars.get('velvet-cpid');
const getICAdminUserAdministrationURL = (loginId, parameter) => `${icAdminUrl}manageEndUserProfileArmEndUserAdministration.do?GUID=${loginId}&AtlasTicket=[{cc|session.user.ticket}]&cpid=${velvetCPID}&parameter=${parameter}`;
const getUserPreferences = (req, params) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const osaPersonalItemService = edge_services_1.osaService.createDomainServiceInstance(osa_personalitem_1.PersonalitemOsaService, osa_personalitem_1.domain.name, req);
        const preferencesFilter = params.filters.length
            ? params.filters.map(filter => `${filter}`).join(' or ')
            : undefined;
        const userPreferences = yield osaPersonalItemService.preferences.many({
            $filter: preferencesFilter,
        });
        return userPreferences.map(preference => pick_1.default(preference, ['id', 'value']));
    }
    catch (error) {
        throw new Error(error);
    }
});
exports.getUserPreferences = getUserPreferences;
function getUserProfile(req) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const identityService = edge_services_1.osaService.createDomainServiceInstance(osa_identity_1.IdentityOsaService, osa_identity_1.domain.name, req);
            const profile = (yield identityService.profiles.many())[0];
            return {
                id: profile.id,
                userFirstName: profile.userFirstName,
                userLastName: profile.userLastName,
                userEmail: profile.userEmail,
                userKeyId: (_a = profile.user.userKey) === null || _a === void 0 ? void 0 : _a.id,
                loginId: (_b = profile.user.loginId) === null || _b === void 0 ? void 0 : _b.id,
                isTrialUser: profile.accountNumber.startsWith(constants_1.TRIAL_USER_ACCOUNT_NUMBER_PREFIX),
                accountNumber: profile.accountNumber,
            };
        }
        catch (error) {
            externalDependencies_1.logService.error(error);
            throw error;
        }
    });
}
exports.getUserProfile = getUserProfile;
const generateUserAdministrationUrl = (req, loginId) => __awaiter(void 0, void 0, void 0, function* () {
    const osaPersonalItemService = edge_services_1.osaService.createDomainServiceInstance(osa_personalitem_1.PersonalitemOsaService, osa_personalitem_1.domain.name, req);
    try {
        const userAdministrationUrl = yield osaPersonalItemService.getToolUrl(new osa_personalitem_1.GetToolUrl({
            toolLink: getICAdminUserAdministrationURL(loginId, constants_1.SHOW_ARM_END_USERS_IN_ACCOUNT_PARAM_VALUE),
        }));
        return userAdministrationUrl;
    }
    catch (error) {
        throw new Error(error);
    }
});
exports.generateUserAdministrationUrl = generateUserAdministrationUrl;
//# sourceMappingURL=user-administration.dao.osa2.js.map
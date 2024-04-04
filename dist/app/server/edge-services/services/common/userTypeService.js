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
exports.userTypeService = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const edge_services_1 = require("@wk/acm-osa-service/edge-services");
const profile_service_1 = require("@wk/acm-user-info/shared/src/profile/profile.service");
const osa_personalitem_1 = require("@wk/osa-personalitem");
const SITE_CONTACT_USER_AVAILABLE_VALUE = 'TRUE';
const SITE_CONTACT_VALUE_PATTERN = /SiteContactStatus&quot;:&quot;(.*)&quot;/;
const global_constants_1 = require("../../global.constants");
const icAdminUrl = global_constants_1.vars.get('ICAdminUrl');
const velvetCPID = global_constants_1.vars.get('velvet-cpid');
class UserTypeService {
    isSiteContactUser(req, userid) {
        return __awaiter(this, void 0, void 0, function* () {
            let userKeyId = userid;
            // TODO: pending fix from ICAdmin for trial user
            // delete after fix
            let isTrialUser = false;
            if (!userKeyId) {
                const userProfile = yield this.getUserProfile(req);
                userKeyId = userProfile === null || userProfile === void 0 ? void 0 : userProfile.userKeyId;
                isTrialUser = userProfile === null || userProfile === void 0 ? void 0 : userProfile.isTrialUser;
            }
            if (!userKeyId) {
                return false;
            }
            const response = yield this.getIsSiteContactUserStatus(req, userKeyId, isTrialUser);
            return response;
        });
    }
    getIsSiteContactUserStatus(req, userKeyId, isTrialUser) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: pending fix from ICAdmin for trial user
            // delete after fix
            if (isTrialUser) {
                return false;
            }
            const osaPersonalItemService = edge_services_1.osaService.createDomainServiceInstance(osa_personalitem_1.PersonalitemOsaService, osa_personalitem_1.domain.name, req);
            try {
                const siteContactUserStatusUrl = yield osaPersonalItemService.getToolUrl(new osa_personalitem_1.GetToolUrl({
                    toolLink: `${icAdminUrl}manageEndUserProfileArmEndUserAdministration.do?GUID=${userKeyId}&AtlasTicket=[{cc|session.user.ticket}]&cpid=${velvetCPID}&parameter=isARMEndUserSiteContact`,
                }));
                const response = yield node_fetch_1.default(siteContactUserStatusUrl);
                const responseText = yield ((_a = response.text) === null || _a === void 0 ? void 0 : _a.call(response));
                const siteContactStatus = (_c = (_b = responseText === null || responseText === void 0 ? void 0 : responseText.match) === null || _b === void 0 ? void 0 : _b.call(responseText, SITE_CONTACT_VALUE_PATTERN)) === null || _c === void 0 ? void 0 : _c[1];
                return siteContactStatus === SITE_CONTACT_USER_AVAILABLE_VALUE;
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
    getUserProfile(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userProfileService = edge_services_1.edgeServiceFactory.createEdgeServiceInstance(req, profile_service_1.ProfileService);
                const profile = yield userProfileService.profile();
                return profile;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.userTypeService = new UserTypeService();
//# sourceMappingURL=userTypeService.js.map
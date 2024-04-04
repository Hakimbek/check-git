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
exports.generateUserAdministrationUrl = exports.getIsUserContact = exports.getUserProfile = exports.getContactSites = void 0;
const DAO = __importStar(require("./user-administration.dao.osa2"));
const user_administration_dao_osa2_1 = require("./user-administration.dao.osa2");
const userTypeService_1 = require("../../../services/common/userTypeService");
const getContactSites = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const contactSiteQuery = "startswith(Id,'Site.contact.')";
    const contactSites = yield DAO.getUserPreferences(req, { filters: [contactSiteQuery] });
    return contactSites;
});
exports.getContactSites = getContactSites;
const getUserProfile = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const userProfile = yield user_administration_dao_osa2_1.getUserProfile(req);
    return userProfile;
});
exports.getUserProfile = getUserProfile;
const getIsUserContact = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const userProfile = req['userProfile'];
    if (!(userProfile === null || userProfile === void 0 ? void 0 : userProfile.loginId)) {
        return false;
    }
    const isSiteContactUser = yield userTypeService_1.userTypeService.isSiteContactUser(req, userProfile.userKeyId);
    return isSiteContactUser;
});
exports.getIsUserContact = getIsUserContact;
const generateUserAdministrationUrl = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const userProfile = req['userProfile'];
    if (!(userProfile === null || userProfile === void 0 ? void 0 : userProfile.loginId)) {
        return '';
    }
    const userAdministrationURL = yield user_administration_dao_osa2_1.generateUserAdministrationUrl(req, userProfile.userKeyId);
    if (!userAdministrationURL) {
        return '';
    }
    return userAdministrationURL;
});
exports.generateUserAdministrationUrl = generateUserAdministrationUrl;
//# sourceMappingURL=user-administration.service.js.map
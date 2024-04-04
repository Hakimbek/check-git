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
exports.userAdministrationServiceRouter = exports.setIsSiteContactMiddleware = exports.setUserProfileData = void 0;
const express_1 = require("express");
const constants_1 = require("./constants");
const user_administration_service_1 = require("./user-administration.service");
const constants_2 = require("../../../config/constants");
const router = express_1.Router();
/// @TODO move to 'user-administration.route.ts'
function setUserProfileData(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userProfile = yield user_administration_service_1.getUserProfile(req);
            req.userProfile = userProfile;
            next();
        }
        catch (error) {
            res.status((_a = error.status) !== null && _a !== void 0 ? _a : constants_2.RESPONSE_STATUSES.INTERNAL_SERVER_ERROR).send({ error: error.message });
        }
    });
}
exports.setUserProfileData = setUserProfileData;
function setIsSiteContactMiddleware(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const isSiteContact = yield user_administration_service_1.getIsUserContact(req);
            req.isSiteContact = isSiteContact;
            next();
        }
        catch (error) {
            res.status((_a = error.status) !== null && _a !== void 0 ? _a : constants_2.RESPONSE_STATUSES.INTERNAL_SERVER_ERROR).send({ error: error.message });
        }
    });
}
exports.setIsSiteContactMiddleware = setIsSiteContactMiddleware;
function sendUserAdministrationUrlMiddleware(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { isSiteContact } = req;
            if (!isSiteContact) {
                res.send({ userAdministrationURL: '' });
                return;
            }
            const userAdministrationURL = yield user_administration_service_1.generateUserAdministrationUrl(req);
            res.send({ userAdministrationURL: userAdministrationURL, isSiteContact });
        }
        catch (error) {
            res.status((_a = error.status) !== null && _a !== void 0 ? _a : constants_2.RESPONSE_STATUSES.INTERNAL_SERVER_ERROR).send({ error: error.message });
        }
    });
}
router.post(constants_1.USER_ADMINISTRATION_URL, setUserProfileData, setIsSiteContactMiddleware, sendUserAdministrationUrlMiddleware);
exports.userAdministrationServiceRouter = router;
//# sourceMappingURL=user-administration.routes.js.map
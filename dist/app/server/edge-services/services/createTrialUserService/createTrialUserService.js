"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTrialUserService = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const constants_1 = require("../../config/constants");
const externalDependencies_1 = require("../../externalDependencies");
const pardotService_1 = require("../pardot/pardotService");
const IC_ADMIN_URL = externalDependencies_1.vars.get('ICAdminUrl');
const PROTOCOL_STRING = /^https:/.test(IC_ADMIN_URL) ? '' : 'https:';
const FULL_IC_ADMIN_URL = `${PROTOCOL_STRING}${IC_ADMIN_URL}rest/xml/sfdc/createACTrialRequest`;
const AUTHENTICATOR = 'admin:admin';
const DEFAULT_PHONE_NUMBER = '555-555-5555';
class CreateTrialUserService {
    static createTrialUser(req, res) {
        const _a = req.body, { emailAddress, firstName, lastName, companyName, companyTypeId: segment, companySizeId: subSegment, zipCode, phoneNo = DEFAULT_PHONE_NUMBER, password, acReferSource } = _a, restInBody = __rest(_a, ["emailAddress", "firstName", "lastName", "companyName", "companyTypeId", "companySizeId", "zipCode", "phoneNo", "password", "acReferSource"]);
        let registrationFailed = 'false';
        const icAdminRequestBody = {
            emailAddress,
            firstName,
            lastName,
            companyName,
            segment,
            subSegment,
            zipCode,
            phoneNo,
            password,
            acReferSource,
            confirmPassword: password,
        };
        const requestInit = {
            method: 'POST',
            headers: {
                'Content-Type': constants_1.CONTENT_TYPES.APPLICATION_JSON,
                'Authorization': AUTHENTICATOR,
            },
            body: JSON.stringify(icAdminRequestBody),
        };
        node_fetch_1.default(FULL_IC_ADMIN_URL, requestInit)
            .then(response => response.json())
            .then(response => {
            if (response.errorMessage !== 'Success') {
                registrationFailed = response.errorMessage || 'Failed';
            }
            res.send(JSON.stringify(response));
        })
            .catch(error => {
            registrationFailed = error.message;
            res.status(constants_1.RESPONSE_STATUSES.INTERNAL_SERVER_ERROR).send({ error });
        })
            .finally(() => {
            pardotService_1.PardotService.sendTrialUserData(Object.assign(Object.assign({}, restInBody), icAdminRequestBody), registrationFailed, req);
        });
    }
}
exports.CreateTrialUserService = CreateTrialUserService;
//# sourceMappingURL=createTrialUserService.js.map
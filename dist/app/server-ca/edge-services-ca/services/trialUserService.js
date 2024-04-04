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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrialUserService = void 0;
const pardotService_1 = require("./pardotService");
const varsService_1 = require("./varsService");
const appConfig_1 = require("../config/appConfig");
const nodeFetch = require('node-fetch');
const url = require('url');
const { RESPONSE_STATUSES } = require('../config/appConfig');
const STOP_LISTED_DOMAINS = [
    'xfinity.com',
    'comcast.net',
    'att.net',
    'sbcglobal.com',
    'sbcglobal.ca',
    'aol.com',
    'aol.ca',
    'thomsonreuters.com',
    'tr.com',
    'yahoo.com',
    'yahoo.ca',
    'gmail.com',
    'hotmail.com',
    'hotmail.ca',
    'hotmail.co.uk',
    'outlook.com',
    'outlook.ca',
    'live.com',
    'live.ca',
    'intuit.com',
    'ymail.com',
    'verizon.net',
    '.edu',
    'hotmail.fr',
    'msn.com',
    'yahoo.fr',
    'wanadoo.fr',
    'live.com.au',
    'yahoo.com.sg',
    'telenet.be',
    'me.com',
    'yahoo.com.ar',
    'tiscali.co.uk',
    'yahoo.com.mx',
    'voila.fr',
    'tin.it',
    'live.it',
    'freenet.de',
    'yahoo.com.au',
    'rambler.ru',
    'hotmail.de',
    'yahoo.in',
    'hotmail.es',
    'live.co.uk',
    'googlemail.com',
    'yahoo.es',
    'ig.com.br',
    'live.nl',
    'terra.com.br',
    'yahoo.it',
    'neuf.fr',
    'yahoo.de',
    'rocketmail.com',
    'uol.com.br',
    'bol.com.br',
    'comcast.net',
    'yahoo.co.uk',
    'yahoo.com.br',
    'yahoo.co.i',
];
const STOP_LISTED_ENDS = ['.edu'];
const TRIAL_STATUS_PAGE_PATH = '/static/confirmation';
const STATUS_PAGE_PARAMS = {
    ERROR: { registrationStatus: 'error' },
    SUCCESS: { registrationStatus: 'success' },
};
const DEFAULT_LANGUAGE = 'en';
const GAA_HOST = varsService_1.VarsService.get('gaaHost');
const PROTOCOL_STRING = /^https:/.test(GAA_HOST) ? '' : 'https:';
const CREATE_AC_TRIAL_USER_URL = `${PROTOCOL_STRING}${GAA_HOST}/IdpService/AcTrial/CreateAcTrialUser`;
const ACTIVATE_AC_TRIAL_USER_URL = `${PROTOCOL_STRING}${GAA_HOST}/IdpService/AcTrial/ActivateAcTrialUser`;
const USER_EXIST_ERROR_MESSAGE = 'The user already exists.';
const EMAIL_NOT_ELIGIBLE_ERROR_MESSAGE = 'Email is in the stop listed domains.';
class TrialUserService {
    static createTrialUser(req, res) {
        const _a = req.body, { emailAddress, firstName, lastName, companyName, companyType, companySize, createPassword, postalCode, phoneNumber, confirmPassword, language = DEFAULT_LANGUAGE, acReferSource } = _a, restInBody = __rest(_a, ["emailAddress", "firstName", "lastName", "companyName", "companyType", "companySize", "createPassword", "postalCode", "phoneNumber", "confirmPassword", "language", "acReferSource"]);
        const icAdminRequestBody = {
            firstName,
            lastName,
            companyName,
            emailAddress,
            zipCode: postalCode,
            phoneNo: phoneNumber,
            password: createPassword,
            confirmPassword,
            segment: companyType,
            subSegment: companySize,
            language,
            acReferSource,
        };
        const requestInit = {
            method: 'POST',
            headers: {
                'Content-Type': appConfig_1.CONTENT_TYPES.APPLICATION_JSON,
            },
            body: JSON.stringify(icAdminRequestBody),
        };
        this.validateEmail(emailAddress);
        if (!this.isEmailEligible) {
            this.sendTrialUserData(Object.assign(Object.assign({}, icAdminRequestBody), restInBody), EMAIL_NOT_ELIGIBLE_ERROR_MESSAGE, req);
            return res.send(url.format({
                query: STATUS_PAGE_PARAMS.SUCCESS,
                pathname: TRIAL_STATUS_PAGE_PATH,
            }));
        }
        let registrationFailed = false;
        nodeFetch(CREATE_AC_TRIAL_USER_URL, requestInit)
            .then(response => {
            if (response.ok) {
                return response.json();
            }
            else {
                return response.json().then(errorData => {
                    throw new Error(errorData.errorMessage);
                });
            }
        })
            .then(() => {
            res.send(url.format({
                query: Object.assign(Object.assign({}, STATUS_PAGE_PARAMS.SUCCESS), { userEmail: emailAddress }),
                pathname: TRIAL_STATUS_PAGE_PATH,
            }));
        })
            .catch(error => {
            registrationFailed = error.message;
            if (error.message === USER_EXIST_ERROR_MESSAGE) {
                res.send(url.format({
                    query: STATUS_PAGE_PARAMS.SUCCESS,
                    pathname: TRIAL_STATUS_PAGE_PATH,
                }));
            }
            else {
                res.send(url.format({
                    query: STATUS_PAGE_PARAMS.ERROR,
                    pathname: TRIAL_STATUS_PAGE_PATH,
                }));
            }
        })
            .finally(() => {
            this.sendTrialUserData(Object.assign(Object.assign({}, icAdminRequestBody), restInBody), registrationFailed, req);
        });
    }
    static ActivateTrialUser(req, res) {
        const { body: { gaUserId }, } = req;
        const requestInit = {
            method: 'POST',
            headers: {
                'Content-Type': appConfig_1.CONTENT_TYPES.APPLICATION_JSON,
            },
            body: JSON.stringify({ gaUserId }),
        };
        nodeFetch(ACTIVATE_AC_TRIAL_USER_URL, requestInit)
            .then(response => response.json())
            .then(response => {
            res.send(JSON.stringify(response));
        })
            .catch(error => {
            res.status(RESPONSE_STATUSES.INTERNAL_SERVER_ERROR).send({ error });
        });
    }
    static validateEmail(emailAddress) {
        const emailDomain = emailAddress.split('@')[1].toLocaleLowerCase();
        const isEmailWithStoplistedDomain = STOP_LISTED_DOMAINS.some((domain) => emailDomain === domain.toLocaleLowerCase());
        const isEmailWithStoplistedEnd = STOP_LISTED_ENDS.some((endOfEmail) => emailAddress.endsWith(endOfEmail.toLocaleLowerCase()));
        this.isEmailEligible = !isEmailWithStoplistedDomain && !isEmailWithStoplistedEnd;
    }
    static sendTrialUserData(body, registrationFailed, req) {
        pardotService_1.PardotService.sendTrialUserData(body, registrationFailed, req);
    }
}
exports.TrialUserService = TrialUserService;
TrialUserService.isEmailEligible = true;
//# sourceMappingURL=trialUserService.js.map
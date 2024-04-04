"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PardotService = void 0;
/* eslint-disable camelcase */
const node_fetch_1 = __importDefault(require("node-fetch"));
const log_base_1 = require("@wk/log-base");
const constants_1 = require("../../config/constants");
const externalDependencies_1 = require("../../externalDependencies");
const UTM_PARAMETERS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
class PardotService {
    static sendTrialUserData(body, registrationFailed, requestData) {
        const pardotSettings = externalDependencies_1.vars.get('pardotSettings');
        const { emailAddress, firstName, lastName, companyName, zipCode, phoneNo, acReferSource, companySizeTitle: companySize, companyTypeTitle: companyType, } = body;
        if (!(pardotSettings === null || pardotSettings === void 0 ? void 0 : pardotSettings.enabled)) {
            return;
        }
        const pardotQueryParams = Object.assign(Object.assign({ emailAddress,
            firstName,
            lastName,
            companyName,
            companyType,
            companySize,
            zipCode,
            phoneNo,
            acReferSource }, this.getAggregatedUtmParams(body)), { registrationFailed });
        let paramsFormData = '';
        Object.keys(pardotQueryParams).forEach(key => {
            if (pardotQueryParams[key]) {
                paramsFormData += `${key}=${encodeURIComponent(pardotQueryParams[key])}&`;
            }
        });
        paramsFormData = paramsFormData.replace(/&$/, '');
        const pardotRequestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': constants_1.CONTENT_TYPES.APPLICATION_FORM_URLENCODED,
            },
            body: paramsFormData,
            redirect: 'manual',
        };
        externalDependencies_1.logService.logRequest(log_base_1.LogLevel.Info, requestData, {
            message: `Executing POST request to Pardot ${pardotSettings.url} with options ${JSON.stringify(pardotRequestOptions)}`,
        });
        node_fetch_1.default(pardotSettings.url, pardotRequestOptions)
            .then(response => response.text().then(responseText => {
            // pardot sends redirect with 302 status to AC in case of error and success
            // Difference: There is 'errors=true' in error redirect url.
            if (responseText.match('errors=true')) {
                throw new Error(`Network response was not ok. Status code: ${response.status}.
                                             Response value:  ${responseText}`);
            }
            externalDependencies_1.logService.logRequest(log_base_1.LogLevel.Info, requestData, {
                message: `Request to Pardot completed with status code ${response.status} and response value: ${responseText}`,
            });
        }))
            .catch(error => {
            externalDependencies_1.logService.logRequest(log_base_1.LogLevel.Error, requestData, {
                message: `Failed to execute request to Pardot. Error message: ${error.message}`,
            }, error);
        });
    }
    static getAggregatedUtmParams(body) {
        return UTM_PARAMETERS.reduce((acc, utmParameter) => {
            if (body[utmParameter]) {
                return Object.assign(Object.assign({}, acc), { [utmParameter]: body[utmParameter] });
            }
            return acc;
        }, {});
    }
}
exports.PardotService = PardotService;
//# sourceMappingURL=pardotService.js.map
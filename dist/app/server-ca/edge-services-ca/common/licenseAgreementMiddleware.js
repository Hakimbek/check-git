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
Object.defineProperty(exports, "__esModule", { value: true });
const SubscriptionService = __importStar(require("../edge-services/dataProviders/subcription/SubcriptionService"));
const loggerConstants_1 = require("../loggerConstants");
const url = require('url');
const logger = require('../services/loggerService');
const notificationPageFlow = require('../common/notificationMiddleware');
const { USER_TYPE_REGISTERED } = require('../config/appConfig').appConfig;
module.exports = (req, res, next) => {
    const { forwardedHost, forwardedProto, correlationId } = req;
    const isLicenseAgreementVisibleByUserType = req.userType === USER_TYPE_REGISTERED;
    logger.logRequest(loggerConstants_1.LOGGING_LEVELS.DEBUG, req, {
        isLicenseAgreementVisibleByUserType,
        correlationId,
        function: loggerConstants_1.FUNCTION_NAMES.LICENSE_AGREEMENT,
    });
    if (!isLicenseAgreementVisibleByUserType) {
        return next();
    }
    SubscriptionService.isShowLicenseAgreementByPreference(req)
        .then(preference => {
        if (preference) {
            const licenseAgreementPath = '/static/license-agreement';
            const licenseAgreementRedirectUriParams = {
                protocol: forwardedProto,
                hostname: forwardedHost,
                pathname: licenseAgreementPath,
                query: {
                    target_url: req.originalUrl,
                },
            };
            const licenseAgreementRedirectUri = url.format(licenseAgreementRedirectUriParams);
            logger.logRequest(loggerConstants_1.LOGGING_LEVELS.INFO, req, {
                licenseAgreementRedirectUri,
                correlationId,
                message: loggerConstants_1.LOGGING_MESSAGES.REDIRECT_TO_LICENSE_AGREEMENT_PAGE,
                function: loggerConstants_1.FUNCTION_NAMES.LICENSE_AGREEMENT,
            });
            res.redirect(licenseAgreementRedirectUri);
        }
        else {
            next();
        }
    })
        .catch(error => {
        logger.logRequest(loggerConstants_1.LOGGING_LEVELS.ERROR, req, {
            correlationId: error.correlationId || correlationId,
            message: loggerConstants_1.LOGGING_MESSAGES.LICENSE_AGREEMENT_SHOW_ERROR,
            function: loggerConstants_1.FUNCTION_NAMES.LICENSE_AGREEMENT,
        }, error);
        req.notification = 'loginerror';
        notificationPageFlow(req, res, next);
    });
};
//# sourceMappingURL=licenseAgreementMiddleware.js.map
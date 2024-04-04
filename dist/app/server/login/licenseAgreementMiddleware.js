const subscriptionService = require('../services/subscriptionService');
const url = require('url');
const { wkVars } = require('../services/utils/vars.util');
const logger = require('./../services/loggerService');
const {
    LOGGING_LEVELS: { ERROR, INFO, DEBUG },
    FUNCTION_NAMES: { LICENSE_AGREEMENT },
    LOGGING_MESSAGES: { REDIRECT_TO_LICENSE_AGREEMENT_PAGE, LICENSE_AGREEMENT_SHOW_ERROR },
} = require('../loggerConstants');

module.exports = function licenseAgreementMiddleware(req, res, next) {
    const { forwardedAmr, forwarderAuthority, forwardedHost, forwardedProto, correlationId } = req;
    const isLicenseAgreementVisibleByUserType =
        forwardedAmr && subscriptionService.checkShowLicenseAgreementByUserType(forwardedAmr, forwarderAuthority);

    logger.logRequest(DEBUG, req, {
        function: LICENSE_AGREEMENT,
        isLicenseAgreementVisibleByUserType,
        correlationId,
    });

    if (!isLicenseAgreementVisibleByUserType) {
        next();

        return;
    }

    subscriptionService
        .getPreference(wkVars.vars('usedPreferences').common.licenseKey, req)
        .then(preference => {
            if (subscriptionService.checkShowLicenseAgreementByPreference(preference)) {
                const licenseAgreementPath = '/static/license-agreement';

                let licenseAgreementRedirectUriParams = {
                    protocol: forwardedProto,
                    hostname: forwardedHost,
                    pathname: licenseAgreementPath,
                    query: {
                        target_url: req.originalUrl,
                    },
                };

                const licenseAgreementRedirectUri = url.format(licenseAgreementRedirectUriParams);

                logger.logRequest(INFO, req, {
                    message: REDIRECT_TO_LICENSE_AGREEMENT_PAGE,
                    function: LICENSE_AGREEMENT,
                    licenseAgreementRedirectUri,
                    correlationId,
                });

                res.redirect(licenseAgreementRedirectUri);
            } else {
                next();
            }
        })
        .catch(error => {
            logger.logRequest(
                ERROR,
                req,
                {
                    message: LICENSE_AGREEMENT_SHOW_ERROR,
                    function: LICENSE_AGREEMENT,
                    correlationId: correlationId,
                },
                error
            );

            next();
        });
};

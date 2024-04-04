const wkVars = require('../services/utils/vars.util').wkVars;
const detectUserTypeService = require('../services/detectUserTypeService');
const welcomePageEnabled = wkVars.vars('welcomePageEnabled');
const WELCOME_PAGE_WAS_SHOWN = 'welcomePageWasShown';
const STATUS_CODE_FOUND = 302;
const logger = require('../services/loggerService');
const {
    LOGGING_LEVELS: { INFO, DEBUG },
    FUNCTION_NAMES: { WELCOME_PAGE },
    LOGGING_MESSAGES: { REDIRECT_TO_WELCOME_PAGE },
} = require('../loggerConstants');
const url = require('url');

const noBackQueryFlag = wkVars.vars('noBackQueryFlag');

module.exports = function (req, res, next) {
    const {
        query: { linksource },
        cookies,
        correlationId,
    } = req;

    if (linksource) {
        const isWelcomePageShouldBeHidden = cookies[WELCOME_PAGE_WAS_SHOWN];

        logger.logRequest(DEBUG, req, {
            function: WELCOME_PAGE,
            linksource,
            isWelcomePageShouldBeHidden,
            correlationId,
        });

        if (
            !isWelcomePageShouldBeHidden &&
            welcomePageEnabled.indexOf(linksource) > -1 &&
            !detectUserTypeService.isRegistered(req)
        ) {
            const { forwardedProto, forwardedHost, baseUrl, path, query } = req;
            const targetPage = url.format({
                protocol: forwardedProto,
                hostname: forwardedHost,
                pathname: baseUrl + path,
                query: { ...query, [noBackQueryFlag]: true },
            });
            const redirectUrl = `/static/welcome?target_url=${encodeURIComponent(targetPage)}`;

            logger.logRequest(INFO, req, {
                message: REDIRECT_TO_WELCOME_PAGE,
                function: WELCOME_PAGE,
                redirectUrl,
                correlationId,
            });

            // Test URL:
            // /?linksource=axcess&document=d22822647cf71000b47990b11c18c90201
            res.cookie(WELCOME_PAGE_WAS_SHOWN, 'true');
            res.redirect(STATUS_CODE_FOUND, redirectUrl);

            return;
        }
    }
    next();
};

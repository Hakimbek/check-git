const url = require('url');
const { wkVars } = require('../services/utils/vars.util');
const logger = require('../services/loggerService');
const {
    LOGGING_LEVELS: { INFO, DEBUG },
    FUNCTION_NAMES: { AUTHENTICATION },
    LOGGING_MESSAGES: { AUTHENTICATION_START },
} = require('../loggerConstants');

const loginUrl = wkVars.vars('loginUrl');
const encodedLoginErrorUrl = encodeURIComponent(wkVars.vars('loginErrorUrl'));
const noBackQueryFlag = wkVars.vars('noBackQueryFlag');
const skipExternalIncomeEventQueryFlag = wkVars.vars('skipExternalIncomeEventQueryFlag');

module.exports = (req, res) => {
    const {
        baseUrl,
        path,
        query: { target_url: targetUrl, forcelogin, WAF, reset, referer, ...baseQuery },
        correlationId,
        forwardedHost,
        forwardedProto,
        forceLoginByMiddleware,
        forceLoginForIpUsers,
        skipExternalIncomeEventAfterLogin,
    } = req;
    const isApi20 = req.originalUrl.match('/api/2.0');

    logger.logRequest(INFO, req, {
        message: AUTHENTICATION_START,
        function: AUTHENTICATION,
        correlationId,
    });

    const { protocol, hostname, pathname, query } = url.parse(targetUrl || baseUrl + path, true);
    const targetPagePath = forceLoginForIpUsers ? '/' : pathname;
    const targetPageQuery = {
        ...baseQuery,
        ...query,
        [noBackQueryFlag]: true,
    };

    if (skipExternalIncomeEventAfterLogin) {
        targetPageQuery[skipExternalIncomeEventQueryFlag] = true;
    }

    if (referer) {
        targetPageQuery.referer = referer;
    }

    const targetPage = url.format({
        protocol: protocol || forwardedProto,
        hostname: hostname || forwardedHost,
        pathname: targetPagePath,
        query: targetPageQuery,
    });

    let authUrl = `${loginUrl}?redirect_uri=${encodeURIComponent(targetPage)}&error=${encodedLoginErrorUrl}`;

    if (WAF) {
        authUrl += `&WAF=${WAF}`;
    }

    if ((forcelogin && forcelogin === 'true') || forceLoginByMiddleware) {
        authUrl += '&prompt=login';
    }

    if (reset === 'true') {
        authUrl += '&reset=true';
    }

    if (forceLoginForIpUsers) {
        authUrl += '&forced=SUL';
    }

    if (referer && isApi20) {
        authUrl += `&referer=${referer}`;
    }

    logger.logRequest(DEBUG, req, {
        message: `Url to get auth code: ${authUrl}`,
        function: AUTHENTICATION,
        correlationId,
    });

    return res.send(`<meta http-equiv="refresh" content="0;url=${authUrl}"/>`);
};

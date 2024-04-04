const express = require('express');
const url = require('url');
const protectedRoute = require('../../../../login/protectedMiddleware');
const correlationIdMiddleware = require('../../../../common/correlationIdMiddleware');
const initIdentityApi = require('./identity');
const initAdminApi = require('./adminApi');
const analyticsService = require('../../../../services/analyticsService');
const { wkVars } = require('../../../../services/utils/vars.util');

const API_20_NAVIGATION_PATH = 'api/2.0/protected/navigation';
const SKIP_EXTERNAL_INCOME_EVENT_QUERY_FLAG = wkVars.vars('skipExternalIncomeEventQueryFlag');

const referrerMiddleware = (req, res, next) => {
    const referrer = req.get('Referrer') || '';
    const selfReferrerRegExp = new RegExp(`^${req.forwardedProto}://${req.forwardedHost}`);

    if (referrer && req.forwardedFreemium && !referrer.match(selfReferrerRegExp)) {
        return res.redirect(
            url.format({
                query: {
                    ...req.query,
                    referer: referrer,
                    [SKIP_EXTERNAL_INCOME_EVENT_QUERY_FLAG]: true,
                },
                pathname: url.parse(req.originalUrl).pathname,
            })
        );
    }

    return next();
};

const analyticsMiddleware = (req, res, next) => {
    const isApi20NavigationRoute = req.originalUrl.includes(API_20_NAVIGATION_PATH);

    if (isApi20NavigationRoute) {
        analyticsService.trackExternalIncomeEvent(req, res);

        req.skipExternalIncomeEventAfterLogin = true;
    }

    return next();
};

module.exports = function (router) {
    const accessGroupRouter = express.Router();
    initIdentityApi(accessGroupRouter);
    initAdminApi(accessGroupRouter);

    router.use(
        '/protected',
        correlationIdMiddleware,
        analyticsMiddleware,
        referrerMiddleware,
        protectedRoute,
        accessGroupRouter
    );
};

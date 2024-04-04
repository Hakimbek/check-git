const express = require('express');
const router = express.Router();

const staticPagesMiddleware = require('../../../../static/staticPagesMiddleware');
const { redirectMap } = require('../../../../../config/navigationApi');
const { NOTIFICATION_TYPES } = require('../../../../../config/notificationPage.config');
const analyticsService = require('../../../../../services/analyticsService');
const { PREVIOUSLY_LOGGED_IN_COOKIE_NAME } = require('../../../../../config/appConfig');
const authentification = require('../../../../../login/authentificationMiddleware');

const NOTIFICATION_PREFIX = '/notification';

router.get(
    NOTIFICATION_TYPES.map(item => `${NOTIFICATION_PREFIX}/${item}`),
    staticPagesMiddleware
);

router.get(Object.keys(redirectMap), (req, res) => {
    res.redirect(redirectMap[req.path]);
});

router.get('/*', (req, res, next) => {
    analyticsService.trackExternalIncomeEvent(req, res);

    if (req.forwardedFreemium && req.cookies[PREVIOUSLY_LOGGED_IN_COOKIE_NAME]) {
        req.skipExternalIncomeEventAfterLogin = true;

        return authentification(req, res, next);
    }

    return next();
});

module.exports = router;

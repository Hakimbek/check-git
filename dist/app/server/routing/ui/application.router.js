const { Router } = require('express');
const jwtDecode = require('jwt-decode');
const uuidv5 = require('uuid/v5');
const path = require('path');
const url = require('url');

const cookieService = require('../../services/cookieService');
const templateService = require('../../services/templateService');
const { getPublicDir, isHub } = require('../../services/utils/env.util');
const { wkVars } = require('../../services/utils/vars.util');
const detectUserTypeService = require('../../services/detectUserTypeService');
const analyticsService = require('../../services/analyticsService');

const sessionIdName = wkVars.vars('sessionIdName');
const skipExternalIncomeEventCookieName = wkVars.vars('skipExternalIncomeEventCookieName');
const { homePageUrl: newHomePageUrl, adminDashboardPageUrl: newAdminDashboardPageUrl } = wkVars.vars('reactAppLinks');

const URL_LOGIN_PAGE = '/api/2.0/public/identity/login';
const router = new Router();

router.use(function (req, res, next) {
    const { forwardedSession } = req;

    if (forwardedSession) {
        const { sid } = jwtDecode(forwardedSession);
        cookieService.addPersistentCookies(res, sessionIdName, uuidv5(sid, uuidv5.URL));
    }

    next();
});

router.get('/login', function (_req, res) {
    analyticsService.trackExternalIncomeEvent(_req, res);
    cookieService.addSessionCookie(res, skipExternalIncomeEventCookieName, true);

    res.redirect(url.format({ pathname: URL_LOGIN_PAGE }));
});

router.get('/admin', function (req, res) {
    res.redirect(url.format({ query: req.query, pathname: `${newAdminDashboardPageUrl}` }));
});

router.get(
    ['/federal', '/state', '/international', '/news', '/accounting', '/all', '/checklists'],
    function (req, res) {
        res.redirect(url.format({ query: req.query, pathname: `${newHomePageUrl}${req.path}` }));
    }
);

router.get(['/tax-news'], function (req, res) {
    res.redirect(url.format({ query: req.query, pathname: `${newHomePageUrl}/news` }));
});

router.get(['/', '/home', '/app', '/app/acr'], function (req, res) {
    res.redirect(url.format({ query: req.query, pathname: `${newHomePageUrl}` }));
});

// '/edj1922/*': we need react app path without the "/app/acr" prefix for Edward Jones pages
router.get(['/app/acr/*', '/edj1922', '/edj1922/*'], async function (req, res) {
    // In case user has come to AC through internal old news-tab link we need to redirect him to proper news-tab link
    if (req.path === '/app/acr/home/tax-news') {
        res.redirect(url.format({ pathname: `/app/acr/home/news` }));
    } else {
        const renderContext = { ...templateService.defaultRenderContext, ...res.locals };
        renderContext.isPrerenderBot = detectUserTypeService.isPrerenderBot(req);

        let indexPath = isHub() ? 'static/index-home.html' : '../app-react/dist/index-home.html';
        indexPath = path.resolve(getPublicDir(), indexPath);

        res.set({ 'Cache-Control': 'no-store' });
        res.send(await templateService.renderTemplate(indexPath, 'en', renderContext));
    }
});

router.use('/', async function (req, res) {
    let renderContext = { ...templateService.defaultRenderContext, ...res.locals };
    const indexPath = isHub() ? '/static/index.html' : '/index.html';

    renderContext.isPrerenderBot = detectUserTypeService.isPrerenderBot(req);

    res.set({ 'Cache-Control': 'no-store' });
    res.send(await templateService.renderTemplate(getPublicDir() + indexPath, 'en', renderContext));
});

module.exports = router;

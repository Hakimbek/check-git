const express = require('express');
const path = require('path');

const { isHub, getPublicDir, getRootDir } = require('../../services/utils/env.util');
const { wkVars } = require('../../services/utils/vars.util');

const compression = require('../../common/compressionMiddleware');
const mouseflowRecordingsMiddleware = require('./mouseflowRecordingsMiddleware');

const staticPagesRouter = require('./pages.router');

const resourceRouter = express.Router();

const clientVarsStr = `var bmbVars = wkVars = ${JSON.stringify(wkVars.clientVars())}`;

const STATUS_CODE_NOT_FOUND = 404;

module.exports = function (router) {
    addETagHeader(resourceRouter);
    initVarsRoute(resourceRouter);

    initExternalPackageStatic(resourceRouter);

    if (isHub()) {
        initHubStatic(resourceRouter);
    } else {
        initDevStatic(resourceRouter);
    }

    router.use('/static', compression, staticPagesRouter, mouseflowRecordingsMiddleware, resourceRouter);

    const faviconPath = path.resolve(getRootDir(), 'favicon.ico');
    router.use('/favicon.ico', compression, express.static(faviconPath));

    // CSN-18376: fix for mouseflow records
    const staticStylesPath = path.resolve(getPublicDir(), 'static/css');
    router.use('/css/scss', express.static(staticStylesPath));
};

function initDevStatic(router) {
    router.use('/', express.static(getPublicDir()));
    router.use('/js', express.static(getPublicDir()));
    router.use('/lang', express.static(path.resolve(process.cwd(), 'lang')));
    router.use('/node_modules', express.static(path.resolve(process.cwd(), 'node_modules')));
    router.use('/bmb_packages', express.static(path.resolve(process.cwd(), 'bmb_packages')));
    router.use('/bower_components', express.static(path.resolve(process.cwd(), 'bower_components')));

    // react-app
    router.use('/index-home.html', express.static(path.resolve(getPublicDir(), '../app-react/src/index-home.html')));
    router.use('/js', express.static(path.resolve(getPublicDir(), '../app-react/dist/js')));
    router.use('/css', express.static(path.resolve(getPublicDir(), '../app-react/dist/css')));
    router.use('/assets', express.static(path.resolve(getPublicDir(), '../app-react/dist/assets')));

    // File not found Error boundary for static router
    router.use('/', function (req, res) {
        res.sendStatus(STATUS_CODE_NOT_FOUND);
    });
}

function initHubStatic(router) {
    router.use('/', express.static(path.resolve(getPublicDir(), 'static')));
    router.use('/css/scss', express.static(path.resolve(getPublicDir(), 'static/css')));
    router.use('/img', express.static(path.resolve(getPublicDir(), 'static/assets/img')));
    router.use('/lang', express.static(path.resolve(getPublicDir(), 'static/lang')));

    // File not found Error boundary for static router
    router.use('/', function (req, res) {
        res.sendStatus(STATUS_CODE_NOT_FOUND);
    });
}

function initExternalPackageStatic(router) {
    router.use('/', express.static(path.resolve(getPublicDir(), 'static-pages')));
}

function initVarsRoute(router) {
    router.use('/vars', (req, res) => {
        res.setHeader('Content-Type', 'text/javascript');
        res.send(clientVarsStr);
    });
}

function addETagHeader(router) {
    router.use('/', (req, res, next) => {
        if (req.query._etag) {
            res.set({ ETag: req.query._etag });
        }

        next();
    });
}

const express = require('express');
const initResolveToolsServiceApi = require('./resolveTools');

module.exports = function (router) {
    const navigationRouter = express.Router();
    initResolveToolsServiceApi(navigationRouter);

    router.use('/scibum', navigationRouter);
};

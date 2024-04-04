const express = require('express');
const initNavigationServiceApi = require('./navigation');
const initIdentityServiceApi = require('./identity');
const initProxyServiceApi = require('./proxy');

module.exports = function (router) {
    const accessGroupRouter = express.Router();
    initNavigationServiceApi(accessGroupRouter);
    initIdentityServiceApi(accessGroupRouter);
    initProxyServiceApi(accessGroupRouter);

    router.use('/public', accessGroupRouter);
};

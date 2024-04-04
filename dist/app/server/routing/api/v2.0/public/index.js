const express = require('express');

const initIdentityApi = require('./identity');
const initNavigationApi = require('./navigation');
const initHealthCheckApi = require('./healthCheck');

module.exports = function (router) {
    const accessGroupRouter = express.Router();
    initIdentityApi(accessGroupRouter);
    initNavigationApi(accessGroupRouter);
    initHealthCheckApi(accessGroupRouter);

    router.use('/public', accessGroupRouter);
};

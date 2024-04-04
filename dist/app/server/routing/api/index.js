const express = require('express');
const initSecondVersionApi = require('./v2.0');
const initNewSecondVersionApi = require('./v2');

module.exports = function (router) {
    const apiRouter = express.Router();
    initSecondVersionApi(apiRouter);
    initNewSecondVersionApi(apiRouter);

    router.use('/api', apiRouter);
};

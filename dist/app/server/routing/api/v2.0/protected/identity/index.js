const express = require('express');
const initIdentityTestApi = require('./identityTestRoute');

module.exports = function (router) {
    const domainRouter = express.Router();
    initIdentityTestApi(domainRouter);

    router.use('/identity', domainRouter);
};

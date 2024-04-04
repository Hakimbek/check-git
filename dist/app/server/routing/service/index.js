const express = require('express');

const initProtectedServiceApi = require('./protected');
const initPublicServiceApi = require('./public');

module.exports = function (router) {
    const serviceRouter = express.Router();
    initProtectedServiceApi(serviceRouter);
    initPublicServiceApi(serviceRouter);

    router.use('/service', serviceRouter);
};

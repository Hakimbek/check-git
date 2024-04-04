const express = require('express');
const protectedRoute = require('../../../login/protectedMiddleware');
const initIdentityServiceApi = require('./identity');
const correlationIdMiddleware = require('../../../common/correlationIdMiddleware');

module.exports = function (router) {
    const accessGroupRouter = express.Router();
    initIdentityServiceApi(accessGroupRouter);

    router.use('/protected', correlationIdMiddleware, protectedRoute, accessGroupRouter);
};

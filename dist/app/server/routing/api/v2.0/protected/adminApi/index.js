const express = require('express');
const redisCacheRoutes = require('./redisRoutes');
const checkAdminSubMiddleware = require('./checkAdminSubMiddleware');

module.exports = function (router) {
    const domainRouter = express.Router();
    redisCacheRoutes(domainRouter);

    router.use('/admin', checkAdminSubMiddleware, domainRouter);
};

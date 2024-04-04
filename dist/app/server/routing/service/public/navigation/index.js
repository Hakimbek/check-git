const express = require('express');
const initTestNavigationServiceApi = require('./serviceNavigationTestRoute');

module.exports = function (router) {
    const navigationRoute = express.Router();
    initTestNavigationServiceApi(navigationRoute);

    router.use('/navigation', navigationRoute);
};

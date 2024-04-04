const express = require('express');
const initScibumServiceApi = require('./scibum');

module.exports = function (router) {
    const identityRoute = express.Router();
    initScibumServiceApi(identityRoute);

    router.use('/identity', identityRoute);
};

const express = require('express');
const initScibumServiceApi = require('./scibum');

module.exports = function (router) {
    const accessGroupRouter = express.Router();
    initScibumServiceApi(accessGroupRouter);

    router.use('/identity', accessGroupRouter);
};

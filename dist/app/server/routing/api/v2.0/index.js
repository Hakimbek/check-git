const express = require('express');

const initPublicApi = require('./public');
const initProtectedApi = require('./protected');

module.exports = function (router) {
    const apiVersionRouter = express.Router();
    initPublicApi(apiVersionRouter);
    initProtectedApi(apiVersionRouter);

    router.use('/2.0', apiVersionRouter);
};

const express = require('express');
const initAxcessApi = require('./axcess');

module.exports = function (router) {
    const commonAppApiRouter = express.Router({ caseSensitive: true });
    const appsSpecificApiRouter = express.Router({ caseSensitive: true });

    commonAppApiRouter.use('/app', appsSpecificApiRouter);

    initAxcessApi(appsSpecificApiRouter);

    router.use('/', commonAppApiRouter);
};

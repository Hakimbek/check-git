const express = require('express');

const initPublicApi = require('./public');
const initProtectedApi = require('./protected');

module.exports = function (router) {
    const axcessApiRouter = express.Router({ caseSensitive: true });

    initPublicApi(axcessApiRouter);
    initProtectedApi(axcessApiRouter);

    router.use('/axcess', axcessApiRouter);
};

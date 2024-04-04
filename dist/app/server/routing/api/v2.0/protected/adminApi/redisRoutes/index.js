const getItemRoute = require('./getItemRoute');
const deleteItemRoute = require('./deleteItemRoute');
const getKeysRoute = require('./getKeysRoute');
const express = require('express');

module.exports = function (router) {
    const domainRouter = express.Router();

    getItemRoute(domainRouter);
    deleteItemRoute(domainRouter);
    getKeysRoute(domainRouter);

    router.use('/redis', domainRouter);
};

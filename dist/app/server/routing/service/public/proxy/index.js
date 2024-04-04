const express = require('express');
const initGetLatestVersionOfLicenseAgreementTextApi = require('./getLatestVersionOfLicenseAgreementText');

module.exports = function (router) {
    const navigationRouter = express.Router();
    initGetLatestVersionOfLicenseAgreementTextApi(navigationRouter);

    router.use('/proxy', navigationRouter);
};

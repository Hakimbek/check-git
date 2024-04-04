const latestLicenseAgreementText = require('../../middleware/latestVersionOfLicenseAgreementText');

module.exports = router => {
    router.get('/getLatestVersionOfLicenseAgreementText', latestLicenseAgreementText);
};

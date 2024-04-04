const filesService = require('../../../services/filesService');
const { wkVars } = require('../../../services/utils/vars.util');
const cdnHost = wkVars.vars('cdnHost');
const licenseAgreementRelativeUrl = wkVars.vars('licenseAgreementRelativeUrl');
const staticVersionOfLicenseAgreementTextUrl = wkVars.vars('staticVersionOfLicenseAgreementTextUrl');

module.exports = (req, res) => {
    const licenseAgreementAbsoluteUrl = `https:${cdnHost}${licenseAgreementRelativeUrl}`;

    filesService
        .loadFile(licenseAgreementAbsoluteUrl, req)
        .then(licenseAgreementText => {
            res.send(licenseAgreementText);
        })
        .catch(() => {
            res.redirect(staticVersionOfLicenseAgreementTextUrl);
        });
};

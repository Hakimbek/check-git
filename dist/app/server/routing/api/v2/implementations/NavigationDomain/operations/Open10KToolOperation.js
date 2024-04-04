const ProtectedApiOperation = require('./../../../definitions/operations/ProtectedOperation');
const Endpoint = require('./../../../definitions/common/Endpoint');

const redirectUrlModifier = require('./../RedirectUrl');
const lookupToolKeyLinkMapping = {
    '10-K': '10k-lookup/search',
    'ESG': 'esg/search',
    'CDL': 'cdl/search',
};

class Open10KToolOperation extends ProtectedApiOperation {
    constructor() {
        super();
        this.endpoints.push(new Endpoint('get', '/openLookupTool', ['lookupToolType']));
    }

    async performTask(req, res) {
        await super.performTask(req, res);
        const redirectUrl = redirectUrlModifier.getRedirectUrlFromResponse(res);

        const { lookupToolType, alertId } = req.query;

        if (!lookupToolType || !lookupToolKeyLinkMapping[lookupToolType]) {
            redirectUrl.pathname = `/app/acr/home`;
            redirectUrl.query = {};
        } else {
            delete redirectUrl.query.WAF;

            redirectUrl.pathname = `/app/acr/${lookupToolKeyLinkMapping[lookupToolType]}`;
            if (alertId) {
                redirectUrl.query.restoreAlert = alertId;
            }
        }

        redirectUrlModifier.setRedirectUrlToResponse(res, redirectUrl);
    }
}

module.exports = Open10KToolOperation;

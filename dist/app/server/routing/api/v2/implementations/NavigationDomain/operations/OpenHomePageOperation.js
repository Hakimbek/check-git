const ProtectedApiOperation = require('../../../definitions/operations/ProtectedOperation');
const Endpoint = require('../../../definitions/common/Endpoint');

const redirectUrlModifier = require('../RedirectUrl');

class OpenHomePageOperation extends ProtectedApiOperation {
    constructor() {
        super();
        this.endpoints.push(new Endpoint('get', '/openHomePage'));
    }

    async performTask(req, res) {
        await super.performTask(req, res);
        const redirectUrl = redirectUrlModifier.getRedirectUrlFromResponse(res);
        const linksource = req.query.linksource;

        redirectUrl.pathname = req.query.tab ? `/${req.query.tab}` : '/';

        redirectUrl.query = {};
        if (linksource) {
            // Include info about ARM 2.0 redirect (ARMAC-2110)
            if (linksource === 'ARM2') {
                if (!req.query.tab || req.query.tab === 'accounting') {
                    redirectUrl.query.internalLinkSource = req.query.linksource;
                }
            } else {
                redirectUrl.query.linksource = linksource;
            }
        }

        redirectUrlModifier.setRedirectUrlToResponse(res, redirectUrl);
    }
}

module.exports = OpenHomePageOperation;

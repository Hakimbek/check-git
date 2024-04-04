const ProtectedApiOperation = require('../../../definitions/operations/ProtectedOperation');
const Endpoint = require('../../../definitions/common/Endpoint');
const redirectUrlModifier = require('../RedirectUrl');

class OpenTaxTopicsOperation extends ProtectedApiOperation {
    constructor() {
        super();
        this.endpoints.push(new Endpoint('get', '/openTaxTopics'));
    }

    async performTask(req, res) {
        await super.performTask(req, res);
        const redirectUrl = redirectUrlModifier.getRedirectUrlFromResponse(res);

        if (req.query.jurisdiction) {
            if (req.query.jurisdiction === 'international') {
                redirectUrl.pathname = '/topics/browse/international/jurisdiction';
            } else {
                redirectUrl.pathname = `/topics/browse/${req.query.jurisdiction}/list`;
            }
        } else {
            redirectUrl.pathname = '/topics/browse/all';
        }

        redirectUrl.query = {};

        redirectUrlModifier.setRedirectUrlToResponse(res, redirectUrl);
    }
}

module.exports = OpenTaxTopicsOperation;

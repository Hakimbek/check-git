const ProtectedApiOperation = require('../../../definitions/operations/ProtectedOperation');
const Endpoint = require('../../../definitions/common/Endpoint');
const redirectUrlModifier = require('../RedirectUrl');

class OpenInternationalTreatiesOperation extends ProtectedApiOperation {
    constructor() {
        super();
        this.endpoints.push(new Endpoint('get', '/openInternationalTreaties'));
    }

    async performTask(req, res) {
        await super.performTask(req, res);
        const redirectUrl = redirectUrlModifier.getRedirectUrlFromResponse(res);

        redirectUrl.pathname = '/treaty/browse';
        redirectUrl.query = {};

        redirectUrlModifier.setRedirectUrlToResponse(res, redirectUrl);
    }
}

module.exports = OpenInternationalTreatiesOperation;

const ProtectedApiOperation = require('../../../definitions/operations/ProtectedOperation');
const Endpoint = require('../../../definitions/common/Endpoint');
const redirectUrlModifier = require('../RedirectUrl');

class OpenMultistateBrowseOperation extends ProtectedApiOperation {
    constructor() {
        super();
        this.endpoints.push(new Endpoint('get', '/openMultistateBrowse'));
    }

    async performTask(req, res) {
        await super.performTask(req, res);
        const redirectUrl = redirectUrlModifier.getRedirectUrlFromResponse(res);

        redirectUrl.pathname = '/multistatebrowse';
        redirectUrl.query = {};

        redirectUrlModifier.setRedirectUrlToResponse(res, redirectUrl);
    }
}

module.exports = OpenMultistateBrowseOperation;

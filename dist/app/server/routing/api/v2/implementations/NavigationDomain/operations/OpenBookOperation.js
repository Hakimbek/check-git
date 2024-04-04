const ProtectedApiOperation = require('./../../../definitions/operations/ProtectedOperation');
const Endpoint = require('./../../../definitions/common/Endpoint');

const redirectUrlModifier = require('./../RedirectUrl');

class OpenBookOperation extends ProtectedApiOperation {
    constructor() {
        super();
        this.endpoints.push(new Endpoint('get', '/openBook/:bookNodeId', ['bookNodeId']));
    }

    async performTask(req, res) {
        await super.performTask(req, res);
        let redirectUrl = redirectUrlModifier.getRedirectUrlFromResponse(res);
        redirectUrl.pathname = `/resolve/node/${req.params.bookNodeId}`;
        redirectUrlModifier.setRedirectUrlToResponse(res, redirectUrl);
    }
}

module.exports = OpenBookOperation;

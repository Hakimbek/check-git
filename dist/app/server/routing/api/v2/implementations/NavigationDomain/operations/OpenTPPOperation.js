const ProtectedApiOperation = require('./../../../definitions/operations/ProtectedOperation');
const Endpoint = require('./../../../definitions/common/Endpoint');

const redirectUrlModifier = require('./../RedirectUrl');

class OpenTPPOperation extends ProtectedApiOperation {
    constructor() {
        super();
        this.endpoints.push(new Endpoint('get', '/openTPP/:tppNodeId', ['tppNodeId']));
    }

    async performTask(req, res) {
        await super.performTask(req, res);
        let redirectUrl = redirectUrlModifier.getRedirectUrlFromResponse(res);
        redirectUrl.pathname = `/resolve/node/${req.params.tppNodeId}`;
        redirectUrlModifier.setRedirectUrlToResponse(res, redirectUrl);
    }
}

module.exports = OpenTPPOperation;

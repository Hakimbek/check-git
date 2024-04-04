const ProtectedApiOperation = require('./../../../definitions/operations/ProtectedOperation');
const Endpoint = require('./../../../definitions/common/Endpoint');
const redirectUrlModifier = require('./../RedirectUrl');

class OpenGuideOperation extends ProtectedApiOperation {
    constructor() {
        super();
        this.endpoints.push(new Endpoint('get', '/openGuide/:guideNodeId', ['guideNodeId']));
    }

    async performTask(req, res) {
        const redirectUrl = redirectUrlModifier.getRedirectUrlFromResponse(res);
        redirectUrl.pathname = `/resolver`;
        redirectUrl.query.isApi20 = true;
        redirectUrl.query.nodeId = req.params.guideNodeId;
        redirectUrlModifier.setRedirectUrlToResponse(res, redirectUrl);
    }
}

module.exports = OpenGuideOperation;

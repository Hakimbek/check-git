const ProtectedApiOperation = require('./../../../definitions/operations/ProtectedOperation');
const Endpoint = require('./../../../definitions/common/Endpoint');
const redirectUrlModifier = require('./../RedirectUrl');

class ResolveCombinedDocsOperation extends ProtectedApiOperation {
    constructor() {
        super();
        this.endpoints.push(new Endpoint('get', '/resolveCombinedDocs', ['configKey']));
    }

    async performTask(req, res) {
        await super.performTask(req, res);

        if (req.query.configKey) {
            let redirectUrl = redirectUrlModifier.getRedirectUrlFromResponse(res);
            redirectUrl.pathname = '/app/acr/special-links-resolver';
            redirectUrl.query = {
                key: req.query.configKey,
            };

            redirectUrlModifier.setRedirectUrlToResponse(res, redirectUrl);
        }
    }
}

module.exports = ResolveCombinedDocsOperation;

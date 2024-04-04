const ProtectedApiOperation = require('./../../../definitions/operations/ProtectedOperation');
const Endpoint = require('./../../../definitions/common/Endpoint');

const redirectUrlModifier = require('./../RedirectUrl');

class OpenFederalTaxOperation extends ProtectedApiOperation {
    constructor() {
        super();
        this.endpoints.push(new Endpoint('get', '/openFederalTax'));
    }

    async performTask(req, res) {
        await super.performTask(req, res);
        let redirectUrl = redirectUrlModifier.getRedirectUrlFromResponse(res);
        redirectUrl.pathname = `/codesections/subtitles`;
        // ACUS-2803 remove query parameters
        redirectUrl.query = {};

        redirectUrlModifier.setRedirectUrlToResponse(res, redirectUrl);
    }
}

module.exports = OpenFederalTaxOperation;

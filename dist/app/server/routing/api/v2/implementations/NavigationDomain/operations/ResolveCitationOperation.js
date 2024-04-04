const ProtectedApiOperation = require('./../../../definitions/operations/ProtectedOperation');
const Endpoint = require('./../../../definitions/common/Endpoint');
const redirectUrlModifier = require('./../RedirectUrl');
const { wkVars } = require('../../../../../../services/utils/vars.util');
const cookieService = require('../../../../../../services/cookieService');

const skipExternalIncomeEventCookieName = wkVars.vars('skipExternalIncomeEventCookieName');

class ResolveCitationOperation extends ProtectedApiOperation {
    constructor() {
        super();
        this.endpoints.push(new Endpoint('get', '/resolveCitation', ['citation']));
    }

    async performTask(req, res) {
        await super.performTask(req, res);
        let redirectUrl = redirectUrlModifier.getRedirectUrlFromResponse(res);
        let citation = req.query.citation.replace(/\s+/g, '+');

        cookieService.addSessionCookie(res, skipExternalIncomeEventCookieName, true);

        if (req.query.citation.startsWith('ARMAC ')) {
            citation = req.query.citation;
            redirectUrl.pathname = `/app/acr/navigation`;
            redirectUrl.query = {
                citation: citation,
            };
        } else {
            redirectUrl.pathname = `/extlink/citation/${citation}`;
        }
        redirectUrlModifier.setRedirectUrlToResponse(res, redirectUrl);
    }
}

module.exports = ResolveCitationOperation;

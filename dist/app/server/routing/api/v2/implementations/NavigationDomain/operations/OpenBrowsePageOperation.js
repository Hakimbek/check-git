const ProtectedApiOperation = require('../../../definitions/operations/ProtectedOperation');
const Endpoint = require('../../../definitions/common/Endpoint');
const redirectUrlModifier = require('../RedirectUrl');

const possibleContexts = ['tools', 'journals', 'treatises', 'guides', 'puertoRicoPrimarySource', 'tpp', 'pwcWorldwide'];
const MULTISTATE_BROWSE_CONTEXT = 'multistateBrowse';
const COMBINABLE_CONTEXT = 'combinable';
const BUSINESS_INCENTIVES_NODE_ID = 'csh-da-filter!WKUS-TAL-DOCS-PHC-{b55ac003-38b3-3f49-a482-9209f3f6493f}';

class OpenBrowsePageOperation extends ProtectedApiOperation {
    constructor() {
        super();
        this.endpoints.push(new Endpoint('get', '/openBrowsePage', ['ctx', 'nodeId']));
    }

    async performTask(req, res) {
        await super.performTask(req, res);
        const redirectUrl = redirectUrlModifier.getRedirectUrlFromResponse(res);
        const isContextAvailable = possibleContexts.some(
            context => context.toLowerCase() === req.query.ctx.toLowerCase()
        );
        redirectUrl.query = {};

        if (req.query.ctx === MULTISTATE_BROWSE_CONTEXT && req.query.nodeId === BUSINESS_INCENTIVES_NODE_ID) {
            redirectUrl.pathname = `/multistatebrowse/${req.query.nodeId}`;
        } else if (req.query.ctx === COMBINABLE_CONTEXT) {
            redirectUrl.pathname = '/app/acr/navigation';
            redirectUrl.query.nodeId = req.query.nodeId;
        } else {
            redirectUrl.pathname = isContextAvailable ? `/resolve/node/${req.query.nodeId}` : '/';
        }


        redirectUrlModifier.setRedirectUrlToResponse(res, redirectUrl);
    }
}

module.exports = OpenBrowsePageOperation;

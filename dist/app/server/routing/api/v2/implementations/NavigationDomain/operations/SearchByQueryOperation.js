const resource = require('@wk/osa-resource');
const ProtectedApiOperation = require('./../../../definitions/operations/ProtectedOperation');
const Endpoint = require('./../../../definitions/common/Endpoint');
const { wkVars } = require('../../../ApiModuleDependencies');
const redirectUrlModifier = require('./../RedirectUrl');
const {
    osa: osaService,
    appConfig: { RESOURCE_DOMAIN_NAME },
} = require('../../../ApiModuleDependencies');

const ERROR_MESSAGE_NO_PERMISSIONS = "User doesn't have access to CSH";
const MODULE_POSTFIX_REGEXP = /--WKUS_TAL_.*$/;

const searchResolverUrl = wkVars.vars('reactAppLinks').searchResolverUrl;

class SearchByQueryOperation extends ProtectedApiOperation {
    constructor() {
        super();
        this.endpoints.push(new Endpoint('get', '/searchByQuery', ['query']));
    }

    async performTask(req, res) {
        await super.performTask(req, res);
        const redirectUrl = redirectUrlModifier.getRedirectUrlFromResponse(res);
        const appcue = req.query.appcue;
        const query = req.query.query;
        const scopeByCSH = req.query.scopeByCSH;

        redirectUrl.pathname = searchResolverUrl;
        redirectUrl.query = {
            query,
            tab: 'all',
            appcue,
            scopeByCSH,
            disableCache: true,
        };
        redirectUrlModifier.setRedirectUrlToResponse(res, redirectUrl);
    }

    async checkPermissions(req) {
        const scopeByCSH = req.query.scopeByCSH;

        if (scopeByCSH) {
            const treeNodeIds = Array.isArray(scopeByCSH)
                ? scopeByCSH.map(this.trimModulePostfix).map(id => new resource.ContentTreeNodeId({ id }))
                : [new resource.ContentTreeNodeId({ id: this.trimModulePostfix(scopeByCSH) })];
            const resourceService = osaService.createDomainServiceInstance(RESOURCE_DOMAIN_NAME, req);
            const rawPermissions = await resourceService.getContentAuthorization(
                new resource.GetContentAuthorization({
                    treeNodeIds,
                    ModuleTypeValue: 1,
                })
            );

            if (!rawPermissions.authorizedTreeNodeIds.length) {
                throw new Error(ERROR_MESSAGE_NO_PERMISSIONS);
            }
        }

        return true;
    }

    trimModulePostfix(treeNodeId) {
        return treeNodeId.replace(MODULE_POSTFIX_REGEXP, '');
    }
}

module.exports = SearchByQueryOperation;

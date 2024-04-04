const url = require('url');
const externalDependencies = require('./../../ApiModuleDependencies');

const AbstractApiDomain = require('./../../definitions/domains/AbstractDomain');
const ResolveSmartchartsApiOperation = require('./../../implementations/NavigationDomain/operations/ResolveSmartchartsOperation');
const Open10KToolApiOperation = require('./../../implementations/NavigationDomain/operations/Open10KToolOperation');
const OpenDocumentByIdApiOperation = require('./../../implementations/NavigationDomain/operations/OpenDocumentByIdOperation');
const OpenDocumentByIdPublicApiOperation = require('./../../implementations/NavigationDomain/operations/OpenDocumentByIdPublicOperation');
const OpenBookOperation = require('./../../implementations/NavigationDomain/operations/OpenBookOperation');
const OpenGuideOperation = require('./../../implementations/NavigationDomain/operations/OpenGuideOperation');
const ResolveCitationOperation = require('./../../implementations/NavigationDomain/operations/ResolveCitationOperation');
const OpenHomePageOperation = require('./../../implementations/NavigationDomain/operations/OpenHomePageOperation');
const SearchByQueryOperation = require('./../../implementations/NavigationDomain/operations/SearchByQueryOperation');
const OpenFederalTaxOperation = require('./../../implementations/NavigationDomain/operations/OpenFederalTaxOperation');
const OpenTPPOperation = require('./../../implementations/NavigationDomain/operations/OpenTPPOperation');
const OpenTaxTopicsOperation = require('./../../implementations/NavigationDomain/operations/OpenTaxTopicsOperation');
// eslint-disable-next-line max-len
const OpenInternationalTreatiesOperation = require('./../../implementations/NavigationDomain/operations/OpenInternationalTreatiesOperation');
const OpenBrowsePageOperation = require('./../../implementations/NavigationDomain/operations/OpenBrowsePageOperation');
const OpenStateNavOperation = require('./../../implementations/NavigationDomain/operations/OpenStateNavOperation');
const OpenMultistateBrowseOperation = require('./../../implementations/NavigationDomain/operations/OpenMultistateBrowseOperation');
const ResolveCombinedDocsApiOperation = require('./../../implementations/NavigationDomain/operations/ResolveCombinedDocsOperation');

const redirectUrlModifier = require('./RedirectUrl');

const WAF_PARAM_NAME = externalDependencies.wkVars.vars('WAFParamName');
const { ERROR_NOTIFICATION_URL } = require('./../../../../../config/notificationPage.config');

class NavigationApiDomain extends AbstractApiDomain {
    constructor() {
        super('/navigation');

        // register operations
        this.registerOperation('resolveSmartcharts', ResolveSmartchartsApiOperation);
        this.registerOperation('openLookupTool', Open10KToolApiOperation);
        this.registerOperation('openBook', OpenBookOperation);
        this.registerOperation('openGuide', OpenGuideOperation);
        this.registerOperation('openDocumentById', OpenDocumentByIdApiOperation);
        this.registerOperation('openDocumentByIdPublicOperation', OpenDocumentByIdPublicApiOperation);
        this.registerOperation('resolveCitation', ResolveCitationOperation);
        this.registerOperation('openHomePage', OpenHomePageOperation);
        this.registerOperation('searchByQuery', SearchByQueryOperation);
        this.registerOperation('openTPP', OpenTPPOperation);
        this.registerOperation('openFederalTax', OpenFederalTaxOperation);
        this.registerOperation('openTaxTopics', OpenTaxTopicsOperation);
        this.registerOperation('openInternationalTreaties', OpenInternationalTreatiesOperation);
        this.registerOperation('openBrowsePage', OpenBrowsePageOperation);
        this.registerOperation('openStateNav', OpenStateNavOperation);
        this.registerOperation('openMultistateBrowse', OpenMultistateBrowseOperation);
        this.registerOperation('resolveCombinedDocs', ResolveCombinedDocsApiOperation);
    }

    async preOperationTasks(req, res, operationInstance) {
        await super.preOperationTasks(req, res, operationInstance);
        redirectUrlModifier.setRedirectUrlToResponse(res, {
            query: {},
        });
        this.addWafParam(req, res);
    }

    async postOperationTasks(req, res, operationInstance) {
        await super.postOperationTasks(req, res, operationInstance);
        this.redirectToUI(req, res);
    }

    addWafParam(req, res) {
        const wafParam = req.query[WAF_PARAM_NAME];

        if (wafParam) {
            let redirectUrl = redirectUrlModifier.getRedirectUrlFromResponse(res);
            redirectUrl.query[WAF_PARAM_NAME] = wafParam;
            redirectUrlModifier.setRedirectUrlToResponse(res, redirectUrl);
        }
    }

    redirectToUI(req, res) {
        res.redirect(url.format(redirectUrlModifier.getRedirectUrlFromResponse(res)));
    }

    async handleError(req, res, error) {
        await super.handleError(req, res, error);

        const redirectUrl =
            error.redirectUrl ||
            url.format({
                pathname: ERROR_NOTIFICATION_URL,
                query: {
                    message: error.message,
                },
            });

        res.redirect(redirectUrl);
    }
}

module.exports = NavigationApiDomain;

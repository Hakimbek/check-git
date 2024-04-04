const identity = require('@wk/osa-identity');
const personalitem = require('@wk/osa-personalitem');
const resource = require('@wk/osa-resource');
const shortify = require('@wk/osa-shortify');
const { wkVars } = require('./utils/vars.util');
const urm = require('@wk/osa-urm');
const research = require('@wk/osa-research');
const logService = require('./loggerService');
const useractivityhistory = require('@wk/osa-useractivityhistory');

const {
    IDENTITY_DOMAIN_NAME,
    PERSONALITEM_DOMAIN_NAME,
    RESOURCE_DOMAIN_NAME,
    SHORTIFY_DOMAIN_NAME,
    RESEARCH_DOMAIN_NAME,
    URM_DOMAIN_NAME,
    DOMAIN_NAME_PATERN,
    FORWARDED_AUTHORIZATION_HEADER_NAME,
    UI_HOST_HEADER_NAME,
    USERACTIVITYHISTORY_DOMAIN_NAME,
} = require('../config/appConfig');

// It is needed only for debugging osa calls in fiddler
// require('./osaServiceDebug');
class OSAService {
    constructor() {
        const { url, ...osaConfig } = wkVars.vars('osa');
        const {
            default: { headers },
        } = wkVars.vars('osaProductConfig');
        this.osaUrl = url;
        this.osaConfig = osaConfig;
        this.osaHeaders = headers;

        this.domainList = {
            [IDENTITY_DOMAIN_NAME]: identity.IdentityOsaService,
            [PERSONALITEM_DOMAIN_NAME]: personalitem.PersonalitemOsaService,
            [RESOURCE_DOMAIN_NAME]: resource.ResourceOsaService,
            [SHORTIFY_DOMAIN_NAME]: shortify.ShortifyOsaService,
            [URM_DOMAIN_NAME]: urm.UrmOsaService,
            [URM_DOMAIN_NAME]: urm.UrmOsaService,
            [RESEARCH_DOMAIN_NAME]: research.ResearchOsaService,
            [USERACTIVITYHISTORY_DOMAIN_NAME]: useractivityhistory.UseractivityhistoryOsaService,
        };
    }

    createDomainServiceInstance(domain = IDENTITY_DOMAIN_NAME, requestData = {}) {
        const ServiceConstructor = this.domainList[domain];

        const osaDomainService = new ServiceConstructor({
            ...this.osaConfig,
            headers: {
                ...this.osaHeaders,
                ...this.getRequestHeaders(requestData),
            },
            url: this.getRequestUrl(domain, requestData),
        });

        osaDomainService.context.on('beforeRequest', req => {
            req.headers.CorrelationId = logService.getChainedCorrelationId(req.headers.CorrelationId);
        });

        return osaDomainService;
    }

    getRequestHeaders({ forwardedAuthorization, forwardedHost, correlationId }) {
        const commonHeaders = {
            CorrelationId: correlationId,
        };

        return forwardedAuthorization
            ? {
                  [FORWARDED_AUTHORIZATION_HEADER_NAME]: forwardedAuthorization,
                  [UI_HOST_HEADER_NAME]: forwardedHost,
                  ...commonHeaders,
              }
            : commonHeaders;
    }

    getRequestUrl(domain, { forwardedHost, forwardedProto }) {
        return `${forwardedProto}://${forwardedHost}${this.osaUrl.replace(DOMAIN_NAME_PATERN, domain)}`;
    }
}

module.exports = new OSAService();

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const alerting = __importStar(require("@wk/osa-alerting"));
const browse = __importStar(require("@wk/osa-browse"));
const identity = __importStar(require("@wk/osa-identity"));
const notification = __importStar(require("@wk/osa-notification"));
const personalitem = __importStar(require("@wk/osa-personalitem"));
const research = __importStar(require("@wk/osa-research"));
const resource = __importStar(require("@wk/osa-resource"));
const urm = __importStar(require("@wk/osa-urm"));
const useractivityhistory = __importStar(require("@wk/osa-useractivityhistory"));
const constants_1 = require("../../config/constants");
const externalDependencies_1 = require("../../externalDependencies");
const query = require("@wk/osa-query");
const shortify = require("@wk/osa-shortify");
class OsaService {
    constructor() {
        this.DOMAINS = {
            [constants_1.ALERTING_DOMAIN_NAME]: alerting.AlertingOsaService,
            [constants_1.BROWSE_DOMAIN_NAME]: browse.BrowseOsaService,
            [constants_1.RESEARCH_DOMAIN_NAME]: research.ResearchOsaService,
            [constants_1.RESOURCE_DOMAIN_NAME]: resource.ResourceOsaService,
            [constants_1.URM_DOMAIN_NAME]: urm.UrmOsaService,
            [constants_1.NOTIFICATION_DOMAIN_NAME]: notification.NotificationOsaService,
            [constants_1.IDENTITY_DOMAIN_NAME]: identity.IdentityOsaService,
            [constants_1.PERSONALITEM_DOMAIN_NAME]: personalitem.PersonalitemOsaService,
            [constants_1.QUERY_DOMAIN_NAME]: query.QueryOsaService,
            [constants_1.SHORTIFY_DOMAIN_NAME]: shortify.ShortifyOsaService,
            [constants_1.USERACTIVITYHISTORY_DOMAIN_NAME]: useractivityhistory.UseractivityhistoryOsaService,
        };
        const _a = externalDependencies_1.vars.get('osa'), { url } = _a, osaConfig = __rest(_a, ["url"]);
        const { default: { headers }, } = externalDependencies_1.vars.get('osaProductConfig');
        this.osaUrl = url;
        this.topicSetId = externalDependencies_1.vars.get('topicSetId');
        this.osaHeaders = headers;
        this.osaConfig = osaConfig;
    }
    createDomainServiceInstance(domain, requestData) {
        const ServiceConstructor = this.DOMAINS[domain];
        const osaDomainService = new ServiceConstructor(Object.assign(Object.assign({}, this.osaConfig), { headers: Object.assign(Object.assign({}, this.osaHeaders), this.getRequestHeaders(requestData)), url: this.getRequestUrl(domain, requestData) }));
        osaDomainService.context.on('beforeRequest', (req) => {
            req.headers.CorrelationId = externalDependencies_1.logService.getChainedCorrelationId(req.headers.CorrelationId);
        });
        return osaDomainService;
    }
    getTopicUrl(topicId, requestData) {
        return `${this.getRequestUrl(constants_1.TOPIC_DOMAIN_NAME, requestData)}/Topics('${topicId}')?$expand=Section/ChildSection/ChildSection`;
    }
    getTopicListUrl(requestData) {
        return `${this.getRequestUrl(constants_1.TOPIC_DOMAIN_NAME, requestData)}/TopicSets('${this.topicSetId}')/Topic?$select=Id`;
    }
    getRequestHeaders({ forwardedAuthorization, correlationId, forwardedHost, headers }) {
        var _a, _b;
        const previouslyLoggedInCookieValue = (_b = (_a = headers['cookie']) === null || _a === void 0 ? void 0 : _a.includes(`${constants_1.PREVIOUSLY_LOGGED_IN_COOKIE_NAME}=true`)) !== null && _b !== void 0 ? _b : false;
        const customHeaders = {
            CorrelationId: correlationId,
            Cookie: `${constants_1.PREVIOUSLY_LOGGED_IN_COOKIE_NAME}=${previouslyLoggedInCookieValue}`,
        };
        return forwardedAuthorization
            ? Object.assign({ [constants_1.FORWARDED_AUTHORIZATION_HEADER_NAME]: forwardedAuthorization, [constants_1.UI_HOST_HEADER_NAME]: forwardedHost }, customHeaders) : customHeaders;
    }
    getRequestUrl(domain, { forwardedHost, forwardedProto }) {
        return `${forwardedProto}://${forwardedHost}${this.osaUrl.replace(constants_1.DOMAIN_NAME_PATERN, domain)}`;
    }
    setOsaUrl(url) {
        this.osaUrl = url;
    }
    getOsaUrl() {
        return this.osaUrl;
    }
}
exports.default = new OsaService();
//# sourceMappingURL=osaService.js.map
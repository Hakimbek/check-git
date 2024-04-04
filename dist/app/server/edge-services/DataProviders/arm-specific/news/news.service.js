"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsService = void 0;
const isEmpty_1 = __importDefault(require("lodash/isEmpty"));
const alerts_service_1 = require("@wk/acm-news/edge-services/src/alerts/alerts.service");
const news_dao_osa2_1 = require("./news.dao.osa2");
const externalDependencies_1 = require("../../../externalDependencies");
const arm_data_providers_constants_1 = require("../arm.data-providers.constants");
class NewsServiceError extends Error {
    constructor(message, status = arm_data_providers_constants_1.RESPONSE_STATUSES.INTERNAL_SERVER_ERROR) {
        super(message);
        this.status = status;
    }
}
// @TODO review the list
const newsExtendedMetadataFields = [
    'primary-class',
    'title',
    'region',
    'pubvol',
    'state-tax-type',
    'newsMetadata',
    'sort-date',
];
const NEWS_NODE_ID__A_CLOSER_LOOK = 'csh-da-filter!WKUS-TAL-DOCS-PHC-{3d7b94f0-a12d-309c-99d6-4300ae0a5611}-{2617edb0-9665-322e-a30c-ebb84945d1ad}';
const ALERTS_10K_CUSTOM_CONTEXT = externalDependencies_1.vars.get('10KAlertsCustomContext');
const ALERTS_10K_QUERY_KEYS = [
    'cik',
    'city',
    'companyName',
    'coreIndustries',
    'country',
    'exchange',
    'filingDay',
    'filingMonth',
    'filingStatus',
    'formGroup',
    'formType',
    'incorporationStateCodes',
    'keyword',
    'secFileNumber',
    'sic',
    'state',
    'tenkSection',
    'tradingSymbol',
    'zipCode',
    'limitSectionScope',
    'xbrlCategory',
];
const DUPLICATE_PREVENTION_ERROR_MESSAGE = 'Prevented creation of the duplicate 10K alert.';
const defaultESGAlertAttributes = [
    {
        key: 'from',
        value: 'My ESG Alerts <noreply@wolterskluwer.com>',
    },
    {
        key: 'replyTo',
        value: 'My ESG Alerts <noreply@wolterskluwer.com>',
    },
];
var Alerts10KContext;
(function (Alerts10KContext) {
    Alerts10KContext["TENK"] = "10K";
    Alerts10KContext["ESG"] = "ESG";
})(Alerts10KContext || (Alerts10KContext = {}));
news_dao_osa2_1.NewsDAO.services.DocumentTransformation = { getTitle: (item) => externalDependencies_1.DocumentTransformation.getExtractedTitle(item) };
class NewsService {
    constructor() {
        this.alertsService = alerts_service_1.getAlertsServiceProcessor({ logService: externalDependencies_1.logService, DocumentTransformation: externalDependencies_1.DocumentTransformation });
    }
    getNews(req, { newsType, top, skip }) {
        return __awaiter(this, void 0, void 0, function* () {
            // Now we can handle only one type of news
            if (newsType !== 'a-closer-look') {
                throw new Error('Invalid NewsType');
            }
            const newsContentTreeNodeIds = [NEWS_NODE_ID__A_CLOSER_LOOK];
            return news_dao_osa2_1.NewsDAO.getNews(req, { contentTreeNodeIds: newsContentTreeNodeIds, metadataFields: newsExtendedMetadataFields }, { top, skip });
        });
    }
    get10KAlerts(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const alerts10K = (yield this.alertsService.getAlerts(req, "research" /* research */)).filter(alert => alert.context.customContext === ALERTS_10K_CUSTOM_CONTEXT);
            if (alerts10K.length) {
                const deliveryConfigFor10KAlerts = (yield this.alertsService.getDeliveryConfigurations(req, alerts10K[0].id))[0];
                return alerts10K.map(alert10K => this.get10KAlertDTO(alert10K, deliveryConfigFor10KAlerts));
            }
            return [];
        });
    }
    get10KAlertSubContext(req, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const alert10K = (yield this.alertsService.getAlerts(req, "research" /* research */)).find(alert => alert.id === id);
            return alert10K === null || alert10K === void 0 ? void 0 : alert10K.subContext;
        });
    }
    create10KAlert(req, alertConfig, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const new10KAlertParams = this.get10KAlertParams(alertConfig, context);
            const new10KAlertsDeliveryConfigParams = this.get10KAlertsDeliveryConfigParams(alertConfig);
            const existing10KAlerts = (yield this.alertsService.getAlerts(req, "research" /* research */)).filter(alert => alert.context.customContext === ALERTS_10K_CUSTOM_CONTEXT);
            const filteredByContext10KAlerts = existing10KAlerts.filter(alert => {
                return context === Alerts10KContext.ESG
                    ? (alert === null || alert === void 0 ? void 0 : alert.subContext) === 'ARM_10K_ESG'
                    : (alert === null || alert === void 0 ? void 0 : alert.subContext) !== 'ARM_10K_ESG';
            });
            const isDuplicate10KAlertAlreadyExists = !!filteredByContext10KAlerts.find(alert10K => alert10K.name.toLowerCase() === new10KAlertParams.name.toLowerCase() ||
                alert10K.searchData.query === new10KAlertParams.searchData.query);
            if (isDuplicate10KAlertAlreadyExists) {
                throw new NewsServiceError(DUPLICATE_PREVENTION_ERROR_MESSAGE);
            }
            if (context === Alerts10KContext.ESG) {
                new10KAlertParams.attributes = [
                    ...defaultESGAlertAttributes,
                    {
                        key: 'esgAlertCategory',
                        value: alertConfig.category,
                    },
                ];
                if (alertConfig.synonyms) {
                    new10KAlertParams.attributes.push({
                        key: 'esgAlertSynonyms',
                        value: alertConfig.synonyms,
                    });
                }
            }
            const alerts10KDeliveryConfig = existing10KAlerts.length
                ? (yield this.alertsService.getDeliveryConfigurations(req, existing10KAlerts[0].id))[0]
                : yield this.alertsService.createDeliveryConfiguration(req, new10KAlertsDeliveryConfigParams);
            if (alerts10KDeliveryConfig.recipients[0].address !== alertConfig.deliveryAddress) {
                yield this.alertsService.updateDeliveryConfiguration(req, new10KAlertsDeliveryConfigParams, alerts10KDeliveryConfig.id);
            }
            const newAlertDTO = yield this.alertsService.createAlert(req, new10KAlertParams, alerts10KDeliveryConfig.id);
            return this.get10KAlertDTO(newAlertDTO, alerts10KDeliveryConfig);
        });
    }
    remove10KAlert(req, alertId) {
        return __awaiter(this, void 0, void 0, function* () {
            const isLast10KKAlert = (yield this.alertsService.getAlerts(req, "research" /* research */)).filter(alert => alert.context.customContext === ALERTS_10K_CUSTOM_CONTEXT).length === 1;
            const redundantDeliveryConfigFor10KAlerts = isLast10KKAlert
                ? (yield this.alertsService.getDeliveryConfigurations(req, alertId))[0]
                : null;
            yield this.alertsService.removeAlert(req, alertId, "research" /* research */);
            if (redundantDeliveryConfigFor10KAlerts) {
                yield this.alertsService.removeDeliveryConfiguration(req, redundantDeliveryConfigFor10KAlerts.id);
            }
        });
    }
    update10KAlert(req, alertConfig, alertId, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated10KAlertParams = this.get10KAlertParams(alertConfig, context);
            const updated10KAlertsDeliveryConfigParams = this.get10KAlertsDeliveryConfigParams(alertConfig);
            const existing10KAlerts = (yield this.alertsService.getAlerts(req, "research" /* research */)).filter(alert => alert.context.customContext === ALERTS_10K_CUSTOM_CONTEXT);
            const filteredByContext10KAlerts = existing10KAlerts.filter(alert => {
                return context === Alerts10KContext.ESG
                    ? (alert === null || alert === void 0 ? void 0 : alert.subContext) === 'ARM_10K_ESG'
                    : (alert === null || alert === void 0 ? void 0 : alert.subContext) !== 'ARM_10K_ESG';
            });
            const isDuplicate10KAlertAlreadyExists = !!filteredByContext10KAlerts.find(alert10K => alert10K.id !== alertId &&
                (alert10K.name.toLowerCase() === updated10KAlertParams.name.toLowerCase() ||
                    alert10K.searchData.query === updated10KAlertParams.searchData.query));
            if (isDuplicate10KAlertAlreadyExists) {
                throw new NewsServiceError(DUPLICATE_PREVENTION_ERROR_MESSAGE);
            }
            if (context === Alerts10KContext.ESG) {
                updated10KAlertParams.attributes = [
                    ...defaultESGAlertAttributes,
                    {
                        key: 'esgAlertCategory',
                        value: alertConfig.category,
                    },
                ];
                if (alertConfig.synonyms) {
                    updated10KAlertParams.attributes.push({
                        key: 'esgAlertSynonyms',
                        value: alertConfig.synonyms,
                    });
                }
            }
            const currentDeliveryConfigFor10KAlerts = (yield this.alertsService.getDeliveryConfigurations(req, alertId))[0];
            if (currentDeliveryConfigFor10KAlerts.recipients[0].address !== alertConfig.deliveryAddress) {
                yield this.alertsService.updateDeliveryConfiguration(req, updated10KAlertsDeliveryConfigParams, currentDeliveryConfigFor10KAlerts.id);
            }
            yield this.alertsService.updateAlert(req, updated10KAlertParams, alertId);
        });
    }
    encode10KAlertQueryAsBase64(queryParams) {
        return btoa(Object.keys(queryParams)
            .sort()
            //TO DO: we should rename 'company' to 'companyName' in all places in the app
            .map(key => `${key === 'company' ? 'companyName' : key}=${queryParams[key]}`)
            .join('&'));
    }
    decode10KAlertQuery(query) {
        const result = {};
        let decodedQueryBuffer = atob(query);
        let keyIndex = 0;
        const keysInQuery = ALERTS_10K_QUERY_KEYS.filter(key => decodedQueryBuffer.indexOf(key + '=') !== -1);
        const keysLength = keysInQuery.length;
        while (keyIndex < keysLength) {
            const key = keysInQuery[keyIndex];
            if (!decodedQueryBuffer) {
                break;
            }
            if ((isEmpty_1.default(result) && decodedQueryBuffer.startsWith(key)) || decodedQueryBuffer.startsWith(`&${key}=`)) {
                decodedQueryBuffer = decodedQueryBuffer.replace(new RegExp(`^&?${key}=`), '');
                let value = '';
                let nextKeyword = null;
                let nextKeywordIndex = null;
                for (let i = 0; i < keysInQuery.length; i++) {
                    const keywordIndex = decodedQueryBuffer.indexOf(`&${keysInQuery[i]}=`);
                    if (keywordIndex !== -1 && (nextKeywordIndex === null || keywordIndex < nextKeywordIndex)) {
                        nextKeyword = keysInQuery[i];
                        nextKeywordIndex = keywordIndex;
                    }
                }
                if (nextKeywordIndex !== null) {
                    value = decodedQueryBuffer.split(`&${nextKeyword}=`)[0];
                    decodedQueryBuffer = decodedQueryBuffer.replace(value, '');
                }
                else {
                    value = decodedQueryBuffer;
                }
                //TO DO: we should rename 'company' to 'companyName' in all places in the app
                result[key === 'companyName' ? 'company' : key] = value || decodedQueryBuffer;
                keyIndex = 0;
            }
            else {
                keyIndex++;
            }
        }
        return result;
    }
    get10KAlertParams(alertConfig, context) {
        var _a;
        if ((_a = alertConfig === null || alertConfig === void 0 ? void 0 : alertConfig.queryParams) === null || _a === void 0 ? void 0 : _a.cik) {
            // ARMAC-1678 remove extra leading zeros from CIK
            alertConfig.queryParams.cik = alertConfig.queryParams.cik.replace(/\s/g, '').replace(/^0+/, '');
        }
        const output = {
            name: alertConfig.name,
            searchData: {
                query: this.encode10KAlertQueryAsBase64(alertConfig.queryParams),
            },
            context: {
                type: 3 /* CUSTOM_VALUE */,
                customContext: ALERTS_10K_CUSTOM_CONTEXT,
            },
            disabled: false,
            attributes: [],
        };
        if (context === Alerts10KContext.ESG) {
            output['subContext'] = 'ARM_10K_ESG';
        }
        return output;
    }
    get10KAlertsDeliveryConfigParams(alertConfig) {
        return {
            templateId: 'template_alerting_html_WKUS-TAA-AC-ARM-10K',
            timeZoneId: 'America/Chicago',
            schedule: { frequency: 5 /* IMMEDIATE */ },
            disabled: false,
            groupByInstance: false,
            displayOptions: {
                languageCode: 'en',
            },
            recipients: [{ address: alertConfig.deliveryAddress }],
            attributes: [
                {
                    key: 'viewFilingUrl',
                    value: '/service/edge/services/arm/alerts-10k/email/open-form',
                },
                {
                    key: 'deleteAlertUrl',
                    value: '/service/edge/services/arm/alerts-10k/email/unsubscribe',
                },
                {
                    key: 'viewMoreFilingsUrl',
                    value: '/service/edge/services/arm/alerts-10k/email/open-search',
                },
            ],
        };
    }
    get10KAlertDTO(alertDTO, deliveryConfigFor10KAlerts) {
        const category = alertDTO.attributes.find(item => item.key === 'esgAlertCategory');
        const synonyms = alertDTO.attributes.find(item => item.key === 'esgAlertSynonyms');
        return {
            id: alertDTO.id,
            name: alertDTO.name,
            deliveryAddress: deliveryConfigFor10KAlerts.recipients[0].address,
            created: alertDTO.createDate,
            lastAlert: alertDTO.latestResultDate,
            queryParams: this.decode10KAlertQuery(alertDTO.searchData.query),
            category: category === null || category === void 0 ? void 0 : category.value,
            subContext: alertDTO === null || alertDTO === void 0 ? void 0 : alertDTO.subContext,
            synonyms: synonyms === null || synonyms === void 0 ? void 0 : synonyms.value,
        };
    }
}
exports.NewsService = NewsService;
//# sourceMappingURL=news.service.js.map
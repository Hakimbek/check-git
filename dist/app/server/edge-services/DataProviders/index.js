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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.servicesAPIRouter = void 0;
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./../../../SharedCode/client-server/types.d.ts"/>
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./../../../SharedCode/client-server/qna-shared-data/types.d.ts"/>
const body_parser_1 = require("body-parser");
const express_1 = require("express");
const edge_services_1 = require("@wk/acm-analytics/edge-services");
const edge_services_2 = require("@wk/acm-document/edge-services");
const edge_services_3 = require("@wk/acm-editorials/edge-services");
const edge_services_4 = require("@wk/acm-navigation/edge-services");
const edge_services_5 = require("@wk/acm-news/edge-services");
const edge_services_6 = require("@wk/acm-permissions/edge-services");
const edge_services_7 = require("@wk/acm-personal-items/edge-services");
const edge_services_8 = require("@wk/acm-search/edge-services");
const edge_services_9 = require("@wk/acm-topics/edge-services");
const edge_services_10 = require("@wk/acm-user-info/edge-services");
const arm_specific_1 = require("./arm-specific");
const constants_1 = require("./constants");
const Document_1 = require("./Document");
const documentTypesMapping_1 = require("./documentTypesMapping");
const Query_1 = require("./Query");
const SearchSuggestions_1 = require("./SearchSuggestions");
const SmartCharts_1 = require("./SmartCharts");
const externalDependencies_1 = require("./../externalDependencies");
const osaService_1 = __importDefault(require("./../services/common/osaService"));
const favorites_document_sets_route_1 = require("./arm-specific/combined-document-sets/favorites/favorites-document-sets.route");
const ktmine_route_1 = require("./arm-specific/ktmine/ktmine.route");
const ktmine_service_1 = require("./arm-specific/ktmine/ktmine.service");
const search_within_combinable_1 = require("./arm-specific/search-within-combinable");
const shortify_1 = require("./arm-specific/shortify");
const subject_relation_route_1 = require("./arm-specific/subject-relation/subject-relation.route");
const user_administration_1 = require("./arm-specific/user-administration");
const user_subscriptions_1 = require("./arm-specific/user-subscriptions");
const beyond_routes_1 = require("./beyond/beyond.routes");
const commonService = __importStar(require("./Common/CommonService"));
const edward_jones_routes_1 = require("./edward-jones/edward-jones.routes");
const taskflow_routes_1 = require("./taskflow/taskflow.routes");
const urm_routes_1 = require("./urm/urm.routes");
const user_registration_routes_1 = require("./user-registration/user-registration.routes");
const disableCacheMiddleware_1 = require("../middlewares/disableCacheMiddleware");
const edgeServices_constants_1 = require("../edgeServices.constants");
const PERMISSION_SEARCH_ATS_JURISDICTION = 'ac-jurisdictions-ats-filter';
const PERMISSION_SEARCH_ATS_FILTER_STATE = 'ac-jurisdictions-ats-filter!ATS_US-STATES';
const PERMISSION_SEARCH_ATS_FILTER_FEDERAL = 'ac-jurisdictions-ats-filter!ATS_US-FED';
const PERMISSION_SEARCH_ATS_FILTER_INTERNATIONAL = 'ac-jurisdictions-ats-filter!ATS_INTERNATIONAL';
const armMiddlewares = arm_specific_1.getARMMiddlewares({
    configs: {
        metadataFields: constants_1.defaultDocumentMetadataFields,
    },
    services: { documentTransformation: externalDependencies_1.DocumentTransformation },
});
const userInfoRouter = edge_services_10.userInfoFactory({
    services: {
        osaService: osaService_1.default,
        logService: externalDependencies_1.logService,
        isProfileExposingAllowed: profile => !externalDependencies_1.userTypeService.isSubFreemium(profile.id),
    },
    configVars: {
        icAdminUrl: externalDependencies_1.vars.get('ICAdminUrl'),
        velvetCpId: externalDependencies_1.vars.get('velvet-cpid'),
        userPreferencesKeys: [
            'answerconnect.search.lastTab',
            'answerconnect.home.lastTab',
            'taa.ic.redirect-to-ac',
            'userprefs.answerconnect.home.idp',
            'taa.ac.display-renewal-prompt',
            'answerconnect.research-folders.personal-folders',
            'arm.userprefs.showPendingContent',
            'arm.userprefs.as-jurisdiction',
            'userprefs.legacyArm.enableLink',
            'arm.userprefs.as-jurisdiction-all',
            externalDependencies_1.vars.get('usedPreferences').client.saveToAxcess,
            externalDependencies_1.vars.get('usedPreferences').client.lastUsedTradingSymbols,
            externalDependencies_1.vars.get('usedPreferences').client.lastUsedTradingSymbolsCDL,
            externalDependencies_1.vars.get('usedPreferences').client.bspAwareness,
            externalDependencies_1.vars.get('usedPreferences').client.annotationsNotes,
        ],
    },
});
const navigationModuleRouter = edge_services_4.navigationFactory({
    configVars: {
        TREATISES_TREE_NODE_ID: constants_1.TREATISES_TREE_NODE_ID,
        JOURNALS_ROOT_NODE_ID: constants_1.JOURNALS_ROOT_NODE_ID,
        TOOLS_ROOT_NODE_ID: constants_1.TOOLS_ROOT_NODE_ID,
    },
    services: {
        userTypeService: externalDependencies_1.userTypeService,
        logService: externalDependencies_1.logService,
    },
});
const env = externalDependencies_1.vars.get('env') || ((_a = process === null || process === void 0 ? void 0 : process.env) === null || _a === void 0 ? void 0 : _a.env);
const isProdEnv = env === 'prod' || env === 'prod-ohio';
const localS3Credentials = isProdEnv
    ? process.env.S3_PROD_CREDS && JSON.parse(process.env.S3_PROD_CREDS)
    : process.env.S3_NON_PROD_CREDS && JSON.parse(process.env.S3_NON_PROD_CREDS);
const remoteS3Credentials = {
    accessKeyId: process.env.AWS_BRAND_LOGO_BUCKET_ACCESS_KEY,
    secretAccessKey: process.env.AWS_BRAND_LOGO_BUCKET_SECRET_KEY,
};
const editorialsRouter = edge_services_3.editorialsFactory({
    services: { logService: externalDependencies_1.logService, userTypeService: externalDependencies_1.userTypeService },
    configVars: {
        regentConfig: constants_1.REGENT_CONFIG,
        s3BucketConfig: {
            region: 'us-east-1',
            credentials: remoteS3Credentials.accessKeyId && remoteS3Credentials.secretAccessKey
                ? remoteS3Credentials
                : localS3Credentials,
            bucketName: isProdEnv ? 'ac-us-brand-logos-prod' : 'ac-us-brand-logos',
        },
        isEdgeServiceFactoryConfigured: true,
    },
});
const searchModelRouter = edge_services_8.searchModelFactory({
    services: {
        logService: externalDependencies_1.logService,
        documentTransformation: externalDependencies_1.DocumentTransformation,
        providerServices: {
            ktMine: ktmine_service_1.getKTMineProcessor(),
            ktMine_xbrl: ktmine_service_1.getKTMineProcessor(),
        },
    },
    configVars: {
        QUERY_CORRECTION_MODEL_CONFIG: {
            dictionaryIds: ['WKUS-TAA-AUTOCORRECT'],
            language: 'en-US',
            matchScope: 1,
            maxConceptSuggestions: 3,
            suggestSpellingsNumber: 3,
        },
    },
});
const topicsRouter = edge_services_9.topicsFactory({
    services: { userTypeService: externalDependencies_1.userTypeService, logService: externalDependencies_1.logService },
});
const documentsRouter = edge_services_2.documentsFactory({
    configVars: {
        cfid: 'wkusacc',
        defaultDocumentMetadataFields: constants_1.defaultDocumentMetadataFields,
        documentTypesMapping: documentTypesMapping_1.DOCUMENT_TYPES_MAPPING,
        documentEntity: {
            exposedMetadata: [
                { key: 'primary-class' },
                { key: 'pubVol' },
                { key: 'publishing-status', attributeKey: 'status' },
                { key: 'pcicore:isIssuedBy', attributeKey: 'foaf:name' },
                { key: 'DocStatus' },
            ],
        },
        spooler: {
            sendRawJobCreationResponse: true,
            DAOVersion: 1,
            getJobResultResolverUrl: (req) => `${req.forwardedProto}://${req.forwardedHost}/app/acr/jqms/job-result?jobId=`,
        },
    },
    services: {
        logService: externalDependencies_1.logService,
        documentTransformation: externalDependencies_1.DocumentTransformation,
        isContentAllowed: (req) => !externalDependencies_1.userTypeService.isFreemium(req),
        hasContentSeats: (req, documentId) => {
            const concurrencyService = armMiddlewares.services.concurrency;
            return concurrencyService.hasDocumentSeats(req, documentId, req.forwardedSub);
        },
    },
});
const newsModuleRouter = edge_services_5.newsFactory({
    services: { DocumentTransformation: externalDependencies_1.DocumentTransformation, logService: externalDependencies_1.logService },
    configVars: {
        newsContentTreeNodeIds: constants_1.NEWS_CONTENT_TREE_NODE_IDS,
        federalClientImpact: constants_1.FEDERAL_CLIENT_IMPACT,
        newsLettersConfig: constants_1.NEWS_LETTERS_CONFIG,
        stateClientImpact: constants_1.STATE_CLIENT_IMPACT,
    },
});
const personalItemRouter = edge_services_7.personalItemsFactory({
    services: {
        logService: externalDependencies_1.logService,
        userTypeService: externalDependencies_1.userTypeService,
        documentTransformation: externalDependencies_1.DocumentTransformation,
    },
    configVars: {
        documentTypesMapping: documentTypesMapping_1.DOCUMENT_TYPES_MAPPING,
        resolveToolsFreemiumURL: constants_1.RESOLVE_TOOLS_FREEMIUM_URL,
        resolveToolsRegisteredUrl: constants_1.RESOLVE_TOOLS_REGISTERED_URL,
        toolResolvingAdditionalParams: constants_1.TOOL_RESOLVING_ADDITIONAL_PARAMS,
        favoriteItemAdditionalInfoVars: {
            document: {
                getUrl: favoriteItem => {
                    if (favoriteItem.isArmContent) {
                        return `/app/acr/navigation?documentId=${encodeURIComponent(favoriteItem.documentEntity.id)}`;
                    }
                    return `/resolve/document/${favoriteItem.documentEntity.id}`;
                },
                getProxyUrl: favoriteItem => {
                    if (favoriteItem.isArmContent) {
                        return `/app/acr/navigation?documentId=${encodeURIComponent(favoriteItem.documentEntity.id)}`;
                    }
                    return `/resolve/document/${favoriteItem.documentEntity.id}`;
                },
            },
            multistateTax: {
                getTitle: favoriteItem => {
                    const multistateTaxTitle = favoriteItem.title.replace(/(multistate\s)|(\s\(multistate\))|(\s\guide)/gi, '');
                    return `Multistate Tax: ${multistateTaxTitle}`;
                },
                getUrl: favoriteItem => `/multistatebrowse/${favoriteItem.treeNodeId}`,
            },
            state: {
                getTitle: favoriteItem => `State: ${favoriteItem['stateTitle'] || favoriteItem.label}`,
                getUrl: favoriteItem => `/statenavigator/${favoriteItem.treeNodeId}`,
                getStateCode: favoriteItem => Object.keys(edgeServices_constants_1.STATE_ALIASES).find(stateKey => edgeServices_constants_1.STATE_ALIASES[stateKey].toLowerCase() === favoriteItem.label.toLowerCase()),
            },
            smartchart: {
                getTitle: favoriteItem => favoriteItem.smartChartsTitle || favoriteItem.label,
                getUrl: (favoriteItem, protocol) => favoriteItem.isOffPlatformSmartCharts
                    ? commonService.getToolUrl(favoriteItem['templateUrl'], protocol, false)
                    : `/resolve/smartcharts?data=${encodeURIComponent(favoriteItem.smartChartsId)}`,
            },
            search: {
                getTitle: favoriteItem => favoriteItem.label,
                getUrl: favoriteItem => `/app/acr/resolve/search?query=${encodeURIComponent(favoriteItem.favoriteItemTitle || favoriteItem.label)}`,
            },
            combinedDocumentSet: {
                getTitle: favoriteItem => favoriteItem.label,
                getUrl: favoriteItem => {
                    return `/app/acr/combined-document/favorites?searchId=${favoriteItem['searchId']}&nodeId=${encodeURIComponent(favoriteItem['nodeId'])}`;
                },
            },
            as360Document: {
                getTitle: favoriteItem => favoriteItem.label,
                getUrl: favoriteItem => {
                    var _a;
                    return `/app/acr/navigation?documentId=${encodeURIComponent(favoriteItem.documentEntity.id)}&nodeId=${encodeURIComponent((_a = favoriteItem.customParams) === null || _a === void 0 ? void 0 : _a['nodeId'])}`;
                },
            },
        },
        historyItemAdditionalInfoVars: {
            getDocumentUrl: (documentId, nodeId) => {
                if (nodeId && documentId) {
                    return `/app/acr/navigation?documentId=${encodeURIComponent(documentId)}&nodeId=${encodeURIComponent(nodeId)}`;
                }
                if (nodeId) {
                    return `/app/acr/navigation?nodeId=${encodeURIComponent(nodeId)}`;
                }
                return `/app/acr/navigation?documentId=${encodeURIComponent(documentId)}`;
            },
            getSearchUrl: query => `/app/acr/resolve/search?query=${encodeURIComponent(query)}`,
        },
        historyItemExtraDataExtractor: {
            extract: ({ userHistoryItem }) => {
                var _a;
                const tagParts = (_a = userHistoryItem.tag) === null || _a === void 0 ? void 0 : _a.split('|');
                let nodeId;
                if (tagParts && tagParts[0] === 'ARM_AS360') {
                    nodeId = tagParts[2];
                }
                return { nodeId };
            },
        },
    },
});
const permissionsRouter = edge_services_6.permissionsFactory({
    services: {
        osaService: osaService_1.default,
        logService: externalDependencies_1.logService,
        userTypeService: externalDependencies_1.userTypeService,
    },
    configVars: {
        permissionsConfig: {
            jurisdictions: {
                root: PERMISSION_SEARCH_ATS_JURISDICTION,
                federal: PERMISSION_SEARCH_ATS_FILTER_FEDERAL,
                state: PERMISSION_SEARCH_ATS_FILTER_STATE,
                international: PERMISSION_SEARCH_ATS_FILTER_INTERNATIONAL,
                excludedContentTreeNodeIds: constants_1.NON_ARM_HOME_TABS_EXCLUDED_CSH_NODE_IDS,
            },
        },
    },
});
const analyticsServiceRouter = edge_services_1.analyticsFactory({
    services: {
        logService: externalDependencies_1.logService,
    },
    configVars: {
        velvetApiKey: externalDependencies_1.vars.get('velvet-apikey'),
        velvetCpid: externalDependencies_1.vars.get('velvet-cpid'),
    },
});
const router = express_1.Router();
router.use(disableCacheMiddleware_1.disableCache);
router.use('/document', Document_1.serviceDocumentAPIRouter);
router.use('/search', SearchSuggestions_1.serviceSearchSuggestionRouter);
router.use(body_parser_1.json());
router.use('/search', search_within_combinable_1.searchWithinDocumentSetRouter);
router.use('/search', favorites_document_sets_route_1.restoreCombinedDocumentRouter);
router.use('/', ktmine_route_1.getKTMineServiceMiddleware().router);
router.use('/', armMiddlewares.router);
router.use('/', subject_relation_route_1.serviceSubjectRelationRouter);
router.use('/modular', userInfoRouter);
router.use('/modular', navigationModuleRouter);
router.use('/modular', editorialsRouter);
router.use('/modular', topicsRouter);
router.use('/modular', newsModuleRouter);
router.use('/modular', personalItemRouter);
router.use('/modular', permissionsRouter);
router.use('/modular', analyticsServiceRouter);
router.use('/modular', searchModelRouter);
router.use('/modular', documentsRouter);
router.use('/query', Query_1.queryRouter);
router.use('/smart-chart', SmartCharts_1.smartChartsRouter);
router.use('/arm', user_subscriptions_1.userSubscriptionsServiceRouter);
router.use('/arm', user_administration_1.userAdministrationServiceRouter);
router.use('/arm/shortify', shortify_1.shortifyRouter);
router.use('/urm', urm_routes_1.urmRouter);
router.use('/taskflow', taskflow_routes_1.serviceTaskflowRouter);
router.use('/user-registration', user_registration_routes_1.userRegistrationRouter);
router.use('/edward-jones', edward_jones_routes_1.edwardJonesRouter);
router.use('/beyond', beyond_routes_1.beyondRouter);
exports.servicesAPIRouter = router;
//# sourceMappingURL=index.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.servicesAPIRouter = void 0;
const express_1 = require("express");
const edge_services_1 = require("@wk/acm-permissions/edge-services");
const edge_services_2 = require("@wk/acm-personal-items/edge-services");
const edge_services_3 = require("@wk/acm-user-info/edge-services");
const edge_services_4 = require("@wk/acm-news/edge-services");
const edge_services_5 = require("@wk/acm-editorials/edge-services");
const edge_services_6 = require("@wk/acm-navigation/edge-services");
const edge_services_7 = require("@wk/acm-favourites/edge-services");
const searchSuggestions_1 = require("./dataProviders/searchSuggestions");
const AlertingServiceRoute_1 = require("./dataProviders/newsUnsubscribe/AlertingServiceRoute");
const disableCacheMiddleware_1 = require("./middlewares/disableCacheMiddleware");
const externalDependencies_1 = require("./externalDependencies");
const { osaService } = require('@wk/acm-osa-service/edge-services');
const { osa3Service } = require('@wk/acm-osa3-service/edge-services');
const bodyParser = require('body-parser');
const hpp = require('hpp');
const { osa, osaProductConfig } = require('../config/appConfig').osaConfig;
const { clientId, REGENT_CONFIG } = require('../config/appConfig');
const edge_services_8 = require("@wk/acm-analytics/edge-services");
const varsService_1 = require("../services/varsService");
const edgeServices_constants_1 = require("./edgeServices.constants");
const searchModel_1 = require("./dataProviders/searchModel");
const documentTypesIdMapping_1 = require("../constants/documentTypesIdMapping");
const newsContentTreeNodeIds_1 = require("../constants/newsContentTreeNodeIds");
const CONGRES_ROOT_NODE_ID = 'csh-da-filter!z2ac526ae6562798a84755e30b3congres';
const ONLINE_BOOKS_ROOT_EN_NODE_ID = 'csh-da-filter!52ad162880b76e6e56bdda54070c4951booksen';
const ONLINE_BOOKS_ROOT_FR_NODE_ID = 'csh-da-filter!52ad162880b76e6e56bdda54070c4951booksfr';
const CPID = varsService_1.VarsService.get('cpid');
osaService.configure({
    logService: externalDependencies_1.logService,
    osa,
    osaProductConfig
});
osa3Service.configure({
    logService: externalDependencies_1.logService,
    osa,
    osaProductConfig
});
const userInfoRouter = edge_services_3.userInfoFactory({
    services: {
        osaService,
        logService: externalDependencies_1.logService,
        isProfileExposingAllowed: (profile) => !externalDependencies_1.userTypeService.isSubFreemium(profile.id)
    },
    configVars: {
        icAdminUrl: varsService_1.VarsService.get('ICAdminUrl'),
        velvetCpId: CPID,
        userPreferencesKeys: [
            'answerconnect.search.lastTab',
            'answerconnect.home.lastTab',
            'userprefs.customer.preferred.product',
            'taa.ic.redirect-to-ac',
            'answerconnect.license.agreement.accepted',
            'userprefs.answerconnect.home.idp',
            'answerconnect.ca.history.enabled',
            'answerconnect.ca.favorites.enabled',
            'answerconnect.ca.news.signup-widget.enabled',
            'answerconnect.ca.search.alerts.enabled'
        ],
        editProfileAction: 'UpdateEndUserProfileAC.aspx',
        editProfileParam: '&LANG=',
        changePasswordAction: 'ChangePasswordAC.aspx',
        changePasswordParam: '&LANG=',
        trialUserAccountNumberPrefix: edgeServices_constants_1.TRIAL_USER_ACCOUNT_NUMBER_PREFIX
    }
});
const personalItemRouter = edge_services_2.personalItemsFactory({
    services: {
        logService: externalDependencies_1.logService,
        userTypeService: externalDependencies_1.userTypeService,
        documentTransformation: externalDependencies_1.DocumentTransformation
    },
    configVars: {
        documentTypesMapping: documentTypesIdMapping_1.DOCUMENT_TYPES_ID_MAPPING,
        resolveToolsFreemiumURL: '/service/public/identity/scibum/resolveTools',
        resolveToolsRegisteredUrl: '/service/public/identity/scibum/resolveTools',
        toolResolvingAdditionalParams: {
            cpid: CPID,
            brand: clientId
        },
        historyItemAdditionalInfoVars: {
            getDocumentUrl: (historyItemId) => `/resolve/document/${historyItemId.replace(/FULL$/, '')}`,
            getSearchUrl: (historyItem) => `/results/search/initial?page=1&query=${historyItem}`
        },
        isSectionTagDisplayed: true
    }
});
const newsModuleRouter = edge_services_4.newsFactory({
    services: { DocumentTransformation: externalDependencies_1.DocumentTransformation, logService: externalDependencies_1.logService },
    configVars: {
        newsContentTreeNodeIds: newsContentTreeNodeIds_1.NEWS_CONTENT_TREE_NODE_IDS
    }
});
const permissionsRouter = edge_services_1.permissionsFactory({
    services: {
        logService: externalDependencies_1.logService,
        userTypeService: externalDependencies_1.userTypeService
    }
});
const navigationModuleRouter = edge_services_6.navigationFactory({
    configVars: {
        CONGRES_ROOT_NODE_ID,
        ONLINE_BOOKS_ROOT_EN_NODE_ID,
        ONLINE_BOOKS_ROOT_FR_NODE_ID
    },
    services: {
        logService: externalDependencies_1.logService,
        userTypeService: externalDependencies_1.userTypeService
    }
});
const editorialsRouter = edge_services_5.editorialsFactory({
    services: { logService: externalDependencies_1.logService, userTypeService: externalDependencies_1.userTypeService },
    configVars: {
        regentConfig: REGENT_CONFIG,
        resolvePermissionsAPIURL: '/service/edge/services/modular/permissions/resolve-permissions',
        isFrenchTranslationsAvailable: true
    }
});
const analyticsServiceRouter = edge_services_8.analyticsFactory({
    services: {
        logService: externalDependencies_1.logService
    },
    configVars: {
        velvetApiKey: varsService_1.VarsService.get('velvet-apikey'),
        velvetCpid: varsService_1.VarsService.get('cpid'),
        sessionExpiredUrl: varsService_1.VarsService.get('sessionExpiredUrl')
    }
});
const dossierServiceRouter = edge_services_7.favouritesFactory({
    services: {
        logService: externalDependencies_1.logService,
        documentTransformation: externalDependencies_1.DocumentTransformation
    },
    configVars: {
        documentTypesMapping: documentTypesIdMapping_1.DOCUMENT_TYPES_ID_MAPPING,
        resolveToolsFreemiumURL: '/service/public/identity/scibum/resolveTools',
        resolveToolsRegisteredUrl: '/service/public/identity/scibum/resolveTools',
        toolResolvingAdditionalParams: {
            cpid: CPID,
            brand: clientId
        },
        favoriteItemAdditionalInfoVars: {
            state: {
                getTitle: (favoriteItem) => `Province: ${favoriteItem.label}`,
                getUrl: (favoriteItem) => `/browse/provinces/${favoriteItem.treeNodeId}`,
                getStateCode: (favoriteItem) => {
                    let code = '';
                    Object.keys(edgeServices_constants_1.PROVINCES_ALIASES).forEach((provinceCode) => {
                        if (edgeServices_constants_1.PROVINCES_ALIASES[provinceCode].some((provinceName) => provinceName.toLowerCase() === favoriteItem.label.toLowerCase())) {
                            code = provinceCode;
                        }
                    });
                    return code;
                }
            },
            document: {
                getTitle: (favoriteItem) => favoriteItem.label,
                getUrl: (favoriteItem) => `/resolve/document/${favoriteItem.documentEntity.id}`,
                getProxyUrl: (favoriteItem) => `/resolve/document/${favoriteItem.documentEntity.id}`
            },
            search: {
                getTitle: (favoriteItem) => `${favoriteItem.label}`,
                getUrl: (favoriteItem) => `/resolve/restore?id=${favoriteItem.id}`
            },
            smartchart: {
                getTitle: (favoriteItem) => `${favoriteItem.smartChartsTitle || favoriteItem.label}`,
                getUrl: (favoriteItem) => {
                    try {
                        const { type, years, topics, provinces } = JSON.parse(favoriteItem.smartChartsId);
                        return `/smartcharts?type=${type}&years=${years}&topics=${topics}&provinces=${provinces}`;
                    }
                    catch (error) {
                        console.warn('Failed to parse favorite smart charts data', favoriteItem.smartChartsId, error);
                    }
                }
            }
        },
        isSectionTagDisplayed: true
    }
});
const router = express_1.Router();
router.use(bodyParser.urlencoded({ extended: true, limit: '40kb' }));
router.use(bodyParser.json({ limit: '40kb' }));
router.use(hpp());
router.use(disableCacheMiddleware_1.disableCache);
router.use('/search', searchSuggestions_1.serviceSearchSuggestionRouter);
router.use('/searchModel', searchModel_1.serviceSearchModelRouter);
router.use('/alerting', AlertingServiceRoute_1.serviceAlertingRouter);
router.use('/modular', permissionsRouter);
router.use('/modular', userInfoRouter);
router.use('/modular', editorialsRouter);
router.use('/modular', personalItemRouter);
router.use('/modular', newsModuleRouter);
router.use('/modular', navigationModuleRouter);
router.use('/modular', analyticsServiceRouter);
router.use('/modular', dossierServiceRouter);
exports.servicesAPIRouter = router;
//# sourceMappingURL=index.js.map
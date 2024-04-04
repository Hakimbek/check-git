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
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const log_base_1 = require("@wk/log-base");
const osa = __importStar(require("@wk/osa"));
const research = __importStar(require("@wk/osa-research"));
const AbstractClaimsService_1 = __importDefault(require("./AbstractClaimsService"));
const constants_1 = require("../../config/constants");
const externalDependencies_1 = require("../../externalDependencies");
const externalDependencies_2 = require("../../externalDependencies");
const osaService_1 = __importDefault(require("../common/osaService"));
class FreemiumClaimsService extends AbstractClaimsService_1.default {
    constructor() {
        super();
        this.userName = constants_1.FREE_USER_NAME;
        this.internationalTopicsTreeNodeId = externalDependencies_2.vars.get('jurisdictionFilterId');
        this.internationalTopicsScopeToFilterTree = [
            externalDependencies_2.vars.get('jurisdictionInternationalId'),
            externalDependencies_2.vars.get('intlDoctypesAtsTopicsFilterId'),
        ];
        this.internationalTopicsLevels = 3;
        this.internationalNewsContentId = externalDependencies_2.vars.get('newsContentNodeIds').international;
    }
    updateClaims(requestData) {
        return Promise.all([
            this.getAllClaims(requestData),
            this.checkInternationalTopics(requestData),
            this.checkInternationalNews(requestData),
        ]).then(([permissions, internationalTopics, internationalNews]) => ({
            permissions,
            internationalTopics,
            internationalNews,
        }));
    }
    checkInternationalTopics(requestData) {
        const searchParams = new research.ExecuteSearch({
            query: '*',
            RuntimeOptions: new research.SearchRuntimeParams({
                FilterTrees: [
                    new research.FilterTreeParams({
                        filterTreeId: this.internationalTopicsTreeNodeId,
                        filterTreeLevels: this.internationalTopicsLevels,
                    }),
                ],
                SaveToHistory: false,
            }),
            searchScope: new research.SearchScopeParams({
                contentTreeNodeIds: [],
                filterTreeNodeIds: this.internationalTopicsScopeToFilterTree,
                excludedContentTreeNodeIds: [
                    'csh-da-filter!WKUS-TAL-DOCS-PHC-{3d7b94f0-a12d-309c-99d6-4300ae0a5611}',
                    'csh-da-filter!WKUS-TAL-DOCS-PHC-{25c555fd-aa38-2235-cc99-68a30fc21a77}',
                ],
                includeArchivePubs: false,
                subscriptionLevel: research.SubscriptionLevel.All,
            }),
        });
        const params = new osa.common.ODataParams({
            $expand: `Result/Trees/Nodes/${new Array(this.internationalTopicsLevels).fill('Children').join('/')}`,
        });
        externalDependencies_1.logService.logRequest(log_base_1.LogLevel.Info, requestData, {
            message: `Checking international topics for ${this.userName} user is started`,
        });
        return osaService_1.default
            .createDomainServiceInstance(constants_1.RESEARCH_DOMAIN_NAME, requestData)
            .executeSearch(searchParams, params)
            .then(searchResult => {
            externalDependencies_1.logService.logRequest(log_base_1.LogLevel.Info, requestData, {
                message: `Checking international topics for ${this.userName} user is ended successfully`,
            });
            const internationalTopics = lodash_1.get(searchResult, 'result.trees[0].nodes[0].children[0].children', []);
            return !!internationalTopics.length;
        })
            .catch((error) => {
            externalDependencies_1.logService.logRequest(log_base_1.LogLevel.Error, requestData, {
                message: `Failed to check international topics for ${this.userName} user`,
            }, error);
            return Promise.reject(error);
        });
    }
    checkInternationalNews(requestData) {
        const searchParams = new research.ExecuteSearch({
            query: '*',
            searchScope: new research.SearchScopeParams({
                contentTreeNodeIds: [this.internationalNewsContentId],
            }),
            runtimeOptions: new research.SearchRuntimeParams({
                saveToHistory: false,
            }),
        });
        const params = {
            $expand: 'Result',
        };
        externalDependencies_1.logService.logRequest(log_base_1.LogLevel.Info, requestData, {
            message: `Checking international news for ${this.userName} user is started`,
        });
        return osaService_1.default
            .createDomainServiceInstance(constants_1.RESEARCH_DOMAIN_NAME, requestData)
            .executeSearch(searchParams, params)
            .then(search => search.getResult())
            .then(searchResult => {
            externalDependencies_1.logService.logRequest(log_base_1.LogLevel.Info, requestData, {
                message: `Checking international news for ${this.userName} user is ended successfully`,
            });
            return !!searchResult.totalHits;
        })
            .catch((error) => {
            externalDependencies_1.logService.logRequest(log_base_1.LogLevel.Error, requestData, {
                message: `Failed to check international topics for ${this.userName} user`,
            }, error);
            return Promise.reject(error);
        });
    }
    getAllClaims(requestData) {
        externalDependencies_1.logService.logRequest(log_base_1.LogLevel.Info, requestData, {
            message: `Getting ${this.userName} user rights is started`,
        });
        return this.getRights(requestData)
            .then(rights => {
            externalDependencies_1.logService.logRequest(log_base_1.LogLevel.Info, requestData, {
                message: `Getting ${this.userName} user claims is ended (${rights.length} pcs.).`,
            });
            return rights.map(item => ({ id: item.id, type: item.type }));
        })
            .catch(error => {
            externalDependencies_1.logService.logRequest(log_base_1.LogLevel.Error, requestData, {
                message: `Failed to get list of rights for ${this.userName} user".`,
            }, error);
            return Promise.reject(error);
        });
    }
}
exports.default = new FreemiumClaimsService();
//# sourceMappingURL=freemiumClaimsService.js.map
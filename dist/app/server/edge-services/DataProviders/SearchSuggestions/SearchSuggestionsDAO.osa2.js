"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchIntTopicsTree = exports.getPermissionedTree = exports.loadSuggestions = exports.getPermissionsByModuleIds = exports.Search = exports.AutocompleteSearchMethod = void 0;
const lodash_1 = require("lodash");
const osa_research_1 = require("@wk/osa-research");
const osa_resource_1 = require("@wk/osa-resource");
const constants_1 = require("../../config/constants");
const osaService_1 = __importDefault(require("../../services/common/osaService"));
var osa_query_1 = require("@wk/osa-query");
Object.defineProperty(exports, "AutocompleteSearchMethod", { enumerable: true, get: function () { return osa_query_1.AutocompleteSearchMethod; } });
var osa_research_2 = require("@wk/osa-research");
Object.defineProperty(exports, "Search", { enumerable: true, get: function () { return osa_research_2.Search; } });
function getPermissionsByModuleIds(req, moduleIds) {
    const resourceService = osaService_1.default.createDomainServiceInstance(constants_1.RESOURCE_DOMAIN_NAME, req);
    return resourceService.getContentAuthorization(new osa_resource_1.GetContentAuthorization({
        moduleIds: moduleIds.map(moduleId => new osa_resource_1.ContentModuleId({ id: moduleId })),
        ModuleTypeValue: req.isFreemium ? 1 : 0,
    }));
}
exports.getPermissionsByModuleIds = getPermissionsByModuleIds;
function loadSuggestions(req, query, config, params) {
    const suggestConfig = {
        dictionaryIds: config.dictionaryIds,
        languages: config.languages,
        maxSuggestions: config.maxSuggestions,
        searchMethod: config.searchMethod,
    };
    const requestParams = lodash_1.defaults({}, suggestConfig, { query }, params);
    const queryService = osaService_1.default.createDomainServiceInstance(constants_1.QUERY_DOMAIN_NAME, req);
    return queryService.autocompletions(requestParams, {});
}
exports.loadSuggestions = loadSuggestions;
function getPermissionedTree(treeId, options, req) {
    const researchService = osaService_1.default.createDomainServiceInstance(constants_1.RESEARCH_DOMAIN_NAME, req);
    options.levels = options.levels || 0;
    options.$expand = options.$expand || '';
    const separator = options.$expand.length > 0 ? ',' : '';
    if (options.levels > 0) {
        options.$expand =
            options.$expand + separator + 'Result/Trees/Nodes/' + lodash_1.fill(new Array(options.levels), 'Children').join('/');
    }
    const searchParams = new osa_research_1.ExecuteSearch({
        query: '*',
        RuntimeOptions: new osa_research_1.SearchRuntimeParams({
            FilterTrees: [
                new osa_research_1.FilterTreeParams({
                    filterTreeId: treeId,
                    filterTreeLevels: options.levels,
                }),
            ],
            SaveToHistory: false,
        }),
    });
    searchParams.searchScope = new osa_research_1.SearchScopeParams({
        contentTreeNodeIds: options.scopeToCshNode ? [options.scopeToCshNode] : [],
        filterTreeNodeIds: options.scopeToFilterTree ? options.scopeToFilterTree : [],
        excludedContentTreeNodeIds: [
            'csh-da-filter!WKUS-TAL-DOCS-PHC-{3d7b94f0-a12d-309c-99d6-4300ae0a5611}',
            'csh-da-filter!WKUS-TAL-DOCS-PHC-{25c555fd-aa38-2235-cc99-68a30fc21a77}',
        ],
        includeArchivePubs: false,
    });
    if (req['isFreemium']) {
        searchParams.searchScope.subscriptionLevel = osa_research_1.SubscriptionLevel.All;
    }
    return researchService.executeSearch(searchParams, {
        $expand: options.$expand,
    });
}
exports.getPermissionedTree = getPermissionedTree;
function fetchIntTopicsTree(req, intATSTopicsTree, filterTreeNodeId) {
    const researchService = osaService_1.default.createDomainServiceInstance(constants_1.RESEARCH_DOMAIN_NAME, req);
    const searchParams = new osa_research_1.ExecuteSearch({
        query: '*',
        searchScope: new osa_research_1.SearchScopeParams({
            filterTreeNodeIds: [filterTreeNodeId],
            excludedContentTreeNodeIds: [
                'csh-da-filter!WKUS-TAL-DOCS-PHC-{3d7b94f0-a12d-309c-99d6-4300ae0a5611}',
                'csh-da-filter!WKUS-TAL-DOCS-PHC-{25c555fd-aa38-2235-cc99-68a30fc21a77}',
            ],
            includeArchivePubs: false,
        }),
        runtimeOptions: new osa_research_1.SearchRuntimeParams({
            filterTrees: [
                new osa_research_1.FilterTreeParams({
                    filterTreeId: intATSTopicsTree.filterTreeId,
                    filterTreeLevels: intATSTopicsTree.filterTreeLevels,
                }),
            ],
            saveToHistory: false,
        }),
    });
    const oDataParams = {
        $expand: 'Result/Trees/Nodes/' + lodash_1.fill(Array(intATSTopicsTree.filterTreeLevels), 'Children').join('/'),
        $top: '200',
    };
    if (req['isFreemium']) {
        searchParams.searchScope.subscriptionLevel = osa_research_1.SubscriptionLevel.All;
    }
    return researchService.executeSearch(searchParams, oDataParams);
}
exports.fetchIntTopicsTree = fetchIntTopicsTree;
//# sourceMappingURL=SearchSuggestionsDAO.osa2.js.map
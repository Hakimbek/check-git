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
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestRefineSearch = exports.requestExecuteSearch = void 0;
const osa_research_1 = require("@wk/osa-research");
const SearchResponse_1 = require("./SearchResponse");
const SearchModel_constants_1 = require("./SearchModel.constants");
const SearchResponseResult_1 = require("./SearchResponseResult");
const { osaService } = require('@wk/acm-osa-service/edge-services');
const requestExecuteSearch = (req, requestData) => __awaiter(void 0, void 0, void 0, function* () {
    /* eslint-disable no-useless-catch*/
    try {
        const { model } = requestData;
        const filterTrees = model.filtersToDisplay
            .filter(item => !item.isFilterField)
            .map(item => new osa_research_1.FilterTreeParams({
            filterTreeId: item.filterId,
            startFilterTreeNodeId: item.startFromNodeId,
            filterTreeLevels: item.expandedLevels,
        }));
        const filterFields = model.filtersToDisplay
            .filter(item => !!item.isFilterField)
            .map(item => new osa_research_1.FilterFieldParams({
            filterFieldId: item.filterId,
        }));
        const searchScope = new osa_research_1.SearchScopeParams({
            filterTreeNodeIds: model.fixedSearchScope.searchInsideATSNodes.map(item => item.filterNodeId),
            contentTreeNodeIds: model.fixedSearchScope.searchInsideCSHNodes,
            includeArchivePubs: false,
            includeModelDocuments: model.fixedSearchScope.includeModelDocuments,
            excludedContentTreeNodeIds: model.fixedSearchScope.excludeCSHNodes,
            subscriptionLevel: model.permission,
        });
        const runtimeOptions = new osa_research_1.SearchRuntimeParams({
            filterTrees,
            filterFields,
            saveToHistory: false,
            extendedMetadataParams: new osa_research_1.ExtendedMetadataParams({
                extendedMetadataFields: model.requestMetadataKeys.length
                    ? model.requestMetadataKeys
                    : SearchModel_constants_1.DOCUMENT_EXTENDED_METADATA_FIELDS,
            }),
            sorting: [
                new osa_research_1.Sort({
                    order: model.sort.order,
                    direction: model.sort.direction,
                }),
            ],
        });
        const queryProcessingOptions = new osa_research_1.QueryProcessingParams({
            useThesaurusDictionary: true,
        });
        const executeSearchParams = new osa_research_1.ExecuteSearch({
            searchScope,
            runtimeOptions,
            queryProcessingOptions,
            query: '*',
        });
        const researchService = osaService.createDomainServiceInstance(osa_research_1.ResearchOsaService, 'Research', req);
        const executeSearch = yield researchService.executeSearch(executeSearchParams, {
            $expand: 'Result/Trees/Nodes/Children/Children',
        });
        const executeSearchResults = yield executeSearch.getResult();
        const executeSearchResultItems = yield executeSearchResults.getItems();
        const executeSearchResultTrees = yield executeSearchResults.getTrees();
        return new SearchResponse_1.SearchResponse({
            id: executeSearch.id,
            query: executeSearch.metadata.query,
            initialSearchId: executeSearch.initialSearchId,
            result: new SearchResponseResult_1.SearchResponseResult({
                itemCount: executeSearchResults.totalHits,
                items: executeSearchResultItems,
                filters: executeSearchResultTrees,
            }),
        });
    }
    catch (error) {
        throw error;
    }
    /* eslint-enable no-useless-catch*/
});
exports.requestExecuteSearch = requestExecuteSearch;
const requestRefineSearch = (req, requestData) => __awaiter(void 0, void 0, void 0, function* () {
    /* eslint-disable no-useless-catch*/
    try {
        const { model, originalSearch } = requestData;
        const filterTrees = model.filtersToDisplay
            .filter(item => !item.isFilterField)
            .map(item => new osa_research_1.FilterTreeParams({
            filterTreeId: item.filterId,
            startFilterTreeNodeId: item.startFromNodeId,
            filterTreeLevels: item.expandedLevels,
        }));
        const filterFields = model.filtersToDisplay
            .filter(item => !!item.isFilterField)
            .map(item => new osa_research_1.FilterFieldParams({
            filterFieldId: item.filterId,
        }));
        const filterByTreeNodeIds = getFilterTreeNodeIdWithSearchIdList(model.dynamicSearchScope.searchInsideATSNodes, originalSearch);
        const filterOptions = new osa_research_1.SearchFilterParams({
            filterByTreeNodeIds,
        });
        const searchScope = new osa_research_1.SearchScopeParams({
            filterTreeNodeIds: model.fixedSearchScope.searchInsideATSNodes.map(item => item.filterNodeId),
            contentTreeNodeIds: model.fixedSearchScope.searchInsideCSHNodes,
            includeArchivePubs: false,
            includeModelDocuments: model.fixedSearchScope.includeModelDocuments,
            excludedContentTreeNodeIds: model.fixedSearchScope.excludeCSHNodes,
            subscriptionLevel: model.permission,
        });
        const runtimeOptions = new osa_research_1.SearchRuntimeParams({
            filterTrees,
            filterFields,
            saveToHistory: model.saveToHistory,
            extendedMetadataParams: new osa_research_1.ExtendedMetadataParams({
                extendedMetadataFields: model.requestMetadataKeys.length
                    ? model.requestMetadataKeys
                    : SearchModel_constants_1.DOCUMENT_EXTENDED_METADATA_FIELDS,
            }),
            sorting: [
                new osa_research_1.Sort({
                    order: model.sort.order,
                    direction: model.sort.direction,
                }),
            ],
        });
        const queryProcessingOptions = new osa_research_1.QueryProcessingParams({
            useThesaurusDictionary: true,
        });
        const refineSearchParams = new osa_research_1.RefineSearch({
            searchScope,
            runtimeOptions,
            queryProcessingOptions,
            filterOptions,
            query: model.query,
            originalSearch: new osa_research_1.SearchId(originalSearch),
        });
        const researchService = osaService.createDomainServiceInstance(osa_research_1.ResearchOsaService, 'Research', req);
        const refineSearch = yield researchService.refineSearch(refineSearchParams, {
            $expand: 'Result/Trees/Nodes/Children/Children, Result/Items',
            $top: model.pageSize,
            $skip: (model.currentPage - 1) * model.pageSize,
        });
        const refineSearchResults = yield refineSearch.getResult();
        const refineSearchResultItems = yield refineSearchResults.getItems();
        const refineSearchResultTrees = yield refineSearchResults.getTrees();
        return new SearchResponse_1.SearchResponse({
            id: refineSearch.id,
            query: refineSearch.metadata.query,
            initialSearchId: refineSearch.initialSearchId,
            result: new SearchResponseResult_1.SearchResponseResult({
                itemCount: Number(refineSearchResults.totalHits),
                items: refineSearchResultItems,
                filters: refineSearchResultTrees,
            }),
        });
    }
    catch (error) {
        throw error;
    }
    /* eslint-enable no-useless-catch*/
});
exports.requestRefineSearch = requestRefineSearch;
const getFilterTreeNodeIdWithSearchIdList = (filterList, searchId) => filterList.map(filter => `${searchId}!${filter.filterNodeId}`);
//# sourceMappingURL=SearchModelDAO.osa2.js.map
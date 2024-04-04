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
exports.getIdFromFilterNodeId = exports.prepareResultItems = exports.getSearchParamsFromFilterRefs = exports.excludeFilterNodeId = exports.getFilterPromisesByFiltersToDisplay = void 0;
const editorial_cards_dao_osa2_1 = require("@wk/acm-editorials/edge-services/src/editorial-cards/editorial-cards.dao.osa2");
const search_model_entities_1 = require("@wk/acm-search/shared/src/search-model/search-model-entities");
const ktmine_dao_1 = require("./ktmine.dao");
const ktmine_filters_data_1 = require("./ktmine.filters.data");
const ktmine_1 = require("../../../client-server/ktmine");
const DAO = ktmine_dao_1.getKtMineDAO();
const browseDAO = editorial_cards_dao_osa2_1.getEditorialCardsDAO();
const KTMINE_FILTERS = {
    ARM_FORMS_FILTER: 'arm-forms-filter',
    ARM_GROUPS_FILTER: 'arm-groups-filter',
    ARM_INDUSTRIES_FILTER: 'arm-industries-filter',
    ARM_INDUSTRY_SIC_FILTER: 'arm-industry_sic-filter',
    ARM_10K_GEO_STATES_FILTER: 'arm-10k-geo-states-filter',
    ARM_10K_GEO_STATES_OF_INC_FILTER: 'arm-10k-geo-states-of-inc-filter',
    ARM_10K_GEO_COUNTRY_FILTER: 'arm-10k-geo-country-filter',
    ARM_FILING_STATUS_FILTER: 'arm-filing_status-filter',
    ARM_DATE_RANGE_FILTER: 'arm-date_range-filter',
    ARM_10K_SECTIONS_FILTER: 'arm-10k-sections-filter',
    ARM_CDL_FORMS_FILTER: 'arm-cdl-forms-filter',
    ARM_CDL_SYNONYMS: 'arm-cdl-synonyms',
    ARM_ESG_SYNONYMS: 'arm-esg-synonyms',
};
const filterIdToFilterPromiseMap = {
    [KTMINE_FILTERS.ARM_FORMS_FILTER]: getArmFormFilter,
    [KTMINE_FILTERS.ARM_GROUPS_FILTER]: getGroupsFilter,
    [KTMINE_FILTERS.ARM_INDUSTRIES_FILTER]: getArmIndustriesFilter,
    [KTMINE_FILTERS.ARM_INDUSTRY_SIC_FILTER]: getArmIndustriesSICFilter,
    [KTMINE_FILTERS.ARM_10K_GEO_STATES_FILTER]: getArm10kGeoStatesFilter,
    [KTMINE_FILTERS.ARM_10K_GEO_STATES_OF_INC_FILTER]: getArm10kGeoStatesOfIncFilter,
    [KTMINE_FILTERS.ARM_10K_GEO_COUNTRY_FILTER]: getArm10kGeoCountryFilter,
    [KTMINE_FILTERS.ARM_FILING_STATUS_FILTER]: getArmFilingStatusFilter,
    [KTMINE_FILTERS.ARM_DATE_RANGE_FILTER]: getArmDateRangeFilter,
    [KTMINE_FILTERS.ARM_10K_SECTIONS_FILTER]: getArm10kSectionsFilter,
    [KTMINE_FILTERS.ARM_CDL_FORMS_FILTER]: getArmCDLFormsFilter,
    [KTMINE_FILTERS.ARM_CDL_SYNONYMS]: getArmSynonymsFilter,
    [KTMINE_FILTERS.ARM_ESG_SYNONYMS]: getArmSynonymsFilter,
};
function getFilterPromisesByFiltersToDisplay(filtersToDisplay, req) {
    return filtersToDisplay.reduce((acc, filter) => {
        if (!!filterIdToFilterPromiseMap[filter.filterId]) {
            acc.push(filterIdToFilterPromiseMap[filter.filterId](filter, req));
        }
        return acc;
    }, []);
}
exports.getFilterPromisesByFiltersToDisplay = getFilterPromisesByFiltersToDisplay;
// get filter methods
function getArmFormFilter(filterToDisplay) {
    return __awaiter(this, void 0, void 0, function* () {
        const filterId = KTMINE_FILTERS.ARM_FORMS_FILTER;
        const filterType = ktmine_1.KTMineFilterTypeEnum.FORM_TYPE;
        const filterData = yield DAO.getFormTypeFilters();
        const excludedFilters = (filterToDisplay === null || filterToDisplay === void 0 ? void 0 : filterToDisplay.excludeNodeIds) || [];
        const filterNodes = ktmine_filters_data_1.formsFilterSections.map(item => new search_model_entities_1.FilterNode(Object.assign({}, item)));
        let activeSectionIndex = 0;
        filterData.forEach(node => {
            const isExcludeNode = excludedFilters === null || excludedFilters === void 0 ? void 0 : excludedFilters.find(excludeNode => getIdFromFilterNodeId(excludeNode.filterNodeId) === node.formTypeName);
            if (!isExcludeNode) {
                const sectionIndex = ktmine_filters_data_1.formsFilterSections.findIndex(sectionNode => getIdFromFilterNodeId(sectionNode.filterNodeId) === node.formTypeName);
                if (sectionIndex !== -1) {
                    activeSectionIndex = sectionIndex;
                }
                else {
                    if (!filterNodes[activeSectionIndex].children) {
                        filterNodes[activeSectionIndex].children = [];
                    }
                    filterNodes[activeSectionIndex].children.push(new search_model_entities_1.FilterNode({
                        title: node.formTypeName,
                        totalHits: 1,
                        filterId,
                        filterNodeId: filterId + '!' + activeSectionIndex + '!' + node.secFormTypeId,
                        filterType,
                    }));
                }
            }
        });
        return new search_model_entities_1.Filter({
            filterId,
            filterNodes,
            filterType,
        });
    });
}
function getGroupsFilter(filterToDisplay) {
    return __awaiter(this, void 0, void 0, function* () {
        const filterId = KTMINE_FILTERS.ARM_GROUPS_FILTER;
        const filterType = ktmine_1.KTMineFilterTypeEnum.FORM_GROUP;
        const filterData = yield DAO.getFormGroupFilters();
        const excludedFilters = (filterToDisplay === null || filterToDisplay === void 0 ? void 0 : filterToDisplay.excludeNodeIds) || [];
        const filterNodes = filterData.reduce((res, node) => {
            const isExcludeNode = excludedFilters === null || excludedFilters === void 0 ? void 0 : excludedFilters.find(excludeNode => getIdFromFilterNodeId(excludeNode.filterNodeId) === node.secFormGroupId);
            !isExcludeNode &&
                res.push(new search_model_entities_1.FilterNode({
                    title: node.formGroupName,
                    totalHits: 1,
                    filterId,
                    filterNodeId: String(filterId + '!' + node.secFormGroupId),
                    filterType,
                }));
            return res;
        }, []);
        return new search_model_entities_1.Filter({
            filterId,
            filterNodes,
            filterType,
        });
    });
}
function getArmIndustriesFilter(filterToDisplay) {
    return __awaiter(this, void 0, void 0, function* () {
        const filterId = KTMINE_FILTERS.ARM_INDUSTRIES_FILTER;
        const filterType = ktmine_1.KTMineFilterTypeEnum.CORE_INDUSTRIES;
        const filterData = ktmine_filters_data_1.industrySearchFilters;
        const excludedFilters = (filterToDisplay === null || filterToDisplay === void 0 ? void 0 : filterToDisplay.excludeNodeIds) || [];
        const filterNodes = [];
        let activeSectionIndex;
        let activeSectionName;
        filterData.forEach(node => {
            const isExcludeNode = excludedFilters === null || excludedFilters === void 0 ? void 0 : excludedFilters.find(excludeNode => getIdFromFilterNodeId(excludeNode.filterNodeId) === node.code);
            if (!isExcludeNode) {
                if (activeSectionName === node.industry) {
                    filterNodes[activeSectionIndex].children.push(new search_model_entities_1.FilterNode({
                        title: node.label,
                        totalHits: 1,
                        filterId,
                        filterNodeId: filterId + '!' + activeSectionName + '!' + node.code,
                        filterType,
                    }));
                }
                else {
                    activeSectionIndex = activeSectionIndex !== undefined ? activeSectionIndex + 1 : 0;
                    activeSectionName = node.industry;
                    filterNodes.push(new search_model_entities_1.FilterNode({
                        title: node.industry,
                        totalHits: 1,
                        filterId,
                        filterNodeId: filterId + '!' + node.industry,
                        filterType,
                        children: [
                            new search_model_entities_1.FilterNode({
                                title: node.label,
                                totalHits: 1,
                                filterId,
                                filterNodeId: filterId + '!' + activeSectionName + '!' + node.code,
                                filterType,
                            }),
                        ],
                    }));
                }
            }
        });
        return new search_model_entities_1.Filter({
            filterId,
            filterNodes,
            filterType,
        });
    });
}
function getArmIndustriesSICFilter(filterToDisplay) {
    return __awaiter(this, void 0, void 0, function* () {
        const filterId = KTMINE_FILTERS.ARM_INDUSTRY_SIC_FILTER;
        const filterType = ktmine_1.KTMineFilterTypeEnum.SIC;
        const filterData = yield DAO.getSICFilters();
        const excludedFilters = (filterToDisplay === null || filterToDisplay === void 0 ? void 0 : filterToDisplay.excludeNodeIds) || [];
        const filterNodes = filterData.reduce((res, node) => {
            const isExcludeNode = excludedFilters === null || excludedFilters === void 0 ? void 0 : excludedFilters.find(excludeNode => getIdFromFilterNodeId(excludeNode.filterNodeId) === node.code);
            !isExcludeNode &&
                res.push(new search_model_entities_1.FilterNode({
                    title: `${node.name} (${node.code})`,
                    totalHits: 1,
                    filterId,
                    filterNodeId: filterId + '!' + node.code,
                    filterType,
                }));
            return res;
        }, []);
        return new search_model_entities_1.Filter({
            filterId,
            filterNodes,
            filterType,
        });
    });
}
function getArm10kGeoStatesFilter(filterToDisplay) {
    return __awaiter(this, void 0, void 0, function* () {
        const filterId = KTMINE_FILTERS.ARM_10K_GEO_STATES_FILTER;
        const filterType = ktmine_1.KTMineFilterTypeEnum.STATE;
        const filterData = ktmine_filters_data_1.stateSearchFilters;
        const excludedFilters = (filterToDisplay === null || filterToDisplay === void 0 ? void 0 : filterToDisplay.excludeNodeIds) || [];
        const filterNodes = filterData.reduce((res, node) => {
            const isExcludeNode = excludedFilters === null || excludedFilters === void 0 ? void 0 : excludedFilters.find(excludeNode => getIdFromFilterNodeId(excludeNode.filterNodeId) === node.title);
            !isExcludeNode &&
                res.push(new search_model_entities_1.FilterNode({
                    title: node.truncatedTitle,
                    tooltip: node.title,
                    totalHits: 1,
                    filterId,
                    filterNodeId: filterId + '!' + node.truncatedTitle,
                    filterType,
                }));
            return res;
        }, []);
        return new search_model_entities_1.Filter({
            filterId,
            filterNodes,
            filterType,
        });
    });
}
function getArm10kGeoStatesOfIncFilter(filterToDisplay) {
    return __awaiter(this, void 0, void 0, function* () {
        const filterId = KTMINE_FILTERS.ARM_10K_GEO_STATES_OF_INC_FILTER;
        const filterType = ktmine_1.KTMineFilterTypeEnum.INCORPORATION_STATE_CODES;
        const filterData = ktmine_filters_data_1.stateOfIncSearchFilters;
        const excludedFilters = (filterToDisplay === null || filterToDisplay === void 0 ? void 0 : filterToDisplay.excludeNodeIds) || [];
        const filterNodes = filterData.reduce((res, node) => {
            const isExcludeNode = excludedFilters === null || excludedFilters === void 0 ? void 0 : excludedFilters.find(excludeNode => getIdFromFilterNodeId(excludeNode.filterNodeId) === node.title);
            !isExcludeNode &&
                res.push(new search_model_entities_1.FilterNode({
                    title: node.truncatedTitle,
                    tooltip: node.title,
                    totalHits: 1,
                    filterId,
                    filterNodeId: filterId + '!' + node.truncatedTitle,
                    filterType,
                }));
            return res;
        }, []);
        return new search_model_entities_1.Filter({
            filterId,
            filterNodes,
            filterType,
        });
    });
}
function getArm10kGeoCountryFilter(filterToDisplay) {
    return __awaiter(this, void 0, void 0, function* () {
        const filterId = KTMINE_FILTERS.ARM_10K_GEO_COUNTRY_FILTER;
        const filterType = ktmine_1.KTMineFilterTypeEnum.COUNTRY;
        const filterData = ktmine_filters_data_1.countrySearchFilters;
        const excludedFilters = (filterToDisplay === null || filterToDisplay === void 0 ? void 0 : filterToDisplay.excludeNodeIds) || [];
        const filterNodes = filterData.reduce((res, node) => {
            const isExcludeNode = excludedFilters === null || excludedFilters === void 0 ? void 0 : excludedFilters.find(excludeNode => getIdFromFilterNodeId(excludeNode.filterNodeId) === node.title);
            !isExcludeNode &&
                res.push(new search_model_entities_1.FilterNode({
                    title: node.title,
                    tooltip: node.title,
                    totalHits: 1,
                    filterId,
                    filterNodeId: filterId + '!' + node.countryCode,
                    filterType,
                }));
            return res;
        }, []);
        return new search_model_entities_1.Filter({
            filterId,
            filterNodes,
            filterType,
        });
    });
}
function getArmFilingStatusFilter(filterToDisplay) {
    return __awaiter(this, void 0, void 0, function* () {
        const filterId = KTMINE_FILTERS.ARM_FILING_STATUS_FILTER;
        const filterType = ktmine_1.KTMineFilterTypeEnum.FILING_STATUS;
        const filterData = ktmine_filters_data_1.filingStatusSearchFilters;
        const excludedFilters = (filterToDisplay === null || filterToDisplay === void 0 ? void 0 : filterToDisplay.excludeNodeIds) || [];
        const filterNodes = excludeFilterNodeId(filterData, excludedFilters);
        return new search_model_entities_1.Filter({
            filterId,
            filterNodes,
            filterType,
        });
    });
}
function getArmDateRangeFilter(filterToDisplay) {
    return __awaiter(this, void 0, void 0, function* () {
        const filterId = KTMINE_FILTERS.ARM_DATE_RANGE_FILTER;
        const filterType = ktmine_1.KTMineFilterTypeEnum.DATE_RANGE;
        const filterData = ktmine_filters_data_1.dateRangeSearchFilters;
        const excludedFilters = (filterToDisplay === null || filterToDisplay === void 0 ? void 0 : filterToDisplay.excludeNodeIds) || [];
        const filterNodes = excludeFilterNodeId(filterData, excludedFilters);
        return new search_model_entities_1.Filter({
            filterId,
            filterNodes,
            filterType,
        });
    });
}
function getArm10kSectionsFilter(filterToDisplay) {
    return __awaiter(this, void 0, void 0, function* () {
        const filterId = KTMINE_FILTERS.ARM_10K_SECTIONS_FILTER;
        const filterType = ktmine_1.KTMineFilterTypeEnum.TENK_SECTION;
        const filterData = ktmine_filters_data_1.tenkSectionsFilters;
        const excludedFilters = (filterToDisplay === null || filterToDisplay === void 0 ? void 0 : filterToDisplay.excludeNodeIds) || [];
        const filterNodes = filterData.reduce((nodes, section) => {
            const sectionNode = new search_model_entities_1.FilterNode({
                title: section.title,
                totalHits: 1,
                filterId,
                filterNodeId: filterId + '!' + section.title,
                filterType,
                children: section.items.reduce((filters, node) => {
                    const isExcludeNode = excludedFilters === null || excludedFilters === void 0 ? void 0 : excludedFilters.find(excludeNode => getIdFromFilterNodeId(excludeNode.filterNodeId) === node.code);
                    !isExcludeNode &&
                        filters.push(new search_model_entities_1.FilterNode({
                            title: node.label,
                            totalHits: 1,
                            filterId,
                            filterNodeId: filterId + '!' + section.title + '!' + node.code,
                            filterType,
                        }));
                    return filters;
                }, []),
            });
            if (sectionNode.children.length) {
                nodes.push(sectionNode);
            }
            return nodes;
        }, []);
        return new search_model_entities_1.Filter({
            filterId,
            filterNodes,
            filterType,
        });
    });
}
function getArmCDLFormsFilter(filterToDisplay) {
    return __awaiter(this, void 0, void 0, function* () {
        const filterId = KTMINE_FILTERS.ARM_CDL_FORMS_FILTER;
        const filterType = ktmine_1.KTMineFilterTypeEnum.FORM_TYPE;
        const filterData = ktmine_filters_data_1.cdlFormSearchFilters;
        const excludedFilters = (filterToDisplay === null || filterToDisplay === void 0 ? void 0 : filterToDisplay.excludeNodeIds) || [];
        const filterNodes = excludeFilterNodeId(filterData, excludedFilters);
        return new search_model_entities_1.Filter({
            filterId,
            filterNodes,
            filterType,
        });
    });
}
function getArmSynonymsFilter(filterToDisplay, req) {
    return __awaiter(this, void 0, void 0, function* () {
        const filterId = filterToDisplay.filterId;
        const filterType = ktmine_1.KTMineFilterTypeEnum.SYNONYMS;
        const filterDataValue = yield browseDAO.getEditorialMetadata(req, filterId, filterId);
        const filterData = filterDataValue ? JSON.parse(filterDataValue) : {};
        const excludedFilters = (filterToDisplay === null || filterToDisplay === void 0 ? void 0 : filterToDisplay.excludeNodeIds) || [];
        const filterDataKeys = Object.keys(filterData);
        const filterNodes = filterDataKeys.map(key => new search_model_entities_1.FilterNode({
            title: key,
            totalHits: 1,
            filterId,
            filterNodeId: filterData[key].id,
            filterType,
            children: filterData[key].items.map(item => new search_model_entities_1.FilterNode({
                title: item.title,
                totalHits: 1,
                filterId,
                filterNodeId: item.id,
                filterType,
                children: [],
            })),
        }));
        const includeFilterNode = excludeFilterNodeId(filterNodes, excludedFilters);
        return new search_model_entities_1.Filter({ filterId, filterNodes: includeFilterNode, filterType });
    });
}
// utils
function excludeFilterNodeId(filterNodes, excludeFilters) {
    return filterNodes.filter(node => !excludeFilters.find(filterRef => filterRef.filterNodeId === node.filterNodeId));
}
exports.excludeFilterNodeId = excludeFilterNodeId;
function getSearchParamsFromFilterRefs(filterRefList) {
    const filtersByType = {};
    filterRefList.forEach(filterRef => {
        const id = getIdFromFilterNodeId(filterRef.filterNodeId);
        if (id !== 'default') {
            filtersByType[filterRef.filterType] = filtersByType[filterRef.filterType]
                ? `${filtersByType[filterRef.filterType]},${id}`
                : id;
        }
    });
    return filtersByType;
}
exports.getSearchParamsFromFilterRefs = getSearchParamsFromFilterRefs;
function prepareResultItems(items, requestMetadataKeys) {
    return items.map(item => ({
        title: item.form,
        documentId: item.id,
        metadata: requestMetadataKeys.map(key => ({ key, value: item[key] })),
    }));
}
exports.prepareResultItems = prepareResultItems;
function getIdFromFilterNodeId(filterNodeId) {
    return filterNodeId.split('!').pop();
}
exports.getIdFromFilterNodeId = getIdFromFilterNodeId;
//# sourceMappingURL=ktmine.filters.service.js.map
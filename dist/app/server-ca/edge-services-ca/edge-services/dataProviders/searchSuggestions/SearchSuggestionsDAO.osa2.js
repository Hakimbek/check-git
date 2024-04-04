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
exports.loadSmartChartsSuggestions = exports.loadSuggestions = exports.getPermissionsByModuleIds = exports.Search = exports.AutocompleteSearchMethod = void 0;
const { osaService } = require('@wk/acm-osa-service/edge-services');
const osa_1 = require("@wk/osa");
const osa_query_1 = require("@wk/osa-query");
const osa_research_1 = require("@wk/osa-research");
const osa_urm_1 = require("@wk/osa-urm");
const lodash_1 = require("lodash");
const osa_resource_1 = require("@wk/osa-resource");
const constants_1 = require("./constants");
const csnUtils_1 = require("../../../services/csnUtils");
const metadataService_1 = require("../../../services/metadataService");
var osa_query_2 = require("@wk/osa-query");
Object.defineProperty(exports, "AutocompleteSearchMethod", { enumerable: true, get: function () { return osa_query_2.AutocompleteSearchMethod; } });
var osa_research_2 = require("@wk/osa-research");
Object.defineProperty(exports, "Search", { enumerable: true, get: function () { return osa_research_2.Search; } });
const NodeCache = require('node-cache');
const SMART_CHARTS_MAPPING_CACHE_TTL = 57600;
const itemsCache = new NodeCache({ stdTTL: SMART_CHARTS_MAPPING_CACHE_TTL });
const QUICK_KEY_DOC_ID_REGEXP = /docid="([^"\s]+)"/;
const smartChartSearchOptions = {
    ignoreSpecialCharacters: true,
    specialCharactersToIgnore: [
        {
            value: '?',
            ignoreOnlyAtTheEnd: false,
        },
        {
            value: '*',
            ignoreOnlyAtTheEnd: false,
        },
    ],
    specialWordsToIgnore: [
        'or',
        'and',
        'not',
        'smartcharts',
        'smartchart',
        'smart charts',
        'smart chart',
        'charts',
        'chart',
        'smart',
    ],
};
const expandForTopicTree = 'Result/Trees/Nodes/Children/Children/Children/Children/Children/Children';
const smartChartsConceptDictionary = {
    jurisdictionsId: 'WKCA-TAA-AC-SC-Jurisdictions-URI',
    matchMethod: 'PartialMatch',
};
const smartchartsJurisdictionsATSTreeConfig = {
    filterTreeId: 'ca-smjuris-ats-filter',
    filterTreeLevels: 2,
};
const smartchartsYearsATSTreeConfig = {
    filterTreeId: 'wksortyear',
    filterTreeLevels: 2,
};
const exclamationPrefixRegexp = new RegExp('[\\w-]+!', 'g');
const smartchartsRootContentNodeId = 'csh-da-filter!smtch6de20d9d50fa473aac45c9b4b799';
const querySeparator = /[ ,\-&]+/;
function getPermissionsByModuleIds(req) {
    const urm = osaService.createDomainServiceInstance(osa_urm_1.UrmOsaService, 'Urm', req);
    return urm.rights.many();
}
exports.getPermissionsByModuleIds = getPermissionsByModuleIds;
function loadSuggestions(req, query, config, params) {
    const suggestConfig = {
        dictionaryIds: config.dictionaryIds,
        languages: config.languages,
        maxSuggestions: config.requestedSuggestions || config.maxSuggestions,
        searchMethod: config.searchMethod,
    };
    const requestParams = lodash_1.defaults({}, suggestConfig, { query }, params);
    return osaService
        .createDomainServiceInstance(osa_query_1.QueryOsaService, 'Query', req)
        .expand(requestParams, {})
        .then(suggestions => {
        var _a;
        if (config.dictionaryIds.includes(constants_1.configuratoin.dictionariesIds.qa) && ((_a = suggestions === null || suggestions === void 0 ? void 0 : suggestions.expansions) === null || _a === void 0 ? void 0 : _a.length)) {
            const permissions = suggestions.expansions.map(suggestion => suggestion.quickKey.match(QUICK_KEY_DOC_ID_REGEXP).pop());
            return getPermissionsForDocuments(req, permissions).then(permittedDocuments => {
                suggestions.expansions.forEach(suggestion => {
                    const documentId = suggestion.quickKey.match(QUICK_KEY_DOC_ID_REGEXP).pop();
                    const linkSection = suggestion.quickKey
                        .match(/<div class="subscription-block".+docid.+div>/gm)
                        .pop();
                    suggestion.quickKey = permittedDocuments.includes(documentId)
                        ? suggestion.quickKey
                            .replace('</span>', '</a>')
                            .replace(/<span docid=".+class="qa-link">/gm, `<a href='/resolve/document/${documentId}'>`)
                            .replace('subscription-block', 'qa-text')
                        : suggestion.quickKey.replace(linkSection, '');
                });
                return suggestions;
            });
        }
        if (config.dictionaryIds.includes(constants_1.configuratoin.dictionariesIds.browse) && (suggestions === null || suggestions === void 0 ? void 0 : suggestions.expansions)) {
            suggestions.expansions.forEach(suggestion => {
                suggestion.stateParams = { nodeId: encodeURIComponent(suggestion.refInfo.ref) };
                suggestion.label = suggestion.prefLabel || suggestion.label;
            });
            // The number of elements is requested with a reserve.
            // The elements with the same prefLabel and refInfo.ref are filtered and then the extra ones are removed.
            suggestions.expansions = suggestions.expansions
                .filter((value, index, self) => index ===
                self.findIndex(desiredValue => value.prefLabel === desiredValue.prefLabel &&
                    value.refInfo.ref === desiredValue.refInfo.ref))
                .slice(0, config.maxSuggestions);
        }
        return suggestions;
    });
}
exports.loadSuggestions = loadSuggestions;
function loadSmartChartsSuggestions(req, query) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const queryWoSpecialCharacters = removeSpecialCharactersFromQuery(query);
            let smartChartsMapping;
            let stateConcepts;
            if (itemsCache.has(req.forwardedSub)) {
                smartChartsMapping = itemsCache.get(req.forwardedSub);
                stateConcepts = yield findStateConceptsInQuery(req, queryWoSpecialCharacters);
            }
            else {
                [stateConcepts, smartChartsMapping] = yield Promise.all([
                    findStateConceptsInQuery(req, queryWoSpecialCharacters),
                    buildSmartChartsMapping(req),
                ]);
                itemsCache.set(req.forwardedSub, smartChartsMapping);
            }
            const osaSmartChartsSuggestions = yield getPrimarySmartChartTopics(req, queryWoSpecialCharacters, stateConcepts.matches, smartChartsMapping);
            return osaSmartChartsAdapter(osaSmartChartsSuggestions);
        }
        catch (err) {
            return osaSmartChartsAdapter([]);
        }
    });
}
exports.loadSmartChartsSuggestions = loadSmartChartsSuggestions;
function removeSpecialCharactersFromQuery(query) {
    let trimmedQuery = query.trim();
    smartChartSearchOptions.specialCharactersToIgnore.forEach(characterObj => {
        const value = characterObj.value
            ? characterObj.value.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1')
            : characterObj.value;
        trimmedQuery = characterObj.ignoreOnlyAtTheEnd
            ? trimmedQuery.replace(new RegExp(value + '$'), '')
            : trimmedQuery.replace(new RegExp(value, 'g'), '');
    });
    return trimmedQuery;
}
function findStateConceptsInQuery(req, query) {
    return __awaiter(this, void 0, void 0, function* () {
        if (query.trim()) {
            return osaService.createDomainServiceInstance(osa_query_1.QueryOsaService, 'Query', req).findConceptsInQuery(new osa_query_1.FindConceptsInQuery({
                query,
                dictionaryIds: [smartChartsConceptDictionary.jurisdictionsId],
                language: req.appLang,
                matchScope: osa_query_1.MatchMethod[smartChartsConceptDictionary.matchMethod],
            }));
        }
        return { matches: [] };
    });
}
const getPrimarySmartChartTopics = (req, query, jurisdictionsMatches, smartChartsMapping) => {
    const topicsTreeParamsWithYearEn = [];
    const topicsTreeParamsWithYearFr = [];
    const topicsTreeParamsWithoutYearEn = [];
    const topicsTreeParamsWithoutYearFr = [];
    const yearFilterTreeNodeIds = [];
    const queryWithoutYearsTerms = [];
    const researchDomain = osaService.createDomainServiceInstance(osa_research_1.ResearchOsaService, 'Research', req);
    smartChartsMapping.nodes.forEach(topicsTree => {
        const topicsTreeParams = new osa_research_1.FilterTreeParams({
            filterTreeId: topicsTree.filterTreeId,
            filterTreeLevels: 4,
        });
        topicsTree.hasYearFilter
            ? topicsTree.isEnglish
                ? topicsTreeParamsWithYearEn.push(topicsTreeParams)
                : topicsTreeParamsWithYearFr.push(topicsTreeParams)
            : topicsTree.isEnglish
                ? topicsTreeParamsWithoutYearEn.push(topicsTreeParams)
                : topicsTreeParamsWithoutYearFr.push(topicsTreeParams);
    });
    const matchedStates = [];
    jurisdictionsMatches.forEach(match => {
        smartChartsMapping.jurisdictions.forEach(jurisdiction => {
            if (jurisdiction.termURI === match.conceptURI) {
                matchedStates.push(jurisdiction);
            }
        });
    });
    query = removeWordsFromQuery(query, lodash_1.map(jurisdictionsMatches, 'matchedSubstring'));
    query.split(querySeparator).forEach(word => {
        const yearFilterTreeNodeId = smartChartsMapping.years.find(year => year.filterTreeNodeId.indexOf(word) !== -1);
        if (word.length === 4 && yearFilterTreeNodeId) {
            yearFilterTreeNodeIds.push(yearFilterTreeNodeId);
            return;
        }
        queryWithoutYearsTerms.push(word);
    });
    const queryWithoutYears = queryWithoutYearsTerms.join(' ');
    const searchParamsWithYearEn = new osa_research_1.ExecuteSearch({
        query: wrapQuery(queryWithoutYears || query),
        runtimeOptions: new osa_research_1.SearchRuntimeParams({
            filterTrees: topicsTreeParamsWithYearEn,
            saveToHistory: false,
        }),
        searchScope: new osa_research_1.SearchScopeParams({
            contentTreeNodeIds: [smartchartsRootContentNodeId],
            filterByFieldValueIds: lodash_1.map(yearFilterTreeNodeIds, 'filterTreeNodeId'),
            filterTreeNodeIds: lodash_1.map(matchedStates, 'filterTreeNodeId'),
        }),
        queryProcessingOptions: new osa_research_1.QueryProcessingParams({
            querySearchOperators: [
                new osa_research_1.QuerySearchOperator({
                    operatorKeyword: 'dt',
                    filterFieldId: 'title',
                }),
            ],
            useThesaurusDictionary: true,
        }),
    });
    const searchParamsWithoutYearEn = lodash_1.cloneDeep(searchParamsWithYearEn);
    searchParamsWithoutYearEn.runtimeOptions.filterTrees = topicsTreeParamsWithoutYearEn;
    searchParamsWithoutYearEn.searchScope.filterByFieldValueIds = [];
    searchParamsWithoutYearEn.query = wrapQuery(query);
    const searchParamsWithYearFr = createFrenchSearchParams(searchParamsWithYearEn, topicsTreeParamsWithYearFr);
    const searchParamsWithoutYearFr = createFrenchSearchParams(searchParamsWithoutYearEn, topicsTreeParamsWithoutYearFr);
    const oDataParamsEn = createODataParams('en');
    const oDataParamsFr = createODataParams('fr');
    const promises = [];
    // check that query have something except jurisdictions and years
    if (queryWithoutYears.replace(/ /g, '') && yearFilterTreeNodeIds.length) {
        promises.push(researchDomain.executeSearch(searchParamsWithYearEn, oDataParamsEn));
        promises.push(researchDomain.executeSearch(searchParamsWithYearFr, oDataParamsFr));
    }
    if (query.replace(/ /g, '')) {
        if (!yearFilterTreeNodeIds.length) {
            searchParamsWithoutYearEn.runtimeOptions.filterTrees =
                topicsTreeParamsWithoutYearEn.concat(topicsTreeParamsWithYearEn);
            searchParamsWithoutYearFr.runtimeOptions.filterTrees =
                topicsTreeParamsWithoutYearFr.concat(topicsTreeParamsWithYearFr);
        }
        promises.push(researchDomain.executeSearch(searchParamsWithoutYearEn, oDataParamsEn));
        promises.push(researchDomain.executeSearch(searchParamsWithoutYearFr, oDataParamsFr));
    }
    return Promise.all(promises).then(data => {
        const nestedTopicsStructure = [];
        const topics = [];
        const selectedYears = lodash_1.sortBy(yearFilterTreeNodeIds, 'title');
        data.forEach(search => {
            search.result.trees.forEach(tree => {
                if (tree.nodes.count) {
                    const smartChartsTopics = [];
                    tree.nodes[0].children.forEach(rootTopicCategory => {
                        buildNestedTopicsStructure(rootTopicCategory, smartChartsTopics);
                    });
                    nestedTopicsStructure.push({
                        smartChart: smartChartsMapping.nodes.find(node => node.filterTreeId === tree.filterTreeId),
                        nestedTopics: smartChartsTopics,
                    });
                }
            });
        });
        nestedTopicsStructure.forEach((topic, index) => {
            const smartChartsTopics = [];
            initSmartChartsTopicTitles(topic, smartChartsTopics);
            topics.push({
                smartChart: topic.smartChart,
                parentTopics: smartChartsTopics,
            });
            setSmartChartsSettings(topics[index], topics, selectedYears, matchedStates);
        });
        return topics;
    });
};
const wrapQuery = query => 'dt:(' +
    query
        .split(querySeparator)
        .filter(word => !!word)
        .join(') OR dt:(') +
    ')';
const createFrenchSearchParams = (searchParamsSource, frenchFilterTrees) => {
    const frenchSearchParams = lodash_1.cloneDeep(searchParamsSource);
    frenchSearchParams.runtimeOptions.filterTrees = frenchFilterTrees;
    frenchSearchParams.queryProcessingOptions.querySearchOperators[0].filterFieldId = 'title_fr';
    return frenchSearchParams;
};
const removeWordsFromQuery = (query, words) => {
    let clearedQuery = query;
    lodash_1.forEach(words, word => {
        clearedQuery = clearedQuery.replace(new RegExp('\\b' + word + '\\b', 'gi'), '');
    });
    return clearedQuery;
};
const buildNestedTopicsStructure = (currentTopic, topics) => {
    if (!currentTopic.children.count) {
        topics.push({
            parentTitle: currentTopic.title,
            parentId: currentTopic.filterTreeNodeId,
            nestedTopics: [],
        });
        return;
    }
    currentTopic.children.some(nestedTopic => {
        if (nestedTopic.children.count) {
            buildNestedTopicsStructure(nestedTopic, topics);
        }
        else {
            const nestedTopics = [];
            currentTopic.children.forEach(framedTopic => {
                nestedTopics.push({
                    title: framedTopic.title,
                    filterTreeNodeId: framedTopic.filterTreeNodeId,
                });
            });
            topics.push({
                nestedTopics,
                parentTitle: currentTopic.title,
            });
            return true;
        }
    });
};
const createODataParams = lang => new osa_1.common.ODataParams({
    $expand: expandForTopicTree,
    headers: {
        'clientinfo.locale': lang,
    },
});
const initSmartChartsTopicTitles = (topic, smartChartsTopics) => {
    if (!topic.nestedTopics.length) {
        smartChartsTopics.push(topic);
        return;
    }
    topic.nestedTopics.some(childTopic => {
        if (childTopic.nestedTopics) {
            initSmartChartsTopicTitles(childTopic, smartChartsTopics);
        }
        else {
            smartChartsTopics.push(topic);
            return true;
        }
    });
};
const setSmartChartsSettings = (resultTopics, smartChartsTopics, smartChartsSelectedYears, smartChartsJurisdictions) => {
    const selectedTopics = [];
    const selectedTopicNames = [];
    resultTopics.parentTopics.forEach(parentTopic => {
        if (!parentTopic.nestedTopics.length) {
            selectedTopics.push(beautifyUrlParams(parentTopic.parentId));
            selectedTopicNames.push(parentTopic.parentTitle);
        }
        parentTopic.nestedTopics.forEach(nestedTopic => {
            selectedTopics.push(beautifyUrlParams(nestedTopic.filterTreeNodeId));
            selectedTopicNames.push(nestedTopic.title);
        });
    });
    smartChartsTopics[smartChartsTopics.length - 1].settings = {
        stateParams: {
            type: resultTopics.smartChart.type,
            years: smartChartsSelectedYears.map(year => beautifyUrlParams(year.filterTreeNodeId)).toString() || 'all',
            topics: selectedTopics.toString(),
            provinces: smartChartsJurisdictions.map(state => beautifyUrlParams(state.filterTreeNodeId)).toString() || 'all',
            forcedShowPanel: true,
        },
    };
};
const beautifyUrlParams = parameter => parameter ? removeExclamationPrefix(parameter).replace('ATS_', '').replace('WKCA_JUR_ATS_', '') : parameter;
const removeExclamationPrefix = nodeId => nodeId.replace(exclamationPrefixRegexp, '');
const buildSmartChartsMapping = req => {
    const smartChartsMapping = {
        jurisdictions: [],
        years: [],
        nodes: [],
        isExist: true,
        hasAccess: false,
    };
    const promises = [
        osaService.createDomainServiceInstance(osa_resource_1.ResourceOsaService, 'Resource', req).getSubTree(new osa_resource_1.GetSubTree({
            startContentTreeNode: new osa_resource_1.ContentTreeNodeId(smartchartsRootContentNodeId),
            extendedMetadataFields: ['smartcharts'],
        }), { $expand: 'Children/Children' }),
        osaService.createDomainServiceInstance(osa_research_1.ResearchOsaService, 'Research', req).executeSearch(new osa_research_1.ExecuteSearch({
            query: '*',
            runtimeOptions: new osa_research_1.SearchRuntimeParams({
                filterTrees: [
                    new osa_research_1.FilterTreeParams(smartchartsJurisdictionsATSTreeConfig),
                    new osa_research_1.FilterTreeParams(smartchartsYearsATSTreeConfig),
                ],
                saveToHistory: false,
            }),
            searchScope: new osa_research_1.SearchScopeParams({
                contentTreeNodeIds: [smartchartsRootContentNodeId],
            }),
        }), new osa_1.common.ODataParams({
            $expand: 'Result/Trees/Nodes/Children/Children',
        })),
    ];
    return Promise.all(promises)
        .then(([nodes, cmFacets]) => {
        smartChartsMapping.hasAccess = true;
        nodes.children.forEach(node => {
            node.children.forEach(child => {
                const type = metadataService_1.MetadataService.extractMetadata(child, 'smartcharts', 'smartchartid');
                const filters = metadataService_1.MetadataService.extractMetadata(child, 'smartcharts', 'scdimensions');
                smartChartsMapping.nodes.push({
                    type,
                    contentTreeNodeId: child.id,
                    smartChartTitle: child.title,
                    filterTreeId: 'wkca-' + type + '-sctopics-ats-filter',
                    hasYearFilter: filters.indexOf('year') !== -1,
                    hasJurisdictionFilter: filters.indexOf('jurisdiction') !== -1,
                    filtersCount: (filters.match(/,/g) || []).length + 1,
                    isEnglish: type.substring(type.length - 2, type.length) !== 'fr',
                    multiTaxonomyFilterTreeId: metadataService_1.MetadataService.extractMetadata(child, 'smartcharts', 'multi-taxonomy-filter-id'),
                });
            });
        });
        cmFacets.result.trees.forEach(tree => {
            if (tree.id === smartchartsJurisdictionsATSTreeConfig.filterTreeId) {
                tree.nodes[0].children[0].children.forEach(jurisdiction => {
                    smartChartsMapping.jurisdictions.push({
                        filterTreeNodeId: csnUtils_1.CsnUtils.removeSearchIdPrefix(jurisdiction.filterTreeNodeId),
                        title: jurisdiction.title,
                        termURI: jurisdiction.termURI,
                    });
                });
                return;
            }
            tree.nodes[0].children.forEach(year => {
                smartChartsMapping.years.push({
                    filterTreeNodeId: csnUtils_1.CsnUtils.removeSearchIdPrefix(year.filterTreeNodeId),
                    title: year.title,
                });
            });
        });
        return smartChartsMapping;
    })
        .catch(() => smartChartsMapping);
};
const osaSmartChartsAdapter = osaSmartCharts => ({
    dictionaryId: 'smartCharts',
    suggestions: osaSmartCharts.map(osaSmartChart => ({
        dictionaryId: 'smartCharts',
        id: osaSmartChart.smartChart.contentTreeNodeId,
        label: osaSmartChart.smartChart.smartChartTitle,
        stateParams: osaSmartChart.settings.stateParams,
    })),
});
const getPermissionsForDocuments = (req, documentIds) => __awaiter(void 0, void 0, void 0, function* () {
    if (!documentIds || documentIds.length === 0) {
        return [];
    }
    const searchParams = new osa_research_1.ExecuteSearch({
        query: 'wn:' + documentIds.join(' OR wn:'),
        queryProcessingOptions: new osa_research_1.QueryProcessingParams({
            querySearchOperators: [
                new osa_research_1.QuerySearchOperator({
                    operatorKeyword: 'wn',
                    filterFieldId: 'wkdocid',
                }),
            ],
        }),
        runtimeOptions: new osa_research_1.SearchRuntimeParams({
            saveToHistory: false,
        }),
    });
    const oDataParams = new osa_1.common.ODataParams({
        $expand: 'Result/Items',
        $top: documentIds.length,
    });
    const researchService = osaService.createDomainServiceInstance(osa_research_1.ResearchOsaService, 'Research', req);
    const searchResult = yield (yield researchService.executeSearch(searchParams, oDataParams)).getResult();
    const permittedDocuments = yield searchResult.getItems();
    return permittedDocuments.map(item => item.documentId || item.id.split('!').pop());
});
//# sourceMappingURL=SearchSuggestionsDAO.osa2.js.map
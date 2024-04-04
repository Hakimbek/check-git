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
exports.getTopHitSmartCharts = void 0;
const cloneDeep_1 = __importDefault(require("lodash/cloneDeep"));
const flatten_1 = __importDefault(require("lodash/flatten"));
const intersection_1 = __importDefault(require("lodash/intersection"));
const intersectionBy_1 = __importDefault(require("lodash/intersectionBy"));
const sortBy_1 = __importDefault(require("lodash/sortBy"));
const union_1 = __importDefault(require("lodash/union"));
const SmartChartDAO = __importStar(require("./SmartCharts.dao.osa2"));
const QueryDAO = __importStar(require("../Query/Query.dao.osa2"));
const SmartCharts_constants_1 = require("./SmartCharts.constants");
const STATE_CODE_REGEXP = /-(...?)$/;
const SEARCH_ID_PREFIX_REGEXP = /^\d+!/;
const TOPIC_TOP_LEVEL_ID_REGEXP = /msall_ATS_\d*/;
const BRAND_TITLE_START_INDEX = 4;
function getTopHitSmartCharts(req, query, statesIds) {
    return __awaiter(this, void 0, void 0, function* () {
        return Promise.all([searchForStatesAndTopics(req, query, statesIds), getAllTopics(req)]).then(([{ states, statesFromQuery, topics }, allTopics]) => __awaiter(this, void 0, void 0, function* () {
            const brandedSmartCharts = yield getBrandedSmartCharts(req, topics, allTopics, statesFromQuery);
            const smartChartsId = getSmartChartId((states === null || states === void 0 ? void 0 : states.length) ? states : SmartCharts_constants_1.ALL_SMART_CHART_STATES, (topics === null || topics === void 0 ? void 0 : topics.length) ? topics : allTopics);
            return {
                jurisdictions: states,
                topics: getTopicsWithoutParentAndPath(topics),
                brandedSmartCharts: brandedSmartCharts,
                smartChartsId: (states === null || states === void 0 ? void 0 : states.length) || (topics === null || topics === void 0 ? void 0 : topics.length) || (brandedSmartCharts === null || brandedSmartCharts === void 0 ? void 0 : brandedSmartCharts.length) ? smartChartsId : null,
                isOnlyMultistateSmartCharts: isOnlyMultistateSmartCharts(brandedSmartCharts, topics),
            };
        }));
    });
}
exports.getTopHitSmartCharts = getTopHitSmartCharts;
function getAllTopics(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const topicTree = yield SmartChartDAO.getTopicTree(req);
        const allTopics = [];
        const extractTopicsFromTree = (topic) => {
            allTopics.push(topic);
            topic.children.forEach(childTopic => {
                allTopics.push(childTopic);
                extractTopicsFromTree(childTopic);
            });
        };
        extractTopicsFromTree(topicTree);
        return allTopics;
    });
}
function getSmartChartId(states, topics, brandName) {
    const preSelectedStates = states.map(state => state.code).sort();
    const preSelectedTopics = [];
    topics.sort().forEach(topic => {
        const topicShortId = getTopicShortId(topic.id);
        const preSelectedChildren = topic.children
            .map(({ id }) => `ATS_msall_ATS_${getTopicShortId(id)}`)
            .filter(id => !!id)
            .sort();
        topicShortId && preSelectedTopics.push(`ATS_msall_ATS_${topicShortId}`);
        preSelectedTopics.push(preSelectedChildren);
    });
    return `${JSON.stringify(preSelectedStates)}#${JSON.stringify(flatten_1.default(preSelectedTopics))}${brandName ? `#${brandName}` : ''}`;
}
function isOnlyMultistateSmartCharts(brandedSmartCharts, topics) {
    const multistateTopics = brandedSmartCharts.reduce((acc, brandedSmartChart) => union_1.default(acc, brandedSmartChart.topics), []);
    return multistateTopics.length > 0 && multistateTopics.length === topics.length;
}
function getTopicsWithoutParentAndPath(topics) {
    const topicsWithoutParents = cloneDeep_1.default(topics);
    const removeParentAndPath = (topic) => {
        topic.parent = null;
        topic.path = null;
        if (topic.children.length) {
            topic.children.forEach(removeParentAndPath);
        }
    };
    topicsWithoutParents.forEach(removeParentAndPath);
    return topicsWithoutParents;
}
function getBrandedSmartCharts(req, topics, allTopics, statesFromQuery) {
    return __awaiter(this, void 0, void 0, function* () {
        const brands = [];
        const availableBrandNames = yield getAvailableBrandNames(req);
        for (const brandName of availableBrandNames) {
            const selectedTopics = topics.filter(({ id }) => SmartCharts_constants_1.SMART_CHARTS_TYPES[brandName].topLevelTaxTypes.includes(id.match(TOPIC_TOP_LEVEL_ID_REGEXP)[0]));
            if (selectedTopics.length) {
                const brandTitle = SmartCharts_constants_1.SMART_CHARTS_TYPES[brandName].title
                    .substring(BRAND_TITLE_START_INDEX)
                    .replace(' SmartCharts', '');
                const statesToPreselect = statesFromQuery.length
                    ? SmartCharts_constants_1.ALL_SMART_CHART_STATES.filter(state => statesFromQuery.includes(state.code))
                    : SmartCharts_constants_1.ALL_SMART_CHART_STATES;
                const topicsToPreselect = selectedTopics.length ? selectedTopics : allTopics;
                brands.push({
                    name: brandName,
                    title: brandTitle,
                    topics: getTopicsWithoutParentAndPath(selectedTopics),
                    smartChartsId: getSmartChartId(statesToPreselect, topicsToPreselect, brandName),
                });
            }
        }
        return brands;
    });
}
function getTopicShortId(id) {
    return id.substring(id.lastIndexOf('_') + 1);
}
function getAvailableBrandNames(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const availableBrandNames = [];
        const availableTaxTypesIds = yield SmartChartDAO.getAvailableTaxTypesIds(req);
        Object.entries(SmartCharts_constants_1.SMART_CHARTS_TYPES).forEach(([type, config]) => {
            const intersectionLength = intersection_1.default(availableTaxTypesIds, config.topLevelTaxTypes).length;
            if (intersectionLength === config.topLevelTaxTypes.length) {
                availableBrandNames.push(type);
            }
        });
        return availableBrandNames;
    });
}
function searchForStatesAndTopics(req, query, statesIds) {
    return __awaiter(this, void 0, void 0, function* () {
        const matches = query
            ? (yield QueryDAO.findConceptsInQuery(req, query, [SmartCharts_constants_1.SMART_CHARTS_DICTIONARIES.statesId])).matches
            : [];
        let stateCodes = matches.map(({ conceptURI }) => extractStateCode(conceptURI));
        if (statesIds) {
            stateCodes = union_1.default(stateCodes, statesIds.map(extractStateCode));
        }
        if (matches === null || matches === void 0 ? void 0 : matches.length) {
            const matchedStatesFromQuery = matches.map(({ matchedSubstring }) => matchedSubstring);
            query = removeWordsFromQuery(query, matchedStatesFromQuery);
        }
        return Promise.all([
            getSmartChartsTopics(req, query, stateCodes),
            stateCodes.length ? yield getStatesByCodes(req, stateCodes) : Promise.resolve(null),
        ]).then(([smartChartsTopics, smartChartsJurisdictions]) => __awaiter(this, void 0, void 0, function* () {
            const states = smartChartsTopics.length && !(smartChartsJurisdictions === null || smartChartsJurisdictions === void 0 ? void 0 : smartChartsJurisdictions.length)
                ? yield getAvailableStates(req)
                : smartChartsJurisdictions;
            return {
                states,
                statesFromQuery: stateCodes,
                topics: smartChartsTopics,
            };
        }));
    });
}
function getSmartChartsTopics(req, query, stateCodes) {
    return __awaiter(this, void 0, void 0, function* () {
        return Promise.all([
            isQueryValidForSearch(query) ? SmartChartDAO.searchForTopic(req, query, stateCodes) : Promise.resolve(null),
            SmartChartDAO.getTopicTree(req),
        ]).then(([resultTreeNode, topicTree]) => {
            const smartChartsTopics = [];
            const traverseTrees = (resultTreeNode, topicTree) => {
                if (resultTreeNode.children.length) {
                    resultTreeNode.children.forEach(childrenNode => {
                        let relatedTreeNode;
                        topicTree.children.forEach(child => {
                            if (child.id === removeSearchIdPrefix(childrenNode.id)) {
                                relatedTreeNode = child;
                            }
                        });
                        if (relatedTreeNode) {
                            traverseTrees(childrenNode, relatedTreeNode);
                        }
                    });
                }
                else if (!intersectionBy_1.default(smartChartsTopics, topicTree.path, 'id').length && !!topicTree.parent) {
                    smartChartsTopics.push(topicTree);
                }
            };
            if (resultTreeNode) {
                traverseTrees(resultTreeNode, topicTree);
            }
            return smartChartsTopics;
        });
    });
}
function getStatesByCodes(req, stateCodes) {
    return __awaiter(this, void 0, void 0, function* () {
        stateCodes = Array.isArray(stateCodes) ? stateCodes : [stateCodes];
        stateCodes = stateCodes.map(code => SmartCharts_constants_1.SMART_CHARTS_STATE_MAPPING.code[code] || code);
        const statesByCodes = yield getAvailableStates(req);
        return statesByCodes.filter(state => stateCodes.includes(state.code));
    });
}
function getAvailableStates(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const idsToRemove = SmartCharts_constants_1.SMART_CHARTS_HIDDEN_STATE_IDS.map(id => SmartCharts_constants_1.JURISDICTIONS_ATS_TREE_CONFIG.filterTreeId + '!ATS_US-' + id);
        const [availableJurisdictions, internationalJurisdictions] = yield Promise.all([
            SmartChartDAO.getAvailableJurisdictions(req),
            SmartChartDAO.getInternationalJurisdictions(req),
        ]);
        const states = internationalJurisdictions
            .map((state) => ({
            id: removeSearchIdPrefix(state.id),
            code: extractStateCode(state.id),
            name: state.title,
        }))
            .filter(state => availableJurisdictions.includes(state.name) && !idsToRemove.includes(state.id));
        return sortBy_1.default(states, 'name');
    });
}
function extractStateCode(str) {
    const matches = str.match(STATE_CODE_REGEXP);
    return matches && matches.length > 1 && matches[1];
}
function removeSearchIdPrefix(str) {
    return str.replace(SEARCH_ID_PREFIX_REGEXP, '');
}
function removeWordsFromQuery(query, words) {
    let queryWithoutWords = query;
    words.forEach(word => {
        queryWithoutWords = queryWithoutWords.replace(new RegExp('\\b' + word + '\\b', 'gi'), '');
    });
    return queryWithoutWords;
}
function isQueryValidForSearch(query) {
    query = query && query.trim();
    return query && (!query.startsWith('*') || query === '*');
}
//# sourceMappingURL=SmartCharts.service.js.map
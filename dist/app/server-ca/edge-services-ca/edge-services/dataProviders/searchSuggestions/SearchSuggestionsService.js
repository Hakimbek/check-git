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
exports.Suggestions = exports.getSearchSuggestions = void 0;
const DAO = __importStar(require("./SearchSuggestionsDAO.osa2"));
const lodash_1 = require("lodash");
const externalDependencies_1 = require("../../externalDependencies");
const constants_1 = require("./constants");
const log_base_1 = require("@wk/log-base");
const SearchSuggestionsServiceError_1 = __importDefault(require("./SearchSuggestionsServiceError"));
const csnUtils_1 = require("../../../services/csnUtils");
const NodeCache = require('node-cache');
const SIXTEEN_HOURS = 57600;
const itemsCache = new NodeCache({ stdTTL: SIXTEEN_HOURS });
const SMARTCHARTS_WORD_WHEEL_ORDER = 2;
const permissionBasedDictionariesConfigs = [
    {
        id: constants_1.configuratoin.dictionariesIds.citation,
        label: 'suggestions.labels.citation',
        maxTerms: 5,
        language: 'en',
        searchMethod: 'Infix',
        termLimitForSearch: '1',
        csnWordWheelOrder: 1,
        isPermissioned: true,
    },
    {
        id: constants_1.configuratoin.dictionariesIds.qa,
        label: 'suggestions.labels.questions',
        maxTerms: 5,
        language: 'en',
        searchMethod: 'Infix',
        termLimitForSearch: '1',
        csnWordWheelOrder: 3,
    },
    {
        id: constants_1.configuratoin.dictionariesIds.browse,
        label: 'suggestions.labels.browse',
        maxTerms: 3,
        requestedSuggestions: 20,
        language: 'en',
        searchMethod: 'Infix',
        termLimitForSearch: '1',
        csnWordWheelOrder: 4,
        isPermissioned: true,
    },
    {
        id: constants_1.configuratoin.dictionariesIds.topic,
        label: 'suggestions.labels.topic',
        maxTerms: 5,
        language: 'en',
        searchMethod: 'Infix',
        termLimitForSearch: '1',
        csnWordWheelOrder: 5,
        isPermissioned: true,
    },
    {
        id: constants_1.configuratoin.dictionariesIds.wordwheel,
        label: 'suggestions.labels.allContent',
        maxTerms: 5,
        language: 'en',
        searchMethod: 'Prefix',
        termLimitForSearch: '1',
        csnWordWheelOrder: 6,
    },
];
var SuggestionType;
(function (SuggestionType) {
    SuggestionType["QnAStock"] = "QnA";
    SuggestionType["topic"] = "topic";
    SuggestionType["citation"] = "citation";
    SuggestionType["wordwheel"] = "wordwheel";
    SuggestionType["browse"] = "lawBrowse";
    SuggestionType["smartCharts"] = "smartCharts";
})(SuggestionType || (SuggestionType = {}));
function getSearchSuggestions(req, params) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = params.query || '';
        const userBossKey = req.forwardedSub;
        let gettingSearchSuggestionsOperationId;
        let gettingSearchSuggestionsOperationDuration;
        let permissions;
        // TODO: We can change log level to "Info" if the amount of requests will be reduced (see ACUSUI-1436)
        externalDependencies_1.logService.logRequest(log_base_1.LogLevel.Debug, req, {
            message: `Search suggestions have been requested for the following query: ${query}`,
            function: constants_1.FUNCTION_NAME_GET_SEARCH_SUGGESTIONS,
            correlationId: req.correlationId,
        });
        try {
            if (!query) {
                return [];
            }
            gettingSearchSuggestionsOperationId = externalDependencies_1.logService.durationTracking.start();
            if (!itemsCache.has(userBossKey)) {
                try {
                    permissions = yield Suggestions.getPermissionsForSuggestions(req);
                }
                catch (error) {
                    throw new SearchSuggestionsServiceError_1.default(constants_1.LOG_MESSAGE_GET_SEARCH_SUGGESTIONS_PERMISSIONS_REQUEST_FAIL, error);
                }
                itemsCache.set(userBossKey, permissions);
            }
            else {
                permissions = itemsCache.get(userBossKey);
            }
            const suggestionsConfigs = {
                dictionaries: Suggestions.getAllDictionaries(req.appLang),
            };
            const suggestionGroups = yield Suggestions.getSuggestionGroups(suggestionsConfigs, req, query, permissions);
            const transformedSuggestions = Suggestions.transformSuggestions(suggestionsConfigs, suggestionGroups, query);
            gettingSearchSuggestionsOperationDuration = externalDependencies_1.logService.durationTracking.end(gettingSearchSuggestionsOperationId);
            // TODO: We can change log level to "Info" if the amount of requests will be reduced (see ACUSUI-1436)
            externalDependencies_1.logService.logRequest(log_base_1.LogLevel.Debug, req, {
                message: `Search suggestions for a query "${query}" have been succesfully obtained`,
                function: constants_1.FUNCTION_NAME_GET_SEARCH_SUGGESTIONS,
                correlationId: req.correlationId,
                duration: gettingSearchSuggestionsOperationDuration,
            });
            return transformedSuggestions;
        }
        catch (error) {
            gettingSearchSuggestionsOperationDuration = externalDependencies_1.logService.durationTracking.end(gettingSearchSuggestionsOperationId);
            const isCustomError = error instanceof SearchSuggestionsServiceError_1.default;
            const errorMessage = isCustomError
                ? `${error.message} Search query: ${query}`
                : `Failed to get search suggestions for the following query: ${query}`;
            const errorData = isCustomError ? `${error.originalError} Search query: ${query}` : error;
            externalDependencies_1.logService.logRequest(log_base_1.LogLevel.Error, req, {
                message: errorMessage,
                function: constants_1.FUNCTION_NAME_GET_SEARCH_SUGGESTIONS,
                correlationId: req.correlationId,
                duration: gettingSearchSuggestionsOperationDuration,
            }, error);
            throw errorData;
        }
    });
}
exports.getSearchSuggestions = getSearchSuggestions;
class Suggestions {
    static getPermissionsForSuggestions(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const permissionsPromise = DAO.getPermissionsByModuleIds(req);
            const permittedModuleIds = yield permissionsPromise;
            return permittedModuleIds.map(permittedModule => permittedModule.id);
        });
    }
    static getSuggestionGroups(suggestionsConfigs, req, query, permissions) {
        const { suggestionPromises, dictionariesOrder } = Suggestions.getSuggestionsByDictionaries(req, query, suggestionsConfigs.dictionaries, permissions);
        const smartChartsSuggestionPromise = Suggestions.getSmartChartsSuggestions(req, query);
        return Promise.all([suggestionPromises, smartChartsSuggestionPromise]).then(([dictionariesSuggestions, smartChartsSuggestion]) => Suggestions.applySuggestionsOrder([...dictionariesSuggestions, smartChartsSuggestion], dictionariesOrder));
    }
    static transformSuggestions(suggestionsConfigs, suggestionSections, query) {
        const dictionaries = [
            ...suggestionsConfigs.dictionaries,
            {
                id: constants_1.configuratoin.dictionariesIds.smartCharts,
                label: 'suggestions.labels.smartCharts',
            },
        ];
        const combinedSuggestions = suggestionSections.filter(item => item.suggestions.length > 0);
        const SHRINK_CATEGORY_THRESHOLD = 1;
        const SHRINK_MAX_ITEMS_PER_CATEGORY = 5;
        const nonEmptyCategoryCount = combinedSuggestions.reduce((count, item) => (item.suggestions.length > 0 ? ++count : count), 0);
        return combinedSuggestions.map(section => {
            var _a;
            if (nonEmptyCategoryCount >= SHRINK_CATEGORY_THRESHOLD) {
                section.suggestions = section.suggestions.slice(0, SHRINK_MAX_ITEMS_PER_CATEGORY);
            }
            (_a = section.suggestions) === null || _a === void 0 ? void 0 : _a.forEach(suggestion => {
                suggestion.url = Suggestions.getSuggestionItemUrl(suggestion);
                suggestion.formattedLabel = Suggestions.getFormattedSuggestionLabel(query, suggestion.label, dictionaries);
                suggestion.type = Suggestions.getSuggestionType(suggestion);
            });
            return {
                suggestions: section.suggestions,
                title: Suggestions.getDictionaryLabelById(section.dictionaryId, dictionaries),
                area: Suggestions.getSuggestionSectionArea(section.dictionaryId, dictionaries),
            };
        });
    }
    static getDictionaryLabelById(id, dictionaries) {
        const dictionary = dictionaries.find(item => item.id === id);
        return (dictionary === null || dictionary === void 0 ? void 0 : dictionary.label) || '';
    }
    static getSuggestionSectionArea(id, dictionaries) {
        const dictionary = dictionaries.find(item => item.id === id);
        let area;
        switch (id) {
            case constants_1.configuratoin.dictionariesIds.citation:
                area = 'citationLookup';
                break;
            case constants_1.configuratoin.dictionariesIds.wordwheel:
                area = 'searchInAllContent';
                break;
            case constants_1.configuratoin.dictionariesIds.qa:
                area = 'questionsAndAnswers';
                break;
            case constants_1.configuratoin.dictionariesIds.topic:
                area = 'topics';
                break;
            case constants_1.configuratoin.dictionariesIds.browse:
                area = 'browse';
                break;
            case constants_1.configuratoin.dictionariesIds.smartCharts:
                area = 'smartCharts';
                break;
            default:
                area = '';
        }
        return (dictionary === null || dictionary === void 0 ? void 0 : dictionary['area']) || area;
    }
    static getSuggestionType(suggestion) {
        switch (suggestion.dictionaryId) {
            case constants_1.configuratoin.dictionariesIds.citation:
                return SuggestionType.citation;
            case constants_1.configuratoin.dictionariesIds.wordwheel:
                return SuggestionType.wordwheel;
            case constants_1.configuratoin.dictionariesIds.qa:
                return SuggestionType.QnAStock;
            case constants_1.configuratoin.dictionariesIds.topic:
                return SuggestionType.topic;
            case constants_1.configuratoin.dictionariesIds.browse:
                return SuggestionType.browse;
            case constants_1.configuratoin.dictionariesIds.smartCharts:
                return SuggestionType.smartCharts;
            default:
                return null;
        }
    }
    static getAllDictionaries(lang) {
        return lodash_1.chain(permissionBasedDictionariesConfigs)
            .map(dictionary => {
            if (dictionary.id === constants_1.configuratoin.dictionariesIds.qa && lang) {
                dictionary.language = lang;
            }
            return dictionary;
        })
            .flatten()
            .sortBy('csnWordWheelOrder')
            .value();
    }
    static applySuggestionsOrder(suggestions, dictionariesOrder) {
        const flattenSuggestions = lodash_1.flatten(suggestions);
        return flattenSuggestions.sort((suggestion1, suggestion2) => dictionariesOrder[suggestion1.dictionaryId] - dictionariesOrder[suggestion2.dictionaryId]);
    }
    static getSuggestionsByDictionaries(req, query, dictionaries, permissions) {
        const queries = [];
        const { combinedQueries, dictionariesOrder } = Suggestions.combineDictionaryQueries(dictionaries, query);
        combinedQueries.forEach(combinedQuery => {
            queries.push(Suggestions.getDictionarySuggestions(req, combinedQuery, query, permissions));
        });
        return {
            dictionariesOrder,
            suggestionPromises: Promise.all(queries),
        };
    }
    static combineDictionaryQueries(dictionaries, query) {
        const combinedQueries = [];
        const dictionariesOrder = {};
        dictionariesOrder[constants_1.configuratoin.dictionariesIds.smartCharts] = SMARTCHARTS_WORD_WHEEL_ORDER;
        dictionaries.forEach(dictionary => {
            dictionariesOrder[dictionary.id] = dictionary.csnWordWheelOrder;
            dictionary.termLimitForSearch = dictionary.termLimitForSearch || '1';
            if (query.length >= parseInt(dictionary.termLimitForSearch, 10)) {
                combinedQueries.push({
                    languages: [dictionary.language],
                    maxSuggestions: dictionary.maxTerms,
                    requestedSuggestions: dictionary.requestedSuggestions,
                    searchMethod: Suggestions.convertToEnum(dictionary.searchMethod, DAO.AutocompleteSearchMethod),
                    dictionaryIds: [dictionary.id],
                    isPermissioned: dictionary.isPermissioned,
                });
            }
        });
        return {
            combinedQueries,
            dictionariesOrder,
        };
    }
    static convertToEnum(value, _enum) {
        if (lodash_1.isString(value)) {
            return _enum[value];
        }
        return value;
    }
    static getDictionarySuggestions(req, combinedQuery, query, permissions) {
        const config = {};
        if (combinedQuery.maxSuggestions) {
            // default - 10
            config.maxSuggestions = combinedQuery.maxSuggestions;
        }
        if (combinedQuery.requestedSuggestions) {
            config.requestedSuggestions = combinedQuery.requestedSuggestions;
        }
        if (combinedQuery.isPermissioned) {
            config.permissionFilterIds = permissions;
        }
        return DAO.loadSuggestions(req, query, combinedQuery, config)
            .then(suggestions => Suggestions.parseSuggestions(suggestions, combinedQuery.dictionaryIds))
            .catch(error => {
            const dictionaryIds = combinedQuery.dictionaryIds.join(', ');
            externalDependencies_1.logService.logRequest(log_base_1.LogLevel.Error, req, {
                message: `Failed to get autocomplete suggestions for a query "${query}" from the following dictionaries: ${dictionaryIds}`,
                function: constants_1.FUNCTION_NAME_GET_DICTIONARY_SUGGESTIONS,
                correlationId: req.correlationId,
            }, error);
            return Suggestions.parseSuggestions({ expansions: [] }, combinedQuery.dictionaryIds);
        });
    }
    static getSmartChartsSuggestions(req, query) {
        return DAO.loadSmartChartsSuggestions(req, query);
    }
    static parseSuggestions(suggestions, dictionaryIds) {
        const results = [];
        dictionaryIds.forEach(dictionaryId => {
            results.push({
                dictionaryId,
                suggestions: lodash_1.filter(suggestions.expansions, suggestion => suggestion.dictionaryId === dictionaryId),
            });
        });
        return results;
    }
    static getSuggestionItemUrl(item) {
        var _a;
        switch (item.dictionaryId) {
            case constants_1.configuratoin.dictionariesIds.smartCharts:
                return `/smartcharts?type=${item.stateParams.type}&years=${item.stateParams.years}&topics=${item.stateParams.topics}&provinces=${item.stateParams.provinces}`;
            case constants_1.configuratoin.dictionariesIds.wordwheel:
            case constants_1.configuratoin.dictionariesIds.qa:
                return `/results/search/all?query=${item.label}`;
            case constants_1.configuratoin.dictionariesIds.browse:
                return `/resolve/resolveByBrowsePatternReact?nodeId=${item.stateParams.nodeId}`;
            default:
                return `/resolve/document/${(_a = item.refInfo) === null || _a === void 0 ? void 0 : _a['ref']}`;
        }
    }
    static getFormattedSuggestionLabel(query, suggestionLabel, dictionaries) {
        let label = suggestionLabel.toString();
        const dictionariesHashCollection = {};
        dictionaries.forEach(dictionary => {
            dictionariesHashCollection[dictionary.id] = {
                searchMethod: dictionary.searchMethod,
            };
        });
        function escapeRegex(str) {
            return str ? str.replace(/[\\{}()[\]^$+*?\-.,]/g, '\\$&') : str;
        }
        function wrapText(prefix, postfix) {
            return (text) => prefix + text + postfix;
        }
        function normalize(word) {
            return csnUtils_1.CsnUtils.removeDiacritics(word).replace(/[\u0300-\u036f]/g, '');
        }
        const queryWords = [];
        const wrapSearchTerm = wrapText('<span class="search-term">', '</span>');
        const escapeRegExpMethod = escapeRegex;
        const queryMatchRegExp = /(?:^|\s)([\wÀ-ÿ])(?=\s|$)|([\wÀ-ÿ.]+[:.,\u2014-]?)|([$]\d[,])|[^\s\wÀ-ÿ]/g; // \u8212 Em Dash;
        const labelMatchRegExp = /(?:^|\s)([\wÀ-ÿ])(?=\s|$)|([\wÀ-ÿ.]+[:.,\u2014-]?)|([$,])|(&[\wÀ-ÿ]+;)|[^\wÀ-ÿ]/g;
        query.match(queryMatchRegExp).forEach(word => {
            const normalizeWord = normalize(word);
            if (normalizeWord !== word) {
                queryWords.push(normalizeWord);
            }
            queryWords.push(word);
        });
        if (queryWords.length) {
            let labelWords = label.match(labelMatchRegExp);
            const highlightingWords = [];
            queryWords.forEach(word => {
                const wordReplaceRegExp = new RegExp('(?:^|\\b)' + escapeRegExpMethod(word.trim()), 'i');
                for (let i = 0; i < labelWords.length; i++) {
                    const normalizeLabelWord = normalize(labelWords[i]);
                    if (normalizeLabelWord !== labelWords[i] && highlightingWords.indexOf(i) === -1) {
                        const highlightedText = normalizeLabelWord.match(wordReplaceRegExp);
                        if (highlightedText) {
                            const highlightedTextLength = highlightedText[0].length;
                            highlightingWords.push(i);
                            labelWords[i] =
                                wrapSearchTerm(labelWords[i].substring(0, highlightedTextLength)) +
                                    labelWords[i].substring(highlightedTextLength);
                        }
                    }
                    else {
                        labelWords[i] = labelWords[i].replace(wordReplaceRegExp, foundText => {
                            if (highlightingWords.indexOf(i) === -1) {
                                highlightingWords.push(i);
                                return wrapSearchTerm(foundText);
                            }
                            return foundText;
                        });
                        const searchTerms = [];
                        const labels = [];
                        labelWords.forEach(tmpWord => {
                            if (tmpWord.includes('search-term')) {
                                searchTerms.push(tmpWord);
                            }
                        });
                        const duplicatedSearchTerms = searchTerms.filter((term, index, tmpSearchTerms) => tmpSearchTerms.indexOf(term) < index);
                        labelWords = labelWords.map(tmpWord => {
                            if (duplicatedSearchTerms.includes(tmpWord) &&
                                tmpWord.match(/[()]/g) &&
                                labels.includes(tmpWord)) {
                                const replacedValue = tmpWord.replace(/<\/?[^>]+(>|$)/g, '');
                                labels.push(replacedValue);
                                return replacedValue;
                            }
                            labels.push(tmpWord);
                            return tmpWord;
                        });
                    }
                }
            });
            label = labelWords.join('');
        }
        return label;
    }
}
exports.Suggestions = Suggestions;
//# sourceMappingURL=SearchSuggestionsService.js.map
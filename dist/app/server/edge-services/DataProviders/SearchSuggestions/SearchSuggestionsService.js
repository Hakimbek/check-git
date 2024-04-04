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
exports.Suggestions = exports.getSearchSuggestions = exports.SEARCH_SUGGESTION_SERVICE_ID = void 0;
const jwt_decode_1 = __importDefault(require("jwt-decode"));
const lodash_1 = require("lodash");
const log_base_1 = require("@wk/log-base");
const constants_1 = require("./constants");
const DAO = __importStar(require("./SearchSuggestionsDAO.osa2"));
const externalDependencies_1 = require("../../externalDependencies");
const redisCacheService_1 = __importDefault(require("../../services/cacheService/redisCacheService"));
const beyond_service_1 = require("../beyond/beyond.service");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cheerio = require('cheerio').default;
const fedStateTopicsMappedModuleIds = externalDependencies_1.vars.get('fedStateTopics');
const fedStateTopicsModuleIds = Object.values(fedStateTopicsMappedModuleIds);
const federalTaxModuleId = 'WKUS_TAL_11715';
const explanationModuleId = 'WKUS_TAL_11713';
const MODULE_ID__PREMIUM_QA_DICTIONARY = 'WKUS_TAL_19126';
const intTopicsModuleId = externalDependencies_1.vars.get('intTopicsDA');
const armDictionariesConfigs = externalDependencies_1.vars.get('armDictionaries');
const qaDictionaryConfig = externalDependencies_1.vars.get('qaDictionary');
const qaDictionaryBeyondConfig = externalDependencies_1.vars.get('qaDictionaryBeyond');
const qaDictionaryPremiumConfig = externalDependencies_1.vars.get('qaDictionaryPremium');
const topicDictionaryConfig = externalDependencies_1.vars.get('topicDictionary');
const permissionBasedDictionariesConfigs = externalDependencies_1.vars.get('dictionaries');
const titleSearchDictionaryId = externalDependencies_1.vars.get('titleSearchDictionaryId');
const INT_TREE_KEY = 'international';
exports.SEARCH_SUGGESTION_SERVICE_ID = 'ss_claims';
var SUGGESTION_SECTION_AREA;
(function (SUGGESTION_SECTION_AREA) {
    SUGGESTION_SECTION_AREA["CITATION_LOOKUP"] = "citationLookup";
    SUGGESTION_SECTION_AREA["SEARCH_IN_ALL_CONTENT"] = "searchInAllContent";
    SUGGESTION_SECTION_AREA["QUESTIONS_AND_ANSWERS"] = "questionsAndAnswers";
    SUGGESTION_SECTION_AREA["TOPICS"] = "topics";
    SUGGESTION_SECTION_AREA["QA_BEYOND"] = "qaDictionaryBeyondArea";
})(SUGGESTION_SECTION_AREA || (SUGGESTION_SECTION_AREA = {}));
var DictionaryConfigSourceEnum;
(function (DictionaryConfigSourceEnum) {
    DictionaryConfigSourceEnum["EXTERNAL"] = "external";
})(DictionaryConfigSourceEnum || (DictionaryConfigSourceEnum = {}));
class SearchSuggestionsServiceError extends Error {
    constructor(message, originalError) {
        super(message);
        this.originalError = null;
        this.originalError = originalError;
    }
}
var SuggestionType;
(function (SuggestionType) {
    SuggestionType["QnAPremium"] = "QnAPremium";
    SuggestionType["QnAStock"] = "QnAStock";
    SuggestionType["QnABeyond"] = "QnABeyond";
    SuggestionType["topic"] = "topic";
    SuggestionType["citation"] = "citation";
    SuggestionType["wordwheel"] = "wordwheel";
    SuggestionType["fasbTopics"] = "fasbTopics";
    SuggestionType["armTopics"] = "armTopics";
    SuggestionType["armWordWheel"] = "armWordWheel";
})(SuggestionType || (SuggestionType = {}));
const beyondService = beyond_service_1.getBeyondService();
const EXTERNAL_DICTIONARY_ID_TO_SUGGESTIONS_REQUEST_MAP = {
    [qaDictionaryBeyondConfig.id]: beyondService.retrieveSuggestions,
};
function getSearchSuggestions(req, params) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const query = ((_a = params.query) === null || _a === void 0 ? void 0 : _a.trim()) || '';
        const contentType = params.contentType || 'all';
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
            try {
                const { sid } = jwt_decode_1.default(req.forwardedSession);
                permissions = (yield redisCacheService_1.default.getItem({
                    serviceId: exports.SEARCH_SUGGESTION_SERVICE_ID,
                    userBossKey,
                    sessionId: sid,
                }));
            }
            catch (connectionError) {
                externalDependencies_1.logService.logRequest(log_base_1.LogLevel.Error, req, {
                    message: constants_1.LOG_MESSAGE_GET_PERMISSIONS_FOR_SUGGESTIONS_FROM_CACHE_FAIL,
                    function: constants_1.FUNCTION_NAME_GET_SEARCH_SUGGESTIONS,
                    correlationId: req.correlationId,
                }, connectionError);
            }
            if (!permissions) {
                const permissionsConfigs = Suggestions.getPermissionsConfig();
                try {
                    permissions = yield Suggestions.getPermissionsForSuggestions(req, permissionsConfigs.moduleIds);
                }
                catch (error) {
                    throw new SearchSuggestionsServiceError(constants_1.LOG_MESSAGE_GET_SEARCH_SUGGESTIONS_PERMISSIONS_REQUEST_FAIL, error);
                }
                try {
                    const { sid } = jwt_decode_1.default(req.forwardedSession);
                    redisCacheService_1.default.setItem({
                        serviceId: exports.SEARCH_SUGGESTION_SERVICE_ID,
                        userBossKey,
                        sessionId: sid,
                        cacheItemValue: permissions,
                    });
                }
                catch (redisError) {
                    externalDependencies_1.logService.logRequest(log_base_1.LogLevel.Error, req, {
                        message: constants_1.LOG_MESSAGE_SAVE_PERMISSIONS_FOR_SUGGESTIONS_TO_CACHE_FAIL,
                        function: constants_1.FUNCTION_NAME_GET_SEARCH_SUGGESTIONS,
                        correlationId: req.correlationId,
                    }, redisError);
                }
            }
            const internationalSearchSuggestions = new InternationalSearchSuggestions(req);
            internationalSearchSuggestions.init(req);
            const suggestionsConfigs = Suggestions.getSuggestionsConfigs(permissions, req, contentType);
            const suggestionGroups = yield Suggestions.getSuggestionGroups(suggestionsConfigs, permissions, req, query, internationalSearchSuggestions);
            const transformedSuggestions = Suggestions.transformSuggestions(suggestionsConfigs, permissions, suggestionGroups, query);
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
            const isCustomError = error instanceof SearchSuggestionsServiceError;
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
    static getPermissionsConfig() {
        const moduleIdsToCheck = [
            ...fedStateTopicsModuleIds,
            federalTaxModuleId,
            explanationModuleId,
            MODULE_ID__PREMIUM_QA_DICTIONARY,
        ];
        return {
            moduleIds: moduleIdsToCheck,
        };
    }
    static getPermissionsForSuggestions(req, moduleIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const permissionsPromise = DAO.getPermissionsByModuleIds(req, moduleIds);
            const searchResultsIntTopicsPromise = getIntTopics(req);
            const [permittedModuleIds, internationalPermissions] = yield Promise.all([
                permissionsPromise,
                searchResultsIntTopicsPromise,
            ]);
            return {
                moduleIds: permittedModuleIds.authorizedModuleIds.map(permittedModule => permittedModule.id),
                internationalPermissions,
            };
        });
    }
    static getSuggestionsConfigs(permissions, req, dictionariesGroup) {
        let dictionaries;
        if (constants_1.ARM_CONTENT_TYPES.includes(dictionariesGroup)) {
            dictionaries = Suggestions.getARMDictionaries();
        }
        else {
            dictionaries = Suggestions.getAllDictionaries(permissions.moduleIds, req['isFreemium'], permissions.internationalPermissions);
        }
        return {
            dictionaries,
        };
    }
    static getSuggestionGroups(suggestionsConfigs, permissions, req, query, internationalSearchSuggestions) {
        const searchResultsIntTopics = permissions.internationalPermissions;
        const { suggestionPromises, dictionariesOrder } = Suggestions.getSuggestionsByDictionaries(req, query, suggestionsConfigs.dictionaries);
        const promises = [
            suggestionPromises,
            internationalSearchSuggestions.getSuggestions(query),
        ];
        return Promise.all(promises).then(([suggestions, internationalSuggestions]) => {
            const orderedSuggestions = Suggestions.applySuggestionsOrder(suggestions, dictionariesOrder);
            // if International Topics are available
            if (searchResultsIntTopics.length > 0) {
                const dictionaryId = topicDictionaryConfig.id;
                const topicSection = lodash_1.find(orderedSuggestions, { dictionaryId });
                const topicSuggestions = lodash_1.clone(internationalSuggestions).map(topic => {
                    topic.label += ' (International)';
                    return topic;
                });
                if (topicSection) {
                    topicSection.suggestions = topicSection.suggestions.concat(topicSuggestions);
                }
            }
            return orderedSuggestions;
        });
    }
    static transformSuggestions(suggestionsConfigs, permissions, suggestionSections, query) {
        const dictionaries = suggestionsConfigs.dictionaries;
        const permittedModuleIds = permissions.moduleIds;
        const combinedSuggestions = Suggestions.combineSuggestions(suggestionSections.filter(item => item.suggestions.length > 0));
        const SHRINK_CATEGORY_THRESHOLD = 2;
        const SHRINK_MAX_ITEMS_PER_CATEGORY = 5;
        const nonEmptyCategoryCount = combinedSuggestions.reduce((count, item) => (item.suggestions.length > 0 ? ++count : count), 0);
        function getQnAClassName(csnPermissions, topicPermissions) {
            if (csnPermissions.gold) {
                return topicPermissions.gold ? 'gold-ac' : 'gold-cc';
            }
            if (csnPermissions.silver) {
                return topicPermissions.silver || topicPermissions.gold ? 'silver-ac' : 'silver-cc';
            }
            // Q&A Suggestions cannot be applied, this case would remove all the links in Q&A
            return void 0;
        }
        const groupedSuggestions = combinedSuggestions.map(section => {
            var _a;
            if (nonEmptyCategoryCount >= SHRINK_CATEGORY_THRESHOLD) {
                section.suggestions = section.suggestions.slice(0, SHRINK_MAX_ITEMS_PER_CATEGORY);
            }
            (_a = section.suggestions) === null || _a === void 0 ? void 0 : _a.forEach(suggestion => {
                suggestion.url = Suggestions.getSuggestionItemUrl(suggestion);
                suggestion.formattedLabel = Suggestions.getFormattedSuggestionLabel(query, suggestion, dictionaries);
                // @TODO add freemium permissioning here:
                suggestion.isQuickKeyVisible =
                    suggestion.dictionaryId === 'WKUS-TAL-AC-QandA-AutoSuggest-Enhanced' ||
                        suggestion.dictionaryId === 'WKUS-TAL-AC-TAXBOOK-QA';
                suggestion.type = Suggestions.getSuggestionType(suggestion);
                suggestion.hasExternalNavigation =
                    !!suggestion.url || constants_1.EXTERNAL_SUGGESTIONS_TYPES.includes(suggestion.type);
                suggestion.hasInternalNavigation =
                    constants_1.INTERNAL_SUGGESTIONS_TYPES.includes(suggestion.type) && !!(suggestion === null || suggestion === void 0 ? void 0 : suggestion.refInfo);
                if (suggestion.quickKey) {
                    // check permissions and filter quick key message according to permissions
                    const goldFedTopicsPermissions = permittedModuleIds.some(permittedModuleId => permittedModuleId === fedStateTopicsMappedModuleIds.goldFedTopicsDABasedPub ||
                        permittedModuleId === fedStateTopicsMappedModuleIds.goldFedTopicsDESBasedPub);
                    const silverFedTopicsPermissions = permittedModuleIds.some(permittedModuleId => permittedModuleId === fedStateTopicsMappedModuleIds.silverFedTopicsDABasedPub ||
                        permittedModuleId === fedStateTopicsMappedModuleIds.silverFedTopicsDESBasedPub);
                    const isFederalTaxPermitted = permittedModuleIds.some(permittedModuleId => permittedModuleId === federalTaxModuleId);
                    const isExplanationsPermitted = permittedModuleIds.some(permittedModuleId => permittedModuleId === explanationModuleId);
                    const topicPermissions = {
                        silver: silverFedTopicsPermissions ||
                            permittedModuleIds.some(permittedModuleId => permittedModuleId === fedStateTopicsMappedModuleIds.silverStTopics),
                        gold: goldFedTopicsPermissions ||
                            permittedModuleIds.some(permittedModuleId => permittedModuleId === fedStateTopicsMappedModuleIds.goldStTopics),
                    };
                    const csnPermissions = {
                        silver: isFederalTaxPermitted && !isExplanationsPermitted,
                        gold: isFederalTaxPermitted && isExplanationsPermitted,
                    };
                    const className = getQnAClassName(csnPermissions, topicPermissions);
                    const answerHtml = cheerio.load(suggestion.quickKey);
                    const selectorDataToRemove = `[class^="subscription-"]:not(.subscription-${className})`;
                    const elementsToRemove = answerHtml(selectorDataToRemove);
                    let filteredQAAnswer = suggestion.quickKey;
                    for (let i = 0; i < elementsToRemove.length; i++) {
                        filteredQAAnswer = filteredQAAnswer.replace(cheerio.html(elementsToRemove[i]), '');
                    }
                    // wrap links into appropriate A tags
                    const selectorWithLink = '.qa-link';
                    const filteredMessage = cheerio.load(filteredQAAnswer);
                    const qaLinkAttributes = filteredMessage(selectorWithLink).attr();
                    if (qaLinkAttributes) {
                        const docId = qaLinkAttributes['docid'];
                        let documentLink = `/resolve/document/${docId}`;
                        if (qaLinkAttributes['docanchor']) {
                            const anchor = qaLinkAttributes['docanchor'];
                            documentLink = `${documentLink}?anchor=${anchor}`;
                        }
                        const linkWrapper = `<a href="${documentLink}" data-e2e-element-id="documentLink" data-e2e-element-type="link"></a>`;
                        filteredMessage(selectorWithLink).wrap(linkWrapper);
                    }
                    suggestion.quickKey = filteredMessage.html();
                }
            });
            return {
                suggestions: section.suggestions,
                title: Suggestions.getDictionaryLabelById(section.dictionaryId, dictionaries),
                area: Suggestions.getSuggestionSectionArea(section.dictionaryId, dictionaries),
            };
        });
        return groupedSuggestions;
    }
    static combineSuggestions(suggestionSections) {
        const qaDictionaryId = qaDictionaryConfig.id;
        const qaDictionaryPremiumId = qaDictionaryPremiumConfig.id;
        const maxQASuggestions = parseInt(qaDictionaryPremiumConfig.maxTerms);
        const otherAutocompleteTypes = suggestionSections.filter(section => section.dictionaryId !== qaDictionaryId && section.dictionaryId !== qaDictionaryPremiumId);
        const otherAutocompleteTypesExisted = otherAutocompleteTypes.length > 0;
        const qaDictionarySection = suggestionSections.find(item => item.dictionaryId === qaDictionaryId);
        const qaDictionaryPremium = suggestionSections.find(item => item.dictionaryId === qaDictionaryPremiumId);
        const qaSuggestionsPosition = suggestionSections.findIndex(item => item.dictionaryId === qaDictionaryId || item.dictionaryId === qaDictionaryPremiumId);
        if (!qaDictionarySection && !qaDictionaryPremium) {
            return otherAutocompleteTypes;
        }
        const combinedQASuggestions = Suggestions.combineQASuggestions(qaDictionaryPremium, qaDictionarySection, otherAutocompleteTypesExisted);
        if (combinedQASuggestions.length && qaSuggestionsPosition !== -1) {
            const qaSuggestionsGroup = [
                { suggestions: combinedQASuggestions.slice(0, maxQASuggestions), dictionaryId: qaDictionaryId },
            ];
            return otherAutocompleteTypes
                .slice(0, qaSuggestionsPosition)
                .concat(qaSuggestionsGroup, otherAutocompleteTypes.slice(qaSuggestionsPosition));
        }
        return otherAutocompleteTypes;
    }
    static combineQASuggestions(qaDictionaryPremiumSection, qaDictionarySection, otherAutocompleteTypesExisted) {
        const maxPremiumSuggestions = qaDictionaryPremiumConfig.maxPremiumSuggestions;
        const maxPremiumSuggestionsReduced = qaDictionaryPremiumConfig.maxPremiumSuggestionsReduced;
        let combinedSuggestions = [];
        if (!qaDictionaryPremiumSection) {
            combinedSuggestions = combinedSuggestions.concat(qaDictionarySection.suggestions);
        }
        else {
            if (!otherAutocompleteTypesExisted && qaDictionarySection) {
                combinedSuggestions = qaDictionaryPremiumSection.suggestions.slice(0, maxPremiumSuggestions);
                combinedSuggestions = Suggestions.parseQuickKey(combinedSuggestions);
                combinedSuggestions = combinedSuggestions.concat(qaDictionarySection.suggestions);
            }
            else if (otherAutocompleteTypesExisted && qaDictionarySection) {
                combinedSuggestions = qaDictionaryPremiumSection.suggestions.slice(0, maxPremiumSuggestionsReduced);
                combinedSuggestions = Suggestions.parseQuickKey(combinedSuggestions);
                combinedSuggestions = combinedSuggestions.concat(qaDictionarySection.suggestions);
            }
            else {
                combinedSuggestions = Suggestions.parseQuickKey(qaDictionaryPremiumSection.suggestions);
            }
        }
        return combinedSuggestions;
    }
    static parseQuickKey(suggestions) {
        return suggestions.map(suggestion => {
            suggestion.quickKey = Suggestions.parsePremiumQuickKey(suggestion.quickKey);
            return suggestion;
        });
    }
    static parsePremiumQuickKey(quickKey) {
        const premiumContainerRegex = /class="qa-text"/gi;
        quickKey = quickKey.replace(premiumContainerRegex, 'class="qa-text qa-premium"');
        return quickKey;
    }
    static getDictionaryLabelById(id, dictionaries) {
        const dictionary = dictionaries.find(item => item.id === id);
        return (dictionary === null || dictionary === void 0 ? void 0 : dictionary.label) || '';
    }
    static getSuggestionSectionArea(id, dictionaries) {
        const dictionary = dictionaries.find(item => item.id === id);
        let area = '';
        if (id === 'WKUS-TAL-AC-IRCCodeJumpTo') {
            area = SUGGESTION_SECTION_AREA.CITATION_LOOKUP;
        }
        else if (id === 'WKUS-TAA-WORDWHEEL') {
            area = SUGGESTION_SECTION_AREA.SEARCH_IN_ALL_CONTENT;
        }
        else if (id === 'WKUS-TAL-AC-QandA-AutoSuggest-Enhanced' || id === 'WKUS-TAL-AC-TAXBOOK-QA') {
            area = SUGGESTION_SECTION_AREA.QUESTIONS_AND_ANSWERS;
        }
        else if (id === 'WKUS-TAL-AC-TopicJumpTo') {
            area = SUGGESTION_SECTION_AREA.TOPICS;
        }
        else if (constants_1.ACCOUNTING_SEARCH_DICTIONARIES_IDS.includes(id)) {
            area = 'accountingAndAuditing';
        }
        return (dictionary === null || dictionary === void 0 ? void 0 : dictionary.area) || area;
    }
    static getSuggestionType(suggestion) {
        switch (suggestion.dictionaryId) {
            case 'WKUS-TAL-AC-IRCCodeJumpTo':
                return SuggestionType.citation;
            case constants_1.ARM_WORD_WHEEL_DICTIONARY_ID:
                return SuggestionType.armWordWheel;
            case 'WKUS-TAA-WORDWHEEL':
                return SuggestionType.wordwheel;
            case 'WKUS-TAL-AC-QandA-AutoSuggest-Enhanced':
                return SuggestionType.QnAStock;
            case 'WKUS-TAL-AC-TAXBOOK-QA':
                return SuggestionType.QnAPremium;
            case constants_1.FASB_TOPICS_DICTIONARY_ID:
                return SuggestionType.fasbTopics;
            case constants_1.ARM_TOPICS_A_Z_DICTIONARY_ID:
                return SuggestionType.armTopics;
            case 'WKUS-TAL-AC-TopicJumpTo':
                return SuggestionType.topic;
            case qaDictionaryBeyondConfig.id:
                return SuggestionType.QnABeyond;
            default:
                return null;
        }
    }
    static getARMDictionaries() {
        return lodash_1.chain(armDictionariesConfigs).flatten().sortBy('csnWordWheelOrder').value();
    }
    static getAllDictionaries(permittedModuleIds, isFreemium, intTopicsSearchResults) {
        const isQaDictionaryBeyondDisabled = isFreemium || qaDictionaryBeyondConfig.disabled;
        const brandBasedDictionariesConfigs = isQaDictionaryBeyondDisabled
            ? [qaDictionaryConfig]
            : [qaDictionaryBeyondConfig];
        const isTitleSearchEnabled = false;
        const isTopicsPermitted = permittedModuleIds.some(moduleId => fedStateTopicsModuleIds.some(fedStateTopicModuleId => fedStateTopicModuleId === moduleId)) || !!intTopicsSearchResults.length;
        const isPremiumQAAvailable = permittedModuleIds.some(moduleId => moduleId === MODULE_ID__PREMIUM_QA_DICTIONARY);
        if (isTopicsPermitted) {
            // topicDictionary doesn't contain any results for intTopics ModuleId (DA). this is artificial change just to add
            // topicDictionary to permitted dictionaries and make topic section appear in case user has no state
            // and fed content. This section will be filled with international suggestions in decorator
            if (!!intTopicsSearchResults.length && !lodash_1.includes(permittedModuleIds, intTopicsModuleId)) {
                permittedModuleIds.push(intTopicsModuleId);
            }
            topicDictionaryConfig.permissionFilterIds = permittedModuleIds;
            brandBasedDictionariesConfigs.push(topicDictionaryConfig);
        }
        if (isPremiumQAAvailable && isQaDictionaryBeyondDisabled) {
            brandBasedDictionariesConfigs.push(qaDictionaryPremiumConfig);
        }
        return lodash_1.chain(permissionBasedDictionariesConfigs)
            .filter(dictionary => {
            if (dictionary.requireSubscription === 'federalTax') {
                return permittedModuleIds.some(moduleId => moduleId === federalTaxModuleId);
            }
            return true;
        })
            .push(brandBasedDictionariesConfigs)
            .flatten()
            .filter(dictionary => (isTitleSearchEnabled ? dictionary.id === titleSearchDictionaryId : true))
            .sortBy('csnWordWheelOrder')
            .value();
    }
    static applySuggestionsOrder(suggestions, dictionariesOrder) {
        const flattenSuggestions = lodash_1.flatten(suggestions);
        return flattenSuggestions.sort((suggestion1, suggestion2) => dictionariesOrder[suggestion1.dictionaryId] - dictionariesOrder[suggestion2.dictionaryId]);
    }
    static getSuggestionsByDictionaries(req, query, dictionaries) {
        const queries = [];
        const { combinedQueries, dictionariesOrder } = Suggestions.combineDictionaryQueries(dictionaries, query);
        const { externalSuggestionPromises, externalDictionariesOrder } = Suggestions.getExternalSuggestions(req, query, dictionaries);
        combinedQueries.forEach(combinedQuery => {
            queries.push(Suggestions.getDictionarySuggestions(req, combinedQuery, query));
        });
        return {
            suggestionPromises: Promise.all([...queries, ...externalSuggestionPromises]),
            dictionariesOrder: Object.assign(Object.assign({}, dictionariesOrder), externalDictionariesOrder),
        };
    }
    static getExternalSuggestions(req, searchQuery, dictionaries) {
        return dictionaries.reduce((acc, item) => {
            if (item.source === DictionaryConfigSourceEnum.EXTERNAL) {
                acc.externalSuggestionPromises.push(Suggestions.getExternalSuggestionPromise(req, searchQuery, item));
                acc.externalDictionariesOrder[item.id] = item.csnWordWheelOrder;
            }
            return acc;
        }, {
            externalSuggestionPromises: [],
            externalDictionariesOrder: {},
        });
    }
    static getExternalSuggestionPromise(req, searchQuery, dictionary) {
        var _a;
        return (((_a = EXTERNAL_DICTIONARY_ID_TO_SUGGESTIONS_REQUEST_MAP[dictionary.id]) === null || _a === void 0 ? void 0 : _a.call(EXTERNAL_DICTIONARY_ID_TO_SUGGESTIONS_REQUEST_MAP, req, searchQuery, dictionary)) ||
            Promise.resolve([
                {
                    dictionaryId: dictionary.id,
                    suggestions: [],
                },
            ]));
    }
    static combineDictionaryQueries(dictionaries, query) {
        const combinedQueries = [];
        const dictionariesOrder = {};
        dictionaries.forEach(dictionary => {
            if (dictionary.source === DictionaryConfigSourceEnum.EXTERNAL)
                return;
            dictionariesOrder[dictionary.id] = dictionary.csnWordWheelOrder;
            dictionary.termLimitForSearch = dictionary.termLimitForSearch || '1';
            if (query.length >= parseInt(dictionary.termLimitForSearch)) {
                const combinedQuery = lodash_1.find(combinedQueries, query => lodash_1.isEqual(query.languages, [dictionary.language]) &&
                    query.maxSuggestions === dictionary.maxTerms &&
                    query.searchMethod ===
                        Suggestions.convertToEnum(dictionary.searchMethod, DAO.AutocompleteSearchMethod) &&
                    lodash_1.isEqual(query.permissionFilterIds, dictionary.permissionFilterIds));
                if (combinedQuery) {
                    combinedQuery.dictionaryIds.push(dictionary.id);
                }
                else {
                    combinedQueries.push({
                        languages: [dictionary.language],
                        maxSuggestions: dictionary.maxTerms,
                        searchMethod: Suggestions.convertToEnum(dictionary.searchMethod, DAO.AutocompleteSearchMethod),
                        dictionaryIds: [dictionary.id],
                        permissionFilterIds: dictionary.permissionFilterIds,
                    });
                }
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
    static getDictionarySuggestions(req, combinedQuery, query) {
        const config = {};
        if (combinedQuery.permissionFilterIds) {
            config.permissionFilterIds = combinedQuery.permissionFilterIds;
        }
        if (combinedQuery.maxSuggestions) {
            //default - 10
            config.maxSuggestions = combinedQuery.maxSuggestions;
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
            return Suggestions.parseSuggestions([], combinedQuery.dictionaryIds);
        });
    }
    static parseSuggestions(suggestions, dictionaryIds) {
        const results = [];
        dictionaryIds.forEach(dictionaryId => {
            results.push({
                dictionaryId: dictionaryId,
                suggestions: lodash_1.filter(suggestions, function (suggestion) {
                    return suggestion.dictionaryId === dictionaryId;
                }),
            });
        });
        return results;
    }
    static getSuggestionItemUrl(item) {
        const topicDictionaryItemId = (topicDictionaryConfig === null || topicDictionaryConfig === void 0 ? void 0 : topicDictionaryConfig.id) || null;
        const getRefInfo = (refInfo) => {
            if (!refInfo) {
                return '';
            }
            if (typeof refInfo === 'string') {
                return refInfo;
            }
            return refInfo.ref;
        };
        const refInfo = getRefInfo(item.refInfo);
        switch (item.dictionaryId) {
            case topicDictionaryItemId:
                return `/topic/${refInfo}`;
            case 'WKUS-TAL-AC-IRCCodeJumpTo':
                return `/resolve/document/${refInfo}`;
            default:
                if (refInfo !== INT_TREE_KEY) {
                    return null; // resolve url on UI side?
                }
                if (refInfo === INT_TREE_KEY) {
                    if (item.isTopic && !item.isMultiCountry) {
                        return `/topics/browse/international/category/${item.id}/${item.title}`;
                    }
                    if (item.isTopic && item.isMultiCountry) {
                        return `/resolve/topic/single/${item.id}`;
                    }
                    if (!item.isTopic) {
                        return `/topics/browse/international/jurisdiction/${item.referenceId}/${item.title}`;
                    }
                }
                return void 0;
        }
        return null;
    }
    static getFormattedSuggestionLabel(query, suggestion, dictionaries) {
        var _a;
        const dictionary = dictionaries === null || dictionaries === void 0 ? void 0 : dictionaries.find(item => item.id === (suggestion === null || suggestion === void 0 ? void 0 : suggestion.dictionaryId));
        let label = (_a = suggestion === null || suggestion === void 0 ? void 0 : suggestion.label) === null || _a === void 0 ? void 0 : _a.toString();
        const dictionariesHashCollection = {};
        dictionaries.forEach(dictionary => {
            dictionariesHashCollection[dictionary.id] = {
                searchMethod: dictionary.searchMethod,
            };
        });
        if (dictionary === null || dictionary === void 0 ? void 0 : dictionary.disableHighlighting) {
            return (suggestion === null || suggestion === void 0 ? void 0 : suggestion.formattedLabel) || label;
        }
        function escapeRegex(str) {
            return str ? str.replace(/[\\{}()\[\]^$+*?\-.,]/g, '\\$&') : str;
        }
        function noopRegex(str) {
            return str;
        }
        function wrapText(prefix, postfix) {
            return (text) => prefix + text + postfix;
        }
        function clearRegex(str) {
            return str ? str.replace(/[(){}\[\]!@#$%^&*-+_=,.\\/]/g, ' ') : str;
        }
        const wrapSearchTerm = wrapText('<strong>', '</strong>');
        /**
         * Ternary operator stands here for the sake of displaying highlighted values
         * event without defined dictionaryId for this @value.
         * Will be used default 'Infix' highlighting method
         */
        // const method = dictionariesHashCollection[value.dictionaryIds] ?
        //      dictionariesHashCollection[value.dictionaryIds].searchMethod : '';
        // **** NOTE 1:
        // the code above is an actual code from bmb.ux.taa library,
        // but it looks like something that was never working properly.
        // value in this case is a Term object with dictionaryId field (it is also mentioned in comment above the code),
        // not dictionaryIds. So in each case 'method' variable has an empty string value,
        // that's why code with dictionariesHashCollection was decided to skip.
        // It could be applied and fixed at any time, if it will be necessary.
        // const method = '';
        // let searchRegex;
        let queryWords = [];
        let escapeRegExpMethod = noopRegex;
        let queryMatchRegExp;
        let labelMatchRegExp;
        // switch (method as 0 | 1 | '') {
        //     **** please, read NOTE 1
        //     case 0:
        //         searchRegex = '^' + escapeRegex(query);
        //         label = label.replace(new RegExp(searchRegex, 'i'), function(foundWord) {
        //             return wrapSearchTerm(foundWord);
        //         });
        //         break;
        //     case 1:
        //    default:
        if (/[()]/g.test(label)) {
            if (/[()]/g.test(query)) {
                queryMatchRegExp = /([\w()]+)|(\(?[\w()]?\)?)|(\s)/g;
                labelMatchRegExp = /([\w()]+)|(\([\w()]?\)?)|(\s+)/g;
                escapeRegExpMethod = escapeRegex;
            }
            else {
                query = clearRegex(query);
                queryMatchRegExp = /[\w-]+|\([\w-]+\)/g;
                labelMatchRegExp = /(\(?[\w-]+\)?\:?)|(\s)/g;
                escapeRegExpMethod = noopRegex;
            }
        }
        else if (/\$/g.test(label)) {
            queryMatchRegExp = /./g;
            labelMatchRegExp = /./g;
            escapeRegExpMethod = escapeRegex;
        }
        else {
            // eslint-disable-next-line max-len
            queryMatchRegExp = /(?:^|\b)(\w)(?=\b|$)|(\w+[\:.,\u2014-]?)|([$]\d[,])|[^\s\w]/g; // \u8212 Em Dash
            // CSN-16509: overwrite and fix rs-search-form-categorized-wordwheel bmb directive
            labelMatchRegExp = /(?:^|\b)(\w)(?=\b|$)|(\w+[\:.,\u2014-]?)|([$,])|(&\w+;)|\W/g;
            escapeRegExpMethod = escapeRegex;
        }
        queryWords = query.match(queryMatchRegExp);
        if (queryWords) {
            let indexOfQueryWord = 0;
            const labelWords = label.match(labelMatchRegExp);
            for (let i = 0; i < labelWords.length; i++) {
                const wordReplaceRegExp = new RegExp('(?:^|\\b)' + escapeRegExpMethod(queryWords[indexOfQueryWord]), 'i');
                labelWords[i] = labelWords[i].replace(wordReplaceRegExp, function (foundText) {
                    indexOfQueryWord++;
                    return wrapSearchTerm(foundText);
                });
                if (indexOfQueryWord === queryWords.length) {
                    break;
                }
            }
            label = labelWords.join('');
        }
        //        break;
        // }
        return label;
    }
}
exports.Suggestions = Suggestions;
/// international
const jurisdictionsATSTreeConfig = externalDependencies_1.vars.get('jurisdictionsATSTreeConfig');
const internationalJurisdictionsFilterId = externalDependencies_1.vars.get('jurisdictionInternationalId');
const internationalTopicDoctypeFilterId = externalDependencies_1.vars.get('internationalDocTypeFilter') + '!ATS_Topics';
const intJurisdictionsPath = 'result.trees[0].nodes[0].children[0].children';
const internationalSuggestionsSectionLimit = externalDependencies_1.vars.get('int-subsection-size');
const internationalTopicATSTreeConfig = externalDependencies_1.vars.get('internationalTopicATSTreeConfig');
const excludedInternationalJursidictions = externalDependencies_1.vars.get('internationalTopicExcludedJurisdictions');
const internationalJurisdictionsFlagMap = externalDependencies_1.vars.get('internationalJurisdictionsFlagMap');
function getIntTopics(req) {
    return DAO.getPermissionedTree(jurisdictionsATSTreeConfig.filterTreeId, {
        levels: jurisdictionsATSTreeConfig.filterTreeLevels,
        scopeToFilterTree: [internationalJurisdictionsFilterId, internationalTopicDoctypeFilterId],
    }, req).then(tree => lodash_1.get(tree, intJurisdictionsPath, []));
}
class InternationalSearchSuggestions {
    constructor(req) {
        this.req = req;
        this.extractCountryCode = function (param) {
            const matches = param.split('_');
            return (matches === null || matches === void 0 ? void 0 : matches[1]) || '';
        };
        this.flatTopicListPromise = Promise.resolve([]);
        this.flatCountryListPromise = Promise.resolve([]);
        this.suggestionSectionLimit = internationalSuggestionsSectionLimit;
        this.jurisdictionsATSTreeConfig = jurisdictionsATSTreeConfig;
    }
    init(req) {
        this.flatCountryListPromise = this.getJurisdictionsWithTopics().then((search) => {
            const flatNodeCollection = this.getCountriesFlatten(search);
            return flatNodeCollection.map((item) => ({
                category: 'Jurisdiction',
                title: item.name,
                label: item.name,
                id: item.id,
                referenceId: item.id.split('_').pop(),
                isVisible: true,
                isTopic: false,
                refInfo: INT_TREE_KEY,
            }));
        });
        this.flatTopicListPromise = this.getInternationalTopicsList(req);
    }
    getSuggestions(query) {
        const regex = InternationalSearchSuggestions.generateRegexForPrefixSearch(query.toLowerCase());
        return Promise.all([this.flatTopicListPromise, this.flatCountryListPromise]).then(([flatTopicList, flatCountryList]) => {
            const filteredTopics = flatTopicList.filter((topic) => topic.title.match(regex));
            const filteredCountries = flatCountryList.filter((country) => country.title.match(regex));
            const result = filteredTopics.concat(filteredCountries);
            return lodash_1.chain(result)
                .groupBy('isTopic')
                .map((group) => group.slice(0, this.suggestionSectionLimit))
                .flatten()
                .value();
        });
    }
    /**
     * Handle special characters in search query for generating new RegExp
     * @param {string} query string, which is the search query
     * @returns {string}
     */
    static handleSpecialCharactersInSearchQuery(query) {
        return query ? query.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1') : query;
    }
    /**
     * Generate new RegExp for prefix search
     * @param {string} query string, which is the search query
     * @returns {RegExp}
     */
    static generateRegexForPrefixSearch(query) {
        return new RegExp('(?:^' +
            InternationalSearchSuggestions.handleSpecialCharactersInSearchQuery(query) +
            ')|(?:\\(' +
            InternationalSearchSuggestions.handleSpecialCharactersInSearchQuery(query) +
            ')|(?:\\s' +
            InternationalSearchSuggestions.handleSpecialCharactersInSearchQuery(query) +
            ')|([/—-]' +
            InternationalSearchSuggestions.handleSpecialCharactersInSearchQuery(query) +
            ')', 'gi');
    }
    getInternationalTopicsList(req) {
        return DAO.fetchIntTopicsTree(req, internationalTopicATSTreeConfig, internationalTopicDoctypeFilterId)
            .catch(error => {
            // TODO: investigate whether this catch block can be removed
            throw new SearchSuggestionsServiceError(constants_1.LOG_MESSAGE_GET_INTERNATIONAL_TOPICS_FOR_SUGGESTIONS_FAIL, error);
        })
            .then(tree => {
            const intTree = lodash_1.get(tree, 'result.trees[0].nodes[0].children[0]');
            if (!intTree)
                return [];
            const topicsFlatList = this.createListOfTopics(intTree);
            return topicsFlatList;
        })
            .catch(error => {
            // TODO: investigate whether we can always return an empty array instead of throwing an error here
            if (error instanceof SearchSuggestionsServiceError) {
                throw error;
            }
            externalDependencies_1.logService.logRequest(log_base_1.LogLevel.Error, req, {
                message: constants_1.LOG_MESSAGE_GET_INTERNATIONAL_TOPICS_FOR_SUGGESTIONS_EMPTY_RESULT,
                function: constants_1.FUNCTION_NAME_GET_INTERNATIONAL_TOPICS_FOR_SUGGESTIONS,
                correlationId: req.correlationId,
            }, error);
            return [];
        });
    }
    createListOfTopics(intTopicTree) {
        var _a;
        const topics = [];
        (_a = intTopicTree.children) === null || _a === void 0 ? void 0 : _a.forEach(category => {
            var _a;
            (_a = category.children) === null || _a === void 0 ? void 0 : _a.forEach(topic => {
                var _a;
                const isMultiCountry = category.title === 'Multi-Country';
                addItem(topics, category, topic, isMultiCountry);
                (_a = topic.children) === null || _a === void 0 ? void 0 : _a.forEach(subtopic => {
                    addItem(topics, topic, subtopic, isMultiCountry);
                });
            });
        });
        return topics;
        function addItem(collection, parentItem, item, isMultiCountry) {
            collection.push({
                category: parentItem.title,
                title: item.title,
                label: item.title,
                id: item.id.replace(/^\d+!/, ''),
                referenceId: item.id.split('!').pop(),
                isVisible: true,
                isTopic: true,
                isMultiCountry: lodash_1.isBoolean(isMultiCountry) ? isMultiCountry : false,
                refInfo: INT_TREE_KEY,
            });
        }
    }
    getJurisdictionsWithTopics(options) {
        options = options || {};
        const filters = [internationalTopicDoctypeFilterId];
        const treeId = options.filterTreeId || this.jurisdictionsATSTreeConfig.filterTreeId;
        const levelsCount = options.filterTreeLevels || this.jurisdictionsATSTreeConfig.filterTreeLevels;
        const treeParams = {
            levels: levelsCount,
            scopeToCshNode: options.nodes || null,
            scopeToFilterTree: options.filters || filters,
            $expand: options.$expand,
        };
        return DAO.getPermissionedTree(treeId, treeParams, this.req);
    }
    getCountriesFlatten(search) {
        const intTree = this.getTreeFromSearch(search, internationalJurisdictionsFilterId, false);
        if (!intTree || !intTree.children) {
            return [];
        }
        const countries = lodash_1.flatten(intTree.children.reduce((accum, item) => {
            if (!this.isJurisdictionExcluded(item.filterTreeNodeId)) {
                accum.push(item);
            }
            if (item.children.length) {
                // Any country may include nested child filters aka countries with a separate URI
                const children = item.children.filter(child => !this.isJurisdictionExcluded(child.filterTreeNodeId));
                accum = accum.concat(children);
            }
            return accum;
        }, []));
        const mappedFlatList = this.mapCountryList(countries);
        return lodash_1.sortBy(mappedFlatList, 'name');
    }
    getTreeFromSearch(search, treeId, handleError) {
        const treeSet = lodash_1.get(search, 'result.trees[0].nodes[0].children');
        if (!treeSet) {
            if (handleError) {
                this.handleError();
            }
            return null;
        }
        const tree = treeSet.find((treeItem) => {
            const freshTreeId = this.removeSearchIdPrefix(treeItem.id);
            return freshTreeId === treeId;
        });
        if (!tree) {
            if (handleError) {
                this.handleError();
            }
            return null;
        }
        return tree;
    }
    // TODO: we should investigate whether we really need this function, since it is not used at the moment
    handleError() {
        const ERROR_MESSAGE = 'Cannot reach the jurisdiction ATS';
        externalDependencies_1.logService.error(ERROR_MESSAGE);
    }
    isJurisdictionExcluded(nodeId) {
        return excludedInternationalJursidictions.some((item) => {
            const jurisdictionId = nodeId.substring(nodeId.indexOf('!') + 1);
            return item === jurisdictionId;
        });
    }
    mapCountryList(collection) {
        return collection.map((country) => {
            const code = this.extractCountryCode(country.id);
            const id = this.removeSearchIdPrefix(country.id);
            return {
                id: id,
                code: code && code.toUpperCase(),
                name: country.title,
                flagClassPostfix: this.getClassPostfix(code),
            };
        });
    }
    removeSearchIdPrefix(id) {
        return id.replace(/^\d+!/, '');
    }
    getClassPostfix(countryCode) {
        const replaceMap = internationalJurisdictionsFlagMap;
        const safeCountryCode = countryCode ? countryCode.toLowerCase() : '';
        const found = replaceMap.find(flagItem => flagItem.code === safeCountryCode);
        return found ? found.flagClassPostfix : safeCountryCode;
    }
}
//# sourceMappingURL=SearchSuggestionsService.js.map
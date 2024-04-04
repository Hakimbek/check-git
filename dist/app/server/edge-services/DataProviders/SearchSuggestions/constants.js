"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INTERNAL_SUGGESTIONS_TYPES = exports.EXTERNAL_SUGGESTIONS_TYPES = exports.ACCOUNTING_SEARCH_DICTIONARIES_IDS = exports.ARM_CONTENT_TYPES = exports.ARM_WORD_WHEEL_DICTIONARY_ID = exports.ARM_TOPICS_A_Z_DICTIONARY_ID = exports.FASB_TOPICS_DICTIONARY_ID = exports.LOG_MESSAGE_GET_INTERNATIONAL_TOPICS_FOR_SUGGESTIONS_FAIL = exports.LOG_MESSAGE_GET_INTERNATIONAL_TOPICS_FOR_SUGGESTIONS_EMPTY_RESULT = exports.FUNCTION_NAME_GET_INTERNATIONAL_TOPICS_FOR_SUGGESTIONS = exports.FUNCTION_NAME_GET_DICTIONARY_SUGGESTIONS = exports.LOG_MESSAGE_SAVE_PERMISSIONS_FOR_SUGGESTIONS_TO_CACHE_FAIL = exports.LOG_MESSAGE_GET_PERMISSIONS_FOR_SUGGESTIONS_FROM_CACHE_FAIL = exports.LOG_MESSAGE_GET_SEARCH_SUGGESTIONS_PERMISSIONS_REQUEST_FAIL = exports.FUNCTION_NAME_GET_SEARCH_SUGGESTIONS = void 0;
exports.FUNCTION_NAME_GET_SEARCH_SUGGESTIONS = 'getSearchSuggestions';
exports.LOG_MESSAGE_GET_SEARCH_SUGGESTIONS_PERMISSIONS_REQUEST_FAIL = 'Failed to get search suggestions due to the inability to check permissions.';
exports.LOG_MESSAGE_GET_PERMISSIONS_FOR_SUGGESTIONS_FROM_CACHE_FAIL = 'Failed to get permissions for search suggestions from redis cache.';
exports.LOG_MESSAGE_SAVE_PERMISSIONS_FOR_SUGGESTIONS_TO_CACHE_FAIL = 'Failed to save permissions for search suggestions to redis cache.';
exports.FUNCTION_NAME_GET_DICTIONARY_SUGGESTIONS = 'getDictionarySuggestions';
exports.FUNCTION_NAME_GET_INTERNATIONAL_TOPICS_FOR_SUGGESTIONS = 'getInternationalTopicsList';
exports.LOG_MESSAGE_GET_INTERNATIONAL_TOPICS_FOR_SUGGESTIONS_EMPTY_RESULT = 'Failed to create list of international topics for international search suggestions.';
exports.LOG_MESSAGE_GET_INTERNATIONAL_TOPICS_FOR_SUGGESTIONS_FAIL = 'Failed to get search suggestions due to inability to load list of international topics.';
exports.FASB_TOPICS_DICTIONARY_ID = 'WKUS-TAL-ARM-FASBCodeJumpThree';
exports.ARM_TOPICS_A_Z_DICTIONARY_ID = 'WKUS-TAL-ARM-TopicJumpTo';
exports.ARM_WORD_WHEEL_DICTIONARY_ID = 'WKUS-ARM-WORDWHEEL';
exports.ARM_CONTENT_TYPES = ['accounting'];
exports.ACCOUNTING_SEARCH_DICTIONARIES_IDS = [
    exports.FASB_TOPICS_DICTIONARY_ID,
    exports.ARM_TOPICS_A_Z_DICTIONARY_ID,
    exports.ARM_WORD_WHEEL_DICTIONARY_ID,
];
exports.EXTERNAL_SUGGESTIONS_TYPES = ['topic', 'citation'];
exports.INTERNAL_SUGGESTIONS_TYPES = ['fasbTopics', 'armTopics'];
//# sourceMappingURL=constants.js.map
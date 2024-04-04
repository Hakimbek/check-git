"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dictionary = exports.SEARCH_METHODS = void 0;
var SEARCH_METHODS;
(function (SEARCH_METHODS) {
    SEARCH_METHODS["INFIX"] = "Infix";
    SEARCH_METHODS["EXACT"] = "Exact";
})(SEARCH_METHODS = exports.SEARCH_METHODS || (exports.SEARCH_METHODS = {}));
class Dictionary {
    constructor({ query, id, language, maxSuggestions, searchMethod }) {
        this.query = query || '';
        this.dictionaryId = id;
        this.language = language || 'en';
        this.maxSuggestions = maxSuggestions || 1;
        this.searchMethod = searchMethod;
    }
}
exports.Dictionary = Dictionary;
//# sourceMappingURL=Query.types.js.map
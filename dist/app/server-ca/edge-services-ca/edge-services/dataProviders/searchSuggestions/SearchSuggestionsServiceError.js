"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SearchSuggestionsServiceError extends Error {
    constructor(message, originalError) {
        super(message);
        this.originalError = null;
        this.originalError = originalError;
    }
}
exports.default = SearchSuggestionsServiceError;
//# sourceMappingURL=SearchSuggestionsServiceError.js.map
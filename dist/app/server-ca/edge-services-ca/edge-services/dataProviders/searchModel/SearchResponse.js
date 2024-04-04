"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchResponse = void 0;
const SearchResponseResult_1 = require("./SearchResponseResult");
class SearchResponse {
    constructor({ id, query, initialSearchId, result }) {
        this.id = id;
        this.query = query;
        this.initialSearchId = initialSearchId;
        this.result = new SearchResponseResult_1.SearchResponseResult(result || {});
    }
}
exports.SearchResponse = SearchResponse;
//# sourceMappingURL=SearchResponse.js.map
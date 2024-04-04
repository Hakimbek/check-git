"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchResponseResult = void 0;
const SearchResponseItem_1 = require("./SearchResponseItem");
const SearchResponseFilter_1 = require("./SearchResponseFilter");
class SearchResponseResult {
    constructor({ itemCount, items, filters }) {
        this.itemCount = itemCount && Number(itemCount);
        this.filters = filters ? filters.map((filter) => new SearchResponseFilter_1.SearchResponseFilter(filter)) : [];
        this.items = items ? items.map((item) => new SearchResponseItem_1.SearchResponseItem(item)) : [];
    }
}
exports.SearchResponseResult = SearchResponseResult;
//# sourceMappingURL=SearchResponseResult.js.map
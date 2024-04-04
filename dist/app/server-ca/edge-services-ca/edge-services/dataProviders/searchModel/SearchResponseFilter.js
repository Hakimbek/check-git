"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchResponseFilter = void 0;
const SearchResponseFilterTreeNode_1 = require("./SearchResponseFilterTreeNode");
class SearchResponseFilter {
    constructor({ id, filterTreeId, nodes }) {
        this.id = id;
        this.filterTreeId = filterTreeId;
        this.nodes = nodes ? nodes.map(node => new SearchResponseFilterTreeNode_1.SearchResponseFilterTreeNode(node)) : [];
    }
}
exports.SearchResponseFilter = SearchResponseFilter;
//# sourceMappingURL=SearchResponseFilter.js.map
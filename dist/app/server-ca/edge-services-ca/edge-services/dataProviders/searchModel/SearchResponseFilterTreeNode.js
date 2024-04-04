"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchResponseFilterTreeNode = void 0;
class SearchResponseFilterTreeNode {
    constructor({ id, index, title, hasChildren, childrenCount, filterTreeNodeId, totalHits, children, }) {
        this.id = id;
        this.index = index;
        this.title = title;
        this.hasChildren = hasChildren;
        this.childrenCount = childrenCount;
        this.filterTreeNodeId = filterTreeNodeId;
        this.totalHits = totalHits;
        this.children = (children === null || children === void 0 ? void 0 : children.length) ? children.map(child => new SearchResponseFilterTreeNode(child)) : null;
    }
}
exports.SearchResponseFilterTreeNode = SearchResponseFilterTreeNode;
//# sourceMappingURL=SearchResponseFilterTreeNode.js.map
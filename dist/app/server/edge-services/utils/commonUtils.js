"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeTags = void 0;
// Remove all tags from string
const removeTags = (str) => {
    return str && str.replace(/<[^>]+>/g, '');
};
exports.removeTags = removeTags;
//# sourceMappingURL=commonUtils.js.map
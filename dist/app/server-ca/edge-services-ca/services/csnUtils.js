"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CsnUtils = void 0;
const he_1 = __importDefault(require("he"));
const dashPattern = /^([^[]*?)\s*—\s*(.*)/;
class CsnUtils {
    static getDocumentId(doc) {
        return doc.documentId || doc.id.split('!').pop();
    }
    static htmlDecode(html) {
        return he_1.default.decode(html);
    }
    static removeDiacritics(str) {
        const diacritics = [
            [/[\u00C0-\u00C6]/g, 'A'],
            [/[\u00E0-\u00E6]/g, 'a'],
            [/[\u00C8-\u00CB]/g, 'E'],
            [/[\u00E8-\u00EB]/g, 'e'],
            [/[\u00CC-\u00CF]/g, 'I'],
            [/[\u00EC-\u00EF]/g, 'i'],
            [/[\u00D2-\u00D8]/g, 'O'],
            [/[\u00F2-\u00F8]/g, 'o'],
            [/[\u00D9-\u00DC]/g, 'U'],
            [/[\u00F9-\u00FC]/g, 'u'],
            [/[\u00D1]/g, 'N'],
            [/[\u00F1]/g, 'n'],
            [/[\u00C7]/g, 'C'],
            [/[\u00E7]/g, 'c'],
        ];
        for (const diacritic of diacritics) {
            str = str.replace(diacritic[0], diacritic[1]);
        }
        return str;
    }
    static removeSearchIdPrefix(id) {
        return id.replace(CsnUtils.searchIdPrefixRegexp, '');
    }
    static decorateText(item) {
        return item
            ? item
                .split('-')
                .map(part => part.charAt(0).toUpperCase() + part.substring(1))
                .join(' ')
            : '';
    }
    static extractParts(title) {
        const matchResult = title.match(dashPattern);
        return {
            sectionNumber: matchResult ? matchResult[1] : '',
            sectionTitle: matchResult ? matchResult[2] : title,
        };
    }
}
exports.CsnUtils = CsnUtils;
CsnUtils.searchIdPrefixRegexp = /^\d+!/;
//# sourceMappingURL=csnUtils.js.map
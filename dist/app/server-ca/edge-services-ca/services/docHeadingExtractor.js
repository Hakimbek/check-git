"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocHeadingExtractor = void 0;
// import { MetadataService } from './../../../SharedCode/react-ca/services/metadataService';
// import { CsnUtils } from './../../../SharedCode/react-ca/services/csnUtils';
// import { DOCUMENT_HEADING_MAPPING } from './../../../SharedCode/react-ca/constants/documentHeadingMapping';
const documentHeadingMapping_1 = require("../constants/documentHeadingMapping");
const csnUtils_1 = require("./csnUtils");
const metadataService_1 = require("./metadataService");
class DocHeadingExtractor {
    static extract(document) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const primaryClass = metadataService_1.MetadataService.getPrimaryClass(document);
        const titleSeparator = ((_b = (_a = documentHeadingMapping_1.DOCUMENT_HEADING_MAPPING[primaryClass.superClass]) === null || _a === void 0 ? void 0 : _a[primaryClass.subClass]) === null || _b === void 0 ? void 0 : _b.separator) || ((_d = (_c = documentHeadingMapping_1.DOCUMENT_HEADING_MAPPING[primaryClass.superClass]) === null || _c === void 0 ? void 0 : _c.default) === null || _d === void 0 ? void 0 : _d.separator) ||
            documentHeadingMapping_1.DOCUMENT_HEADING_MAPPING.default.separator;
        const titleMetadata = ((_f = (_e = documentHeadingMapping_1.DOCUMENT_HEADING_MAPPING[primaryClass.superClass]) === null || _e === void 0 ? void 0 : _e[primaryClass.subClass]) === null || _f === void 0 ? void 0 : _f.metadata) || ((_h = (_g = documentHeadingMapping_1.DOCUMENT_HEADING_MAPPING[primaryClass.superClass]) === null || _g === void 0 ? void 0 : _g.default) === null || _h === void 0 ? void 0 : _h.metadata) ||
            documentHeadingMapping_1.DOCUMENT_HEADING_MAPPING.default.metadata;
        return csnUtils_1.CsnUtils.htmlDecode(titleMetadata
            .map(metadataField => typeof metadataField === 'string'
            ? metadataService_1.MetadataService.extractMetadata(document, metadataField)
            : metadataService_1.MetadataService.extractMetadata(document, metadataField.name, metadataField.attributeKey, metadataField.attributeValue))
            .filter(metadataValue => metadataValue)
            .join(titleSeparator)
            .trim() || document.title);
    }
}
exports.DocHeadingExtractor = DocHeadingExtractor;
//# sourceMappingURL=docHeadingExtractor.js.map
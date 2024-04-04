"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentTypes = void 0;
const document_type_utils_1 = require("../DataProviders/arm-specific/document/document-type.utils");
const DATitles_utils_1 = require("./DATitles.utils");
const sharedServices = global.sharedServices;
class DocumentTypes {
    static getDocumentType(document, mapping) {
        const isARMDocument = DATitles_utils_1.DATitlesHelpers.isArmDocument(document);
        return isARMDocument
            ? document_type_utils_1.DocumentTypeUtils.getDocumentType(document)
            : sharedServices.metadataService.getDocumentType(document, mapping);
    }
    static isProxyDocument(document) {
        return sharedServices.metadataService.isProxyDoc(document);
    }
}
exports.DocumentTypes = DocumentTypes;
//# sourceMappingURL=DocumentTypes.utils.js.map
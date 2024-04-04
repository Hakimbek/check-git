"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentTypeUtils = void 0;
const type_indicator_service_1 = require("../../arm-specific/document/type-indicator/type-indicator.service");
const document_type_constants_1 = require("./document-type.constants");
const sharedServices = global.sharedServices;
class DocumentTypeUtils {
    static getDocumentType(document) {
        var _a;
        return (_a = new type_indicator_service_1.ARMDocumentTypeIndicatorService().getDocumentTypeIndicatorByDocument(document)) === null || _a === void 0 ? void 0 : _a.searchType;
    }
    static getExtraTitles(document) {
        return sharedServices.metadataService.extractMetadata(document, document_type_constants_1.COMBINABLE_EXTRA_TITLE_METADATA_KEY, document_type_constants_1.COMBINABLE_EXTRA_TITLE_METADATA_ATTRIBUTE_KEY);
    }
}
exports.DocumentTypeUtils = DocumentTypeUtils;
//# sourceMappingURL=document-type.utils.js.map
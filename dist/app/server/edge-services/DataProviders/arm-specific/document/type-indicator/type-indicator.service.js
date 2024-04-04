"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ARMDocumentTypeIndicatorService = void 0;
const TypeIndicator_data_1 = require("./../../../Document/TypeIndicator/TypeIndicator.data");
const ARM_METADATA__BOOK_KEY = 'pcicore:isInPublication';
const ARM_METADATA__AUTHOR_KEY = 'pcicore:isIssuedBy';
const METADATA__PUBVOL = 'pubvol';
// DO NOT import `DocumentTransformation` service here to avoid circular dependencies
function getMetadata(document, name, attributeKey, attributeValue) {
    const metadataService = global.sharedServices.metadataService;
    return metadataService.extractMetadata(document, name, attributeKey, attributeValue);
}
function getPrimaryClass(document) {
    const metadataService = global.sharedServices.metadataService;
    return metadataService.extractPrimaryClass(document);
}
class ARMDocumentTypeIndicatorService {
    getDocumentTypeIndicatorByDocument(document) {
        return this.getDocumentTypeIndicatorForLoadedDocument(document);
    }
    getDocumentTypeIndicatorForLoadedDocument(document) {
        var _a, _b, _c, _d, _e;
        const extendedMetadata = document === null || document === void 0 ? void 0 : document.extendedMetadata;
        const pubVol = getMetadata(document, METADATA__PUBVOL);
        // return nothing for non-arm content
        if (!(pubVol === null || pubVol === void 0 ? void 0 : pubVol.startsWith('armac'))) {
            return null;
        }
        let documentTypeInfo = null;
        const primaryClass = ARMDocumentTypeIndicatorService.getDocumentClass(document);
        const { authorName = '', book } = ARMDocumentTypeIndicatorService.getAuthorAndBookName(extendedMetadata);
        // firstly check primary classes mapping tree
        if (TypeIndicator_data_1.DocumentTypesMap.byPrimaryClass[primaryClass]) {
            const isPrimaryClassMappingExisting = primaryClass in TypeIndicator_data_1.DocumentTypesMap.byPrimaryClass;
            documentTypeInfo = (_a = TypeIndicator_data_1.DocumentTypesMap.byPrimaryClass[primaryClass]) === null || _a === void 0 ? void 0 : _a.default;
            if (isPrimaryClassMappingExisting && !documentTypeInfo) {
                const authorMapping = (_b = TypeIndicator_data_1.DocumentTypesMap.byPrimaryClass[primaryClass]) === null || _b === void 0 ? void 0 : _b.byAuthor[authorName];
                if (authorMapping) {
                    const mappingByBook = (_c = authorMapping.byBook) === null || _c === void 0 ? void 0 : _c[book];
                    if (mappingByBook) {
                        documentTypeInfo = mappingByBook.default;
                    }
                    if (!documentTypeInfo) {
                        documentTypeInfo = authorMapping.default;
                    }
                }
            }
        }
        if (!documentTypeInfo) {
            const authorMapping = TypeIndicator_data_1.DocumentTypesMap === null || TypeIndicator_data_1.DocumentTypesMap === void 0 ? void 0 : TypeIndicator_data_1.DocumentTypesMap.byAuthor[authorName];
            if (authorMapping) {
                const mappingByPrimaryClass = (_d = authorMapping.byPrimaryClass) === null || _d === void 0 ? void 0 : _d[primaryClass];
                if (mappingByPrimaryClass) {
                    const mappingByBook = (_e = mappingByPrimaryClass.byBook) === null || _e === void 0 ? void 0 : _e[book];
                    if (mappingByBook) {
                        documentTypeInfo = mappingByBook.default;
                    }
                    if (!documentTypeInfo) {
                        documentTypeInfo = mappingByPrimaryClass.default;
                    }
                }
                if (!documentTypeInfo) {
                    documentTypeInfo = authorMapping.default;
                }
            }
        }
        if (!documentTypeInfo) {
            documentTypeInfo = TypeIndicator_data_1.DocumentTypesMap.default;
        }
        const bannerData = documentTypeInfo.banner;
        return {
            bgColor: bannerData.color,
            title: bannerData.authorType,
            subtitle: bannerData.documentType,
            searchType: documentTypeInfo === null || documentTypeInfo === void 0 ? void 0 : documentTypeInfo.searchType,
        };
    }
    static getDocumentClass(document) {
        const { superClass, subClass } = getPrimaryClass(document);
        return `${superClass}/${subClass}`;
    }
    static getAuthorAndBookName(extendedMetadata) {
        const doc = { extendedMetadata };
        const authorName = getMetadata(doc, ARM_METADATA__AUTHOR_KEY, 'foaf:name');
        const book = getMetadata(doc, ARM_METADATA__BOOK_KEY, 'skos:prefLabel');
        return { authorName, book };
    }
}
exports.ARMDocumentTypeIndicatorService = ARMDocumentTypeIndicatorService;
//# sourceMappingURL=type-indicator.service.js.map
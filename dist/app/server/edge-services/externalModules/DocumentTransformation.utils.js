"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentTransformation = void 0;
const extended_metadata_1 = require("@wk/acm-search/shared/src/search-model/search-model-entities/extended-metadata");
const documentTypesMapping_1 = require("../DataProviders/documentTypesMapping");
const document_type_utils_1 = require("../DataProviders/arm-specific/document/document-type.utils");
const edgeServices_constants_1 = require("../edgeServices.constants");
const DocumentTypes_utils_1 = require("./DocumentTypes.utils");
const externalModules_constants_1 = require("./externalModules.constants");
const SearchDocumentItemTransformation_utils_1 = require("./SearchDocumentItemTransformation.utils");
const sharedServices = global.sharedServices;
class DocumentTransformation {
    static getItemsWithExtractedTitles(items, customHeadingFields) {
        return items.map(item => (Object.assign(Object.assign({}, item), { title: DocumentTransformation.getExtractedTitle(item, customHeadingFields) })));
    }
    static getDocumentType(document, mapping) {
        return DocumentTypes_utils_1.DocumentTypes.getDocumentType(document, mapping);
    }
    static getDocumentId(document) {
        return sharedServices.csnUtils.getDocumentId(document);
    }
    static getSortDate(document) {
        return sharedServices.metadataService.extractSortDate(document);
    }
    static getStateClientImpactEventTitle(document) {
        const isStateClientImpact = DocumentTransformation.isStateClientImpactEvent(document);
        if (!isStateClientImpact) {
            return null;
        }
        const regions = sharedServices.metadataService.getAllRegions(document);
        const taxTypes = sharedServices.metadataService.getAllTaxTypes(document).sort();
        const originalTitle = sharedServices.metadataService.extractOriginalTitle(document);
        const isMultistate = regions.some(region => region === externalModules_constants_1.DOCUMENT_REGION_TITLES.multistate);
        const stateRegionLabel = regions.find(region => region !== externalModules_constants_1.DOCUMENT_REGION_TITLES.federal);
        const stateName = isMultistate
            ? externalModules_constants_1.DOCUMENT_REGION_TITLES.multistate
            : edgeServices_constants_1.STATE_ALIASES[stateRegionLabel.toUpperCase()];
        return `${stateName}—${taxTypes.join(', ')}: ${originalTitle}`;
    }
    static isProxyDocument(document) {
        return DocumentTypes_utils_1.DocumentTypes.isProxyDocument(document);
    }
    static getProxyDocumentUrl(proxyDocument) {
        return sharedServices.metadataService.extractUrl(proxyDocument);
    }
    static isStateClientImpactEvent(document) {
        return (sharedServices.metadataService.extractPubVol(document) === externalModules_constants_1.STATE_CLIENT_IMPACT_EVENTS_PUBVOL);
    }
    static getExtraTitles(item) {
        return document_type_utils_1.DocumentTypeUtils.getExtraTitles(item);
    }
    static getExtractedTitle(item, customHeadingFields, context) {
        const pubVol = sharedServices.metadataService.extractPubVol(item);
        const isARMDocument = pubVol === null || pubVol === void 0 ? void 0 : pubVol.startsWith(externalModules_constants_1.ARM_PUBVOL);
        if (isARMDocument) {
            return sharedServices.docHeadingExtractor.getDocumentTitle(item);
        }
        return sharedServices.docHeadingExtractor.extract(item, customHeadingFields, context);
    }
    static getPrimaryClass(document) {
        return sharedServices.metadataService.extractPrimaryClass(document);
    }
    static getMetadata(document, name, attributeKey, attributeValue) {
        // @TODO any will be removed after refactoring metadataService and moving it to a separate module
        return sharedServices.metadataService.extractMetadata(document, name, attributeKey, attributeValue);
    }
    static getPredefinedDocumentType(document, mapping) {
        const documentType = DocumentTypes_utils_1.DocumentTypes.getDocumentType(document, mapping || documentTypesMapping_1.DOCUMENT_TYPES_MAPPING);
        return documentType;
    }
    // @TODO temporary solution to support old method's name inside ac modules, extractMetadata should be aligned with getMetadata
    static extractMetadata(document, name, attributeKey, attributeValue) {
        return this.getMetadata(document, name, attributeKey, attributeValue);
    }
    static extractRegionCode(document) {
        return sharedServices.metadataService.extractRegionCode(document);
    }
    static transformSearchResultItem(item, isFreemium) {
        return SearchDocumentItemTransformation_utils_1.SearchDocumentItemTransformation.transformSearchResultItem(item, isFreemium);
    }
    static updateMetadataValue(item, value, metadataKey, attributeKey) {
        var _a, _b, _c;
        let isValueUpdated = false;
        function updateValueMapCallback(metadataItem) {
            if (metadataItem.name === metadataKey) {
                if (!attributeKey) {
                    metadataItem.value = value;
                    isValueUpdated = true;
                }
                else {
                    metadataItem.attributes.map(attribute => {
                        if (attribute.key === attributeKey) {
                            attribute.value = value;
                            isValueUpdated = true;
                        }
                        return attribute;
                    });
                }
            }
            return metadataItem;
        }
        if ((_a = item.extendedMetadata) === null || _a === void 0 ? void 0 : _a.objects) {
            item.extendedMetadata.objects = item.extendedMetadata.objects.map(updateValueMapCallback);
        }
        if (!isValueUpdated && ((_b = item.extendedMetadata) === null || _b === void 0 ? void 0 : _b.groups)) {
            item.extendedMetadata.groups = (_c = item.extendedMetadata) === null || _c === void 0 ? void 0 : _c.groups.map(group => {
                if (group === null || group === void 0 ? void 0 : group.objects) {
                    group.objects = group.objects.map(updateValueMapCallback);
                }
                return group;
            });
        }
        if (!isValueUpdated) {
            const newMetadataAttributes = [];
            if (attributeKey) {
                newMetadataAttributes.push({
                    key: attributeKey,
                    value: value,
                });
            }
            const newMetadata = {
                name: metadataKey,
                value: attributeKey ? null : value,
                attributes: newMetadataAttributes,
            };
            item.extendedMetadata.objects.push(new extended_metadata_1.ExtendedMetadataObject(newMetadata));
        }
        return item;
    }
}
exports.DocumentTransformation = DocumentTransformation;
//# sourceMappingURL=DocumentTransformation.utils.js.map
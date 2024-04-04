"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataService = void 0;
const documentTypesMapping_1 = require("../constants/documentTypesMapping");
const csnUtils_1 = require("./csnUtils");
class MetadataService {
    static extractUrl(document) {
        const proxyName = MetadataService.extractMetadata(document, 'wkpractice-aid:metadata');
        const value = proxyName && proxyName.match(/url="(.+?)"/)[1];
        return {
            value,
            containsHost: /^https?:\/\//.test(value),
            containsPdfExtension: /.pdf$/.test(value),
            isOnPlatformDocument: /on-platform-document/.test(proxyName),
            isOnPlatformSmartchart: /on-platform-smartchart/.test(proxyName),
        };
    }
    static isProxyDocument(document) {
        const primaryClass = this.getPrimaryClass(document);
        return (MetadataService.extractUrl(document).containsPdfExtension ||
            MetadataService.extractUrl(document).containsHost ||
            (primaryClass.superClass === 'practice-aid' && primaryClass.subClass === 'application-proxy'));
    }
    static extractMetadata(document, name, attributeKey, attributeValue) {
        if (!document) {
            return null;
        }
        const metaData = MetadataService.findMetadata(document, name, attributeKey, attributeValue);
        if (!metaData) {
            return null;
        }
        return attributeValue || !attributeKey
            ? metaData.value ||
                (metaData.attributes && MetadataService.getResultValueFromAttributes(metaData, attributeKey))
            : metaData.attributeValue ||
                (metaData.attributes && MetadataService.getResultValueFromAttributes(metaData, attributeKey));
    }
    static extractRegionCode(document) {
        const code = MetadataService.extractMetadata(document, 'region', 'uri');
        return code ? code.slice(-2) : null;
    }
    static getResultValueFromAttributes(metaData, attributeKey) {
        const index = metaData.attributes.findIndex(attribute => attribute.key === attributeKey);
        return index > -1 && metaData.attributes[index].value;
    }
    static findMetadata(document, name, attributeKey, attributeValue) {
        const extendedMetadata = typeof document.extendedMetadata === 'function'
            ? document.extendedMetadata()
            : (document.extendedMetadata && document.extendedMetadata) || [];
        let result = MetadataService.findInExtendMetadataObjects(extendedMetadata.objects || extendedMetadata, name, attributeKey, attributeValue);
        if (!result && extendedMetadata.groups) {
            result = MetadataService.findInExtendMetadataGroups(extendedMetadata.groups, name, attributeKey, attributeValue);
        }
        return result;
    }
    static findInExtendMetadataObjects(objects, name, attributeKey, attributeValue) {
        return objects.find(metaData => {
            if (metaData.name === name &&
                (!attributeKey ||
                    (metaData.attributes && metaData.attributes.some(attribute => attribute.key === attributeKey)) ||
                    metaData.attributeKey === attributeKey) &&
                (!attributeValue ||
                    (metaData.attributes &&
                        metaData.attributes.some(attribute => attribute.value === attributeValue)) ||
                    metaData.attributeValue === attributeValue)) {
                return metaData;
            }
        });
    }
    static findInExtendMetadataGroups(groups, name, attributeKey, attributeValue) {
        return groups.some(group => MetadataService.findInExtendMetadataObjects(group.objects || group.groups, name, attributeKey, attributeValue) ||
            (group.name === name && group));
    }
    static extractExtendedMetadata(document) {
        if (!document.extendedMetadata) {
            return [];
        }
        return typeof document.extendedMetadata === 'function'
            ? document.extendedMetadata()
            : document.extendedMetadata.objects;
    }
    static getPrimaryClass(document) {
        let primaryClass = {};
        (MetadataService.extractExtendedMetadata(document) || []).every(metaData => {
            if (metaData.name === 'primary-class') {
                const superClass = metaData.value.match(/super-class="(.*?)"/);
                const subClass = metaData.value.match(/sub-class="(.*?)"/);
                primaryClass = {
                    superClass: Array.isArray(superClass) ? superClass[1].toLowerCase() : '',
                    subClass: Array.isArray(subClass) ? subClass[1].toLowerCase() : '',
                };
                return false;
            }
            return true;
        });
        return primaryClass;
    }
    static extractDocumentTypeId(document, mapping) {
        const primaryClass = this.getPrimaryClass(document);
        return mapping[primaryClass.superClass + '/' + primaryClass.subClass] || mapping[primaryClass.superClass];
    }
    static getDocumentType(document, mapping) {
        const typeId = MetadataService.extractDocumentTypeId(document, mapping);
        let mappedType = documentTypesMapping_1.DOCUMENT_TYPES_MAPPING[typeId];
        if (typeof mappedType === 'function') {
            mappedType = mappedType(document, false);
        }
        if (typeof mappedType === 'object') {
            mappedType = MetadataService.getMappedType(mappedType, document);
        }
        return mappedType || document.documentType || csnUtils_1.CsnUtils.decorateText(this.getPrimaryClass(document).subClass);
    }
    static getMappedType(mappedType, document) {
        const documentTypeByUri = mappedType[MetadataService.extractDocumentTypeUri(document)];
        return documentTypeByUri || '';
    }
    static extractDocumentTypeUri(document) {
        return (document.contentType = MetadataService.extractMetadata(document, 'condor:documentType', 'uri'));
    }
    static extractPubVol(document) {
        return MetadataService.extractMetadata(document, 'pubvol');
    }
    static extractSortDate(document) {
        return MetadataService.extractMetadata(document, 'sort-date', 'date');
    }
    static extractOriginalTitle(document) {
        return MetadataService.extractMetadata(document, 'title', 'type', 'standard');
    }
}
exports.MetadataService = MetadataService;
//# sourceMappingURL=metadataService.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decorateText = exports.getPrimaryClass = exports.extractMetadata = exports.findMetadata = void 0;
const isFunction_1 = __importDefault(require("lodash/isFunction"));
const findMetadata = (document, name, attributeKey, attributeValue) => {
    let result = undefined;
    let extendedMetadata = [];
    if (isFunction_1.default(document.extendedMetadata)) {
        extendedMetadata = document.extendedMetadata();
    }
    else if (document.extendedMetadata) {
        extendedMetadata = document.extendedMetadata;
    }
    function findInExtendMetadataObjects(objects) {
        objects.some(function (metaData) {
            if (metaData.name === name &&
                (!attributeKey ||
                    (metaData.attributes &&
                        metaData.attributes.some(function (attribute) {
                            return attribute.key === attributeKey;
                        })) ||
                    metaData.attributeKey === attributeKey) &&
                (!attributeValue ||
                    (metaData.attributes &&
                        metaData.attributes.some(function (attribute) {
                            return attribute.value === attributeValue;
                        })) ||
                    metaData.attributeValue === attributeValue)) {
                result = metaData;
            }
            return result;
        });
    }
    function findInExtendMetadataGroups(groups) {
        groups.some(function (group) {
            if (group.objects && group.objects.length > 0) {
                findInExtendMetadataObjects(group.objects);
            }
            else if (group.groups && group.groups.length > 0) {
                findInExtendMetadataGroups(group.groups);
            }
            else if (group.name === name) {
                result = group;
            }
            return result;
        });
    }
    findInExtendMetadataObjects(extendedMetadata['objects'] || extendedMetadata);
    if (!result && extendedMetadata['groups']) {
        findInExtendMetadataGroups(extendedMetadata['groups']);
    }
    return result;
};
exports.findMetadata = findMetadata;
const extractMetadata = (document, name, attributeKey, attributeValue) => {
    const metaData = exports.findMetadata(document, name, attributeKey, attributeValue);
    let result = undefined;
    function getResultValueFromAttributes() {
        const index = metaData.attributes.findIndex(function (attribute) {
            return attribute.key === attributeKey;
        });
        return index > -1 && metaData.attributes[index].value;
    }
    if (!metaData) {
        return undefined;
    }
    if (attributeValue || !attributeKey) {
        result = metaData.value || (metaData.attributes && getResultValueFromAttributes());
    }
    else {
        result = metaData.attributeValue || (metaData.attributes && getResultValueFromAttributes());
    }
    return result;
};
exports.extractMetadata = extractMetadata;
function getPrimaryClass(document) {
    var _a;
    const primaryClass = {
        superClass: null,
        subClass: null,
    };
    const extendedMetadata = ((_a = document === null || document === void 0 ? void 0 : document['extendedMetadata']) === null || _a === void 0 ? void 0 : _a['objects']) || [];
    extendedMetadata.every(function (metaData) {
        if (metaData.name === 'primary-class') {
            [primaryClass.superClass, primaryClass.subClass] = metaData.value.match(/(?!(super-class|sub-class)=")[a-zA-Z-]+(?=")/g);
            return false;
        }
        return true;
    });
    return primaryClass;
}
exports.getPrimaryClass = getPrimaryClass;
const decorateText = (item) => item
    .split('-')
    .map(function (part) {
    return part.charAt(0).toUpperCase() + part.substring(1);
})
    .join(' ');
exports.decorateText = decorateText;
//# sourceMappingURL=mock-functions.js.map
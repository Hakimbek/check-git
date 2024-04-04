"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeadingService = void 0;
const heading_map_1 = require("./heading.map");
const externalModules_1 = require("../../../../externalModules");
const DATitles_utils_1 = require("../../../../externalModules/DATitles.utils");
const sharedServices = global.sharedServices;
class HeadingService {
    static getHeadingTemplate(document, context) {
        var _a, _b;
        const { superClass, subClass } = externalModules_1.DocumentTransformation.getPrimaryClass(document);
        return (_b = (_a = heading_map_1.headingTemplateMapping[context][superClass]) === null || _a === void 0 ? void 0 : _a[subClass]) !== null && _b !== void 0 ? _b : null;
    }
    static getARMDocumentSearchHeading(document) {
        const headingTemplate = HeadingService.getHeadingTemplate(document, 'search');
        return !!headingTemplate ? HeadingService.BuildHeadingFromMetadataByTemplate(document, headingTemplate) : '';
    }
    static getDefaultDocumentSearchHeading(document, headingFields) {
        return sharedServices.docHeadingExtractor.extractSearchHeading(document, headingFields);
    }
    static BuildHeadingFromMetadataByTemplate(document, template, separator = ' ') {
        try {
            return template
                .reduce((headingParts, item) => {
                const value = externalModules_1.DocumentTransformation.getMetadata(document, item.name, item === null || item === void 0 ? void 0 : item.attributeKey, item === null || item === void 0 ? void 0 : item.attributeValue);
                if (value) {
                    headingParts.push(value);
                }
                return headingParts;
            }, [])
                .join(separator);
        }
        catch (e) {
            return '';
        }
    }
    static getSearchHeading(document, headingFields) {
        if (headingFields === null || headingFields === void 0 ? void 0 : headingFields.length) {
            return HeadingService.getDefaultDocumentSearchHeading(document, headingFields);
        }
        const isARMDocument = DATitles_utils_1.DATitlesHelpers.isArmDocument(document);
        if (isARMDocument) {
            const ARMDocumentSearchHeading = HeadingService.getARMDocumentSearchHeading(document);
            return !!ARMDocumentSearchHeading
                ? ARMDocumentSearchHeading
                : HeadingService.getDefaultDocumentSearchHeading(document);
        }
        return HeadingService.getDefaultDocumentSearchHeading(document);
    }
}
exports.HeadingService = HeadingService;
//# sourceMappingURL=heading.service.js.map
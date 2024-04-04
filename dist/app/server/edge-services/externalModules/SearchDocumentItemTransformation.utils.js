"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchDocumentItemTransformation = void 0;
const lodash_1 = require("lodash");
const heading_service_1 = require("../DataProviders/arm-specific/document/heading/heading.service");
const documentTypesMapping_1 = require("../DataProviders/documentTypesMapping");
const DATitles_utils_1 = require("./DATitles.utils");
const DocumentTransformation_utils_1 = require("./DocumentTransformation.utils");
const DocumentTypes_utils_1 = require("./DocumentTypes.utils");
const externalModules_constants_1 = require("./externalModules.constants");
const sharedServices = global.sharedServices;
const SEARCH_DOCUMENT_TITLE_LIMIT = 150;
const SEARCH_DOCUMENT_TOOLTIP_LIMIT = 1000;
const SUMMARY_MAX_MEANINGFUL_LENGTH = 256;
const ellipsis = '...';
const SUMMARY_MAX_LENGTH = SUMMARY_MAX_MEANINGFUL_LENGTH + ellipsis.length;
const middleOfTheWordRegexp = /[a-zA-Z'-]/;
const MASTER_GLOSSARY_PUBVOLS = ['armac023', 'armac024'];
class SearchDocumentItemTransformation {
    static getAttachmentResultItemTitle(item) {
        const fileName = DocumentTransformation_utils_1.DocumentTransformation.getMetadata(item, externalModules_constants_1.ATTACHMENT_FILE_NAME_METADATA_KEY, externalModules_constants_1.ATTACHMENT_FILE_NAME_ATTRIBUTE_KEY);
        return externalModules_constants_1.ATTACHMENT_TITLE_PREFIX + fileName.split('.')[0];
    }
    static truncateSummary(summary, maxLength) {
        return summary.replace(new RegExp('^(.{' + maxLength + '}[^\\s]*).*'), '$1');
    }
    static getSearchHeading(document, isArmDocument, headingFields) {
        return isArmDocument
            ? heading_service_1.HeadingService.getSearchHeading(document, headingFields)
            : sharedServices.docHeadingExtractor.extractSearchHeading(document, headingFields);
    }
    static prepareSummary(summary) {
        let resultSummary = summary;
        resultSummary = resultSummary.replace(/(\r\n|\n|\r)/gm, '').replace(/  +/g, ' ');
        resultSummary = SearchDocumentItemTransformation.truncateSummary(resultSummary, SUMMARY_MAX_LENGTH);
        //CSN-2010 - Include an ellipsis at the end of the top answer result excerpt
        if (!resultSummary.endsWith(ellipsis)) {
            resultSummary = resultSummary + ellipsis;
        }
        return resultSummary;
    }
    static transformSearchResultItem(item, isFreemium) {
        var _a;
        const isProxyDoc = DocumentTypes_utils_1.DocumentTypes.isProxyDocument(item);
        const attachmentParentDocumentId = DocumentTransformation_utils_1.DocumentTransformation.getMetadata(item, externalModules_constants_1.ATTACHMENT_INFO_METADATA_KEY, externalModules_constants_1.ATTACHMENT_PARENT_DOC_ID_ATTRIBUTE_KEY);
        let pubVol = sharedServices.metadataService.extractPubVol(item);
        if (attachmentParentDocumentId) {
            const [superClass, subClass] = (_a = DocumentTransformation_utils_1.DocumentTransformation.getMetadata(item, externalModules_constants_1.ATTACHMENT_FILE_PRIMARY_CLASS_KEY, externalModules_constants_1.ATTACHMENT_FILE_PRIMARY_CLASS_VALUE)) === null || _a === void 0 ? void 0 : _a.split('/');
            if (superClass && subClass) {
                item = DocumentTransformation_utils_1.DocumentTransformation.updateMetadataValue(item, `<super-class super-class="${superClass}"></super-class><sub-class sub-class="${subClass}"></sub-class>`, 'primary-class');
            }
            if (!pubVol) {
                pubVol = DocumentTransformation_utils_1.DocumentTransformation.getMetadata(item, externalModules_constants_1.ATTACHMENT_FILE_PUB_VOL_KEY, externalModules_constants_1.ATTACHMENT_FILE_PUB_VOL_VALUE);
                DocumentTransformation_utils_1.DocumentTransformation.updateMetadataValue(item, pubVol, 'pubvol');
            }
        }
        const isArmDocument = DATitles_utils_1.DATitlesHelpers.isArmDocument(item);
        const documentType = DocumentTypes_utils_1.DocumentTypes.getDocumentType(item, documentTypesMapping_1.DOCUMENT_TYPES_MAPPING);
        const extraTitles = DocumentTransformation_utils_1.DocumentTransformation.getExtraTitles(item);
        const itemTitle = attachmentParentDocumentId
            ? SearchDocumentItemTransformation.getAttachmentResultItemTitle(item)
            : item.title;
        const transformedItem = {
            title: itemTitle,
            extraTitles,
            tooltip: itemTitle,
            summary: isProxyDoc ? '' : SearchDocumentItemTransformation.prepareSummary(item.summary),
            greenLabel: null,
            greenLabelIconPath: null,
            documentType: documentType,
            documentId: attachmentParentDocumentId !== null && attachmentParentDocumentId !== void 0 ? attachmentParentDocumentId : lodash_1.last(item.id.split('!')),
            extendedMetadata: item.extendedMetadata,
            external: isProxyDoc,
            url: isProxyDoc ? sharedServices.metadataService.extractUrl(item) : null,
            isLocked: isFreemium && isProxyDoc && !sharedServices.metadataService.isDocAuthorized(item),
            metadata: item.searchMetadata,
        };
        if (!transformedItem.summary && documentType === 'Internal Revenue Code') {
            transformedItem.summary = this.getCodeSectionBlurbSummary(item);
        }
        if (!attachmentParentDocumentId) {
            try {
                const documentHeading = SearchDocumentItemTransformation.getSearchHeading(item, isArmDocument);
                if (typeof documentHeading === 'string') {
                    transformedItem.title = documentHeading;
                }
                else {
                    transformedItem.title = documentHeading[0]; // primary title
                    transformedItem.subtitle = documentHeading[1]; // optional secondary title e.g. CCH Tax Briefings (stb01fe97bfae7b1b1000af7200215ad7479002)
                }
            }
            catch (e) {
                // SearchDocumentItemTransformation.getSearchHeading failing when documentType has incorrect value
            }
        }
        transformedItem.tooltip = SearchDocumentItemTransformation.limitTitle(transformedItem.title, SEARCH_DOCUMENT_TOOLTIP_LIMIT);
        transformedItem.title = SearchDocumentItemTransformation.limitTitle(transformedItem.title, SEARCH_DOCUMENT_TITLE_LIMIT);
        const daTitle = sharedServices.metadataService.extractDaTitle(item);
        // CSN-14426 Add custom green labels for International OECD content
        const isDATitleVisibleByPubvol = DATitles_utils_1.DATitlesHelpers.showDaTitle(item);
        const isPrimarySource = DATitles_utils_1.DATitlesHelpers.isPrimarySource(item);
        if (isPrimarySource) {
            transformedItem.documentType = 'Primary Source';
        }
        // CSN-7968 Add doctype label for Tax Prep Partner Search Results
        const isTPP = SearchDocumentItemTransformation.isTaxPrepPartnerDocument(item, pubVol);
        // CSN-13978 adding label for PwC
        const isLabeledPwC = SearchDocumentItemTransformation.isItemLabeledPwC(pubVol);
        if (isLabeledPwC) {
            transformedItem.greenLabelIconPath = 'static/assets/pwc-search-result-logo@2x.png';
        }
        const isDaTitleVisible = (isTPP || isLabeledPwC || isDATitleVisibleByPubvol) && !lodash_1.isEmpty(daTitle);
        transformedItem.greenLabel = isDaTitleVisible
            ? `${transformedItem.documentType} - ${daTitle}`
            : transformedItem.documentType;
        const isSubTitleVisible = SearchDocumentItemTransformation.isSubTitleVisible(item);
        if (isSubTitleVisible) {
            // do not rewrite the subtitle for arm documents if it was already defined by documentHeading
            if (!isArmDocument || !transformedItem.subtitle) {
                transformedItem.subtitle = daTitle;
            }
        }
        return transformedItem;
    }
    static limitTitle(title, initialLimit) {
        let limitedTitle = title;
        let limit = initialLimit;
        if (limitedTitle && limitedTitle.length > limit) {
            limitedTitle = limitedTitle.substring(0, limit);
            while (limitedTitle[limitedTitle.length - 1].match(middleOfTheWordRegexp)) {
                limit--;
                limitedTitle = limitedTitle.substring(0, limit);
            }
            limitedTitle = limitedTitle.trim().concat(ellipsis);
        }
        return limitedTitle;
    }
    static isSubTitleVisible(document) {
        if (DATitles_utils_1.DATitlesHelpers.isArmDocument(document)) {
            // ARMAC-863: Don't show subtitles for master glossary pubVols
            const pubVol = sharedServices.metadataService.extractPubVol(document);
            return !MASTER_GLOSSARY_PUBVOLS.includes(pubVol);
        }
        const subTitleClassList = ['finder/finding-device', 'finder/case-table'];
        const primaryClass = sharedServices.metadataService.extractPrimaryClass(document);
        return !!subTitleClassList.find(function (item) {
            return item === primaryClass.superClass + '/' + primaryClass.subClass;
        });
    }
    // Add the summary text extracted from the codeSectionBlurb Extended Metadata when summary is empty
    // Only Code Section Shell documents have this metadata field
    /**
     * @probably_obsolete Looks like there are no real examples of
     * documents with such metadata. Those documents should be 'SHELL' documents
     * @param {SearchResultItem} item ???
     * @returns {string}
     */
    static getCodeSectionBlurbSummary(item) {
        const metadataList = item.extendedMetadata.objects;
        // returning first blurb metadata value as a summary
        const blurb = metadataList.find(metadataObject => metadataObject.name === 'codeSectionBlurb');
        if (blurb) {
            return blurb.value;
        }
        return '';
    }
    // enriching search result with doctype label for Tax Prep Partner
    static isTaxPrepPartnerDocument(item, pubVol) {
        const primaryClass = sharedServices.metadataService.extractPrimaryClass(item);
        if (primaryClass.superClass !== 'explanation' || primaryClass.subClass !== 'explanation') {
            return false;
        }
        return sharedServices['taxPrepPartnerDictionary'].isInDictionary(pubVol);
    }
    static isItemLabeledPwC(itemPubVol) {
        const pubVolsWithLabeledPwC = ['wwt01', 'wwt02'];
        return pubVolsWithLabeledPwC.some(function (pubVolWithLabeledPwC) {
            return itemPubVol === pubVolWithLabeledPwC;
        });
    }
}
exports.SearchDocumentItemTransformation = SearchDocumentItemTransformation;
//# sourceMappingURL=SearchDocumentItemTransformation.utils.js.map
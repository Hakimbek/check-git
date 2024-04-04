"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DOCUMENT_TYPES_MAPPING = void 0;
const metadataService_1 = require("../services/metadataService");
const documentTypesIdMapping_1 = require("./documentTypesIdMapping");
exports.DOCUMENT_TYPES_MAPPING = {
    'ID Internal Revenue Code': getLegislationType,
    'ID Regulation': getLegislationType,
    'ID Commentary CCH': getCommentaryType,
    'ID Commentary CTF': getCommentaryType,
    'ID Commentary APFF': getCommentaryType,
    'ID Concordance': getCommentaryType,
    'ID Government Documents': 'documentType.governmentDocuments',
    'ID Advice': 'documentType.advice',
    'ID Brochure': 'documentType.brochure',
    'ID Budget Plan': 'documentType.budgetPlan',
    'ID Bulletin': 'documentType.bulletin',
    'ID Circular': 'documentType.circular',
    'ID Guide': 'documentType.guide',
    'ID Manual': 'documentType.manual',
    'ID Memorandum': 'documentType.memorandum',
    'ID Newsletter': 'documentType.newsletter',
    'ID Agency Notice': 'documentType.agencyNotice',
    'ID Pamphlet': 'documentType.pamphlet',
    'ID Paper': 'documentType.paper',
    'ID Policy': 'documentType.policy',
    'ID Publication': 'documentType.publication',
    'ID Report': 'documentType.report',
    'ID Technical Program': 'documentType.folio',
    'ID Form': 'documentType.form',
    'ID Interpretation': 'documentType.interpretation',
    'ID Notice': 'documentType.notice',
    'ID Opinion Letters': 'documentType.opinionLetters',
    'ID Order': 'documentType.order',
    'ID Ruling': 'documentType.ruling',
    'ID Case': 'documentType.case',
    'ID History Notes': 'documentType.historyNotes',
    'ID Explanatory Notes': 'documentType.explanatoryNotes',
    'ID Act': getLegislationType,
    'ID Copyright': 'documentType.copyright',
    'ID Committee Report': 'documentType.committeeReport',
    'ID Case Comment': 'documentType.caseComment',
    'ID Tax Table': 'documentType.taxTable',
    'ID Prologue': 'documentType.prologue',
    'ID Webinar': 'documentType.webinar',
    'ID Citator': 'documentType.citator',
    'ID Topical Index': 'documentType.topicalIndex',
    'ID Agreement': 'documentType.agreement',
    'ID Convention': 'documentType.convention',
    'ID Model Convention': 'documentType.modelConvention',
    'ID Official Explanation': 'documentType.officialExplanation',
    'ID Protocol': 'documentType.protocol',
    'ID Treaty': 'documentType.treaty',
    'ID Author': 'documentType.author',
    'ID News Digest': 'documentType.newsDigest',
    'ID News Article': 'documentType.newsArticle',
    'ID Proposed Amendment': getProposedAmendmentType,
    'ID Periodical': 'documentType.periodical',
    'ID SmartChart': 'documentType.smartChart',
    'ID Topic': 'documentType.topic',
    'ID Treatise': 'documentType.onlineBooks',
    'ID Smartcharts Proxy': 'documentType.smartChart',
    'ID ITA Interpreter': 'documentType.itaInterpreter',
};
const FALLBACK_DOCUMENT_TYPES = {
    'ID Internal Revenue Code': 'documentType.law',
    'ID Regulation': 'documentType.regulation',
};
function getLegislationType(document) {
    const actName = metadataService_1.MetadataService.extractMetadata(document, 'actName', 'longName');
    if (actName) {
        return actName;
    }
    const primaryClass = metadataService_1.MetadataService.extractDocumentTypeId(document, documentTypesIdMapping_1.DOCUMENT_TYPES_ID_MAPPING);
    return FALLBACK_DOCUMENT_TYPES[primaryClass] || null;
}
function getProposedAmendmentType(document, isSearch) {
    return isSearch ? 'documentType.proposedAmendment' : getStandardTitle(document);
}
function getStandardTitle(document) {
    return metadataService_1.MetadataService.extractOriginalTitle(document);
}
function getCommentaryType() {
    return 'documentType.commentary';
}
//# sourceMappingURL=documentTypesMapping.js.map
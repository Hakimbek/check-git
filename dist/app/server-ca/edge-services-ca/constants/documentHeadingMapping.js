"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DOCUMENT_HEADING_MAPPING = void 0;
const standardTitle = {
    name: 'title',
    attributeKey: 'type',
    attributeValue: 'standard',
};
const searchTitle = {
    name: 'title',
    attributeKey: 'type',
    attributeValue: 'search',
};
exports.DOCUMENT_HEADING_MAPPING = {
    'default': {
        metadata: [standardTitle],
        separator: ', ',
    },
    'case-law': {
        default: {
            metadata: ['primaryCitation', 'caseAbbrevName', searchTitle],
        },
    },
    'law': {
        default: {
            metadata: ['num', 'region', standardTitle],
            separator: ' ',
        },
        codified: {
            metadata: ['region', standardTitle],
        },
        law: {
            metadata: ['num', 'region', 'PlNormLinkValue', standardTitle],
            separator: ' ',
        },
    },
    'agency-publication': {
        default: {
            metadata: ['num', standardTitle, 'region', 'primaryCitation', 'issuingBody'],
        },
    },
    'authoritative-rules-procedures': {
        default: {
            metadata: [standardTitle, 'primaryCitation', 'issuingBody'],
        },
    },
    'committee-report': {
        default: {
            metadata: [standardTitle, 'region', 'issuingBody', 'primaryCitation'],
        },
    },
    'explanation': {
        'default': {
            metadata: ['region', standardTitle],
        },
        'treatise': {
            metadata: [standardTitle],
        },
        'history-note': {
            metadata: [standardTitle],
        },
    },
    'form': {
        default: {
            metadata: ['num', standardTitle],
        },
    },
    'international-agreement': {
        default: {
            metadata: [searchTitle],
        },
    },
    'pending-legislation': {
        default: {
            metadata: [standardTitle, 'primaryCitation', 'officialHistoryDate'],
        },
    },
    'regulation': {
        default: {
            metadata: ['region', 'num', standardTitle],
        },
    },
    'ruling': {
        default: {
            metadata: [standardTitle, 'primaryCitation', 'issuingBody'],
        },
    },
};
//# sourceMappingURL=documentHeadingMapping.js.map
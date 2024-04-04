"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMBINABLE_EXTRA_TITLE_METADATA_ATTRIBUTE_KEY = exports.COMBINABLE_EXTRA_TITLE_METADATA_KEY = exports.DOCUMENT_TYPES = exports.DOCUMENT_SEARCH_TYPES = exports.TITLES = exports.DOCUMENT_TYPE_BANNER_AUTHOR_TYPE = exports.AUTHORS = exports.COLORS = void 0;
exports.COLORS = {
    GREEN: '#6FA23D',
    GRAY: '#919191',
    BLUE: '#4596BF',
    BLUE_SHADE: '#387C9E',
    TAN: '#BC9B65',
    TAN_DEEP: '#917140',
};
exports.AUTHORS = {
    AICPA: 'AICPA - American Institute of Certified Public Accountants',
    ARM: 'Accounting Research Manager',
    COSO: 'COSO - Committee of Sponsoring Organizations of the Treadway Commission',
    FASB: 'FASB - Financial Accounting Standards Board',
    GAO: 'GAO - Government Accountability Office',
    GFOA: 'GFOA - Government Finance Officers Association',
    GASB: 'GASB - Governmental Accounting Standards Board',
    HUD: 'HUD - U.S. Department of Housing and Urban Development',
    IASB: 'IASB - International Accounting Standards Board',
    IIA: 'IIA - The Institute of Internal Auditors',
    OMB: 'OMB - Office of Management and Budgets',
    PCAOB: 'PCAOB - Public Company Accounting Oversight Board',
    PCIE: "PCIE - President's Council on Integrity and Efficiency",
};
exports.DOCUMENT_TYPE_BANNER_AUTHOR_TYPE = {
    AICPA: 'AICPA',
    // whitespace is in title to prevent hiding document type banner on print version
    EMPTY: ' ',
    COSO: 'COSO',
    FASB: 'FASB',
    GAO: 'GAO',
    GFOA: 'GFOA',
    SEC: 'SEC',
    GASB: 'GASB',
    HUD: 'HUD',
    IASB: 'IASB',
    IIA: 'IIA',
    OMB: 'OMB',
    PCAOB: 'PCAOB',
    PCIE: 'PCIE',
    ARM: 'ARM',
};
/**
 * @deprecated use DOCUMENT_TYPE_BANNER_AUTHOR_TYPE instead
 *  */
exports.TITLES = exports.DOCUMENT_TYPE_BANNER_AUTHOR_TYPE;
exports.DOCUMENT_SEARCH_TYPES = {
    INTERPRETATIONS_AND_ANALYSIS: 'Interpretations and Analysis',
    OTHER: 'Other',
    PROPOSALS: 'Proposals',
    AUTHORITATIVE: 'Authoritative',
    GLOSSARY: 'Glossary',
};
/**
 * @deprecated use DOCUMENT_SEARCH_TYPES instead
 *  */
exports.DOCUMENT_TYPES = exports.DOCUMENT_SEARCH_TYPES;
exports.COMBINABLE_EXTRA_TITLE_METADATA_KEY = 'combinableNodeTitle';
exports.COMBINABLE_EXTRA_TITLE_METADATA_ATTRIBUTE_KEY = 'value';
//# sourceMappingURL=document-type.constants.js.map
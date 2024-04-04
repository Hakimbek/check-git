"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentTypesMap = void 0;
/**
 * @TODO This file should be moved to 'edge-services\src\DataProviders\arm-specific\document\document-type-banner' folder
 * @TODO use constants for content parts types
 */
const document_1 = require("../../arm-specific/document");
const DOCUMENT_PRIMARY_CLASS_EXPLANATION = 'explanation/explanation';
const DOCUMENT_PRIMARY_CLASS_PENDING_LEGISTLATION = 'pending-legislation/pending-legislation';
const DOCUMENT_PRIMARY_CLASS_AUTHORITATIVE_RULES = 'authoritative-rules-procedures/rule';
const DOCUMENT_PRIMARY_CLASS_EXPLANATION_GLOSSARY = 'explanation/glossary';
const DOCUMENT_PRIMARY_CLASS_RULING = 'ruling/ruling';
const DOCUMENT_PRIMARY_CLASS_TOPIC = 'topical-landing-page/arm-topical-landing-page';
const DOCUMENT_PRIMARY_CLASS_PRACTICE_TOOL = 'practice-aid/application-proxy';
/*
1.	Authoritative: White text on gray background
2.	Interpretive: White text on tan background
3.	Proposal: White text on blue background
4.	Other: White text on green background
*/
exports.DocumentTypesMap = {
    default: {
        searchType: 'Other',
        banner: { authorType: document_1.DOCUMENT_TYPE_BANNER_AUTHOR_TYPE.EMPTY, documentType: 'Other', color: document_1.COLORS.GREEN },
    },
    byAuthor: {
        [document_1.AUTHORS.ARM]: {
            default: {
                // default primary class (most popular) - 'explanation/explanation'
                searchType: 'Interpretations and Analysis',
                banner: { authorType: 'ARM', documentType: 'Interpretive', color: document_1.COLORS.TAN_DEEP },
            },
            byPrimaryClass: {
                [DOCUMENT_PRIMARY_CLASS_EXPLANATION]: {
                    byBook: {
                        'Project Updates': {
                            default: {
                                searchType: 'Other',
                                banner: {
                                    authorType: document_1.DOCUMENT_TYPE_BANNER_AUTHOR_TYPE.ARM,
                                    documentType: 'Other',
                                    color: document_1.COLORS.GREEN,
                                },
                            },
                        },
                        'SEC Practice': {
                            default: {
                                searchType: 'Interpretations and Analysis',
                                banner: {
                                    authorType: document_1.DOCUMENT_TYPE_BANNER_AUTHOR_TYPE.SEC,
                                    documentType: 'Interpretive',
                                    color: document_1.COLORS.TAN,
                                },
                            },
                        },
                    },
                },
                [DOCUMENT_PRIMARY_CLASS_AUTHORITATIVE_RULES]: {
                    byBook: {
                        'SEC Practice': {
                            default: {
                                searchType: 'Authoritative',
                                banner: {
                                    authorType: document_1.DOCUMENT_TYPE_BANNER_AUTHOR_TYPE.SEC,
                                    documentType: 'Authoritative',
                                    color: document_1.COLORS.GRAY,
                                },
                            },
                        },
                    },
                },
                [DOCUMENT_PRIMARY_CLASS_PENDING_LEGISTLATION]: {
                    byBook: {
                        'SEC Practice': {
                            default: {
                                searchType: 'Proposals',
                                banner: {
                                    authorType: document_1.DOCUMENT_TYPE_BANNER_AUTHOR_TYPE.SEC,
                                    documentType: 'Proposal',
                                    color: document_1.COLORS.BLUE,
                                },
                            },
                        },
                    },
                },
                [DOCUMENT_PRIMARY_CLASS_RULING]: {
                    byBook: {
                        'SEC Practice': {
                            default: {
                                searchType: 'Other',
                                banner: {
                                    authorType: document_1.DOCUMENT_TYPE_BANNER_AUTHOR_TYPE.SEC,
                                    documentType: 'Other',
                                    color: document_1.COLORS.GREEN,
                                },
                            },
                        },
                    },
                },
            },
        },
        [document_1.AUTHORS.AICPA]: {
            default: {
                // default primary class - 'authoritative-rules-procedures/rule'
                searchType: 'Authoritative',
                banner: { authorType: 'AICPA', documentType: 'Authoritative', color: document_1.COLORS.GRAY },
            },
            byPrimaryClass: {
                [DOCUMENT_PRIMARY_CLASS_EXPLANATION]: {
                    default: {
                        searchType: 'Other',
                        banner: { authorType: 'AICPA', documentType: 'Other', color: document_1.COLORS.GREEN },
                    },
                    byBook: {
                        'Best Practices in Presentation and Disclosure': {
                            default: {
                                searchType: 'Interpretations and Analysis',
                                banner: { authorType: 'AICPA', documentType: 'Interpretive', color: document_1.COLORS.TAN },
                            },
                        },
                        'Audit and Accounting Guides and Risk Alerts Archive': {
                            default: {
                                searchType: 'Other',
                                banner: { authorType: 'AICPA', documentType: 'Authoritative', color: document_1.COLORS.GRAY },
                            },
                        },
                        'Practice Bulletins (PB) Archive': {
                            default: {
                                searchType: 'Other',
                                banner: { authorType: 'AICPA', documentType: 'Authoritative', color: document_1.COLORS.GRAY },
                            },
                        },
                        'Practice Alerts': {
                            default: {
                                searchType: 'Interpretations and Analysis',
                                banner: { authorType: 'AICPA', documentType: 'Interpretive', color: document_1.COLORS.TAN },
                            },
                        },
                        'AICPA Audit Committee Toolkit Public Companies': {
                            default: {
                                searchType: document_1.DOCUMENT_SEARCH_TYPES.INTERPRETATIONS_AND_ANALYSIS,
                                banner: {
                                    authorType: document_1.DOCUMENT_TYPE_BANNER_AUTHOR_TYPE.AICPA,
                                    documentType: 'Interpretive',
                                    color: document_1.COLORS.TAN,
                                },
                            },
                        },
                    },
                },
                [DOCUMENT_PRIMARY_CLASS_PENDING_LEGISTLATION]: {
                    default: {
                        searchType: 'Proposals',
                        banner: { authorType: 'AICPA', documentType: 'Proposal', color: document_1.COLORS.BLUE },
                    },
                    byBook: {
                        'COSO Proposal Stage Literature': {
                            default: {
                                searchType: document_1.DOCUMENT_SEARCH_TYPES.PROPOSALS,
                                banner: {
                                    authorType: document_1.DOCUMENT_TYPE_BANNER_AUTHOR_TYPE.COSO,
                                    documentType: 'Proposal',
                                    color: document_1.COLORS.BLUE,
                                },
                            },
                        },
                    },
                },
            },
        },
        [document_1.AUTHORS.COSO]: {
            default: {
                searchType: document_1.DOCUMENT_SEARCH_TYPES.OTHER,
                banner: { authorType: 'COSO', documentType: 'Other', color: document_1.COLORS.GREEN },
            },
            byPrimaryClass: {
                [DOCUMENT_PRIMARY_CLASS_PENDING_LEGISTLATION]: {
                    default: {
                        searchType: 'Proposals',
                        banner: { authorType: 'AICPA', documentType: 'Proposal', color: document_1.COLORS.BLUE },
                    },
                    byBook: {
                        'COSO Proposal Stage Literature': {
                            default: {
                                searchType: document_1.DOCUMENT_SEARCH_TYPES.PROPOSALS,
                                banner: {
                                    authorType: document_1.DOCUMENT_TYPE_BANNER_AUTHOR_TYPE.COSO,
                                    documentType: 'Proposal',
                                    color: document_1.COLORS.BLUE,
                                },
                            },
                        },
                    },
                },
                [DOCUMENT_PRIMARY_CLASS_AUTHORITATIVE_RULES]: {
                    default: {
                        searchType: 'Authoritative',
                        banner: {
                            authorType: document_1.DOCUMENT_TYPE_BANNER_AUTHOR_TYPE.COSO,
                            documentType: 'Authoritative',
                            color: document_1.COLORS.GRAY,
                        },
                    },
                    byBook: {
                        'AICPA Other Publications': {
                            default: {
                                searchType: 'Authoritative',
                                banner: { authorType: 'AICPA', documentType: 'Authoritative', color: document_1.COLORS.GRAY },
                            },
                        },
                    },
                },
            },
        },
        [document_1.AUTHORS.IASB]: {
            default: {
                // default primary class (most popular) - 'explanation/explanation'
                // and 'authoritative-rules-procedures/rule'
                searchType: 'Other',
                banner: { authorType: 'IASB', documentType: 'Other', color: document_1.COLORS.GREEN },
            },
            byPrimaryClass: {
                [DOCUMENT_PRIMARY_CLASS_EXPLANATION]: {
                    byBook: {
                        'International Financial Reporting Interpretations Committee Superseded': {
                            default: {
                                searchType: 'Other',
                                banner: { authorType: 'IASB', documentType: 'Authoritative', color: document_1.COLORS.GRAY },
                            },
                        },
                    },
                },
                [DOCUMENT_PRIMARY_CLASS_PENDING_LEGISTLATION]: {
                    default: {
                        searchType: 'Proposals',
                        banner: { authorType: 'IASB', documentType: 'Proposal', color: document_1.COLORS.BLUE },
                    },
                    byBook: {
                        'AICPA Proposal Stage Literature': {
                            default: {
                                searchType: 'Proposals',
                                banner: { authorType: 'AICPA', documentType: 'Proposal', color: document_1.COLORS.BLUE },
                            },
                        },
                        'COSO Proposal Stage Literature': {
                            default: {
                                searchType: document_1.DOCUMENT_SEARCH_TYPES.PROPOSALS,
                                banner: {
                                    authorType: document_1.DOCUMENT_TYPE_BANNER_AUTHOR_TYPE.COSO,
                                    documentType: 'Proposal',
                                    color: document_1.COLORS.BLUE,
                                },
                            },
                        },
                    },
                },
                [DOCUMENT_PRIMARY_CLASS_AUTHORITATIVE_RULES]: {
                    default: {
                        searchType: 'Authoritative',
                        banner: { authorType: 'IASB', documentType: 'Authoritative', color: document_1.COLORS.GRAY },
                    },
                },
            },
        },
        [document_1.AUTHORS.GASB]: {
            default: {
                // default primary class - 'authoritative-rules-procedures/rule'
                searchType: document_1.DOCUMENT_SEARCH_TYPES.AUTHORITATIVE,
                banner: {
                    authorType: document_1.DOCUMENT_TYPE_BANNER_AUTHOR_TYPE.GASB,
                    documentType: 'Authoritative',
                    color: document_1.COLORS.GRAY,
                },
            },
            byPrimaryClass: {
                [DOCUMENT_PRIMARY_CLASS_AUTHORITATIVE_RULES]: {
                    byBook: {
                        'AICPA Other Publications': {
                            default: {
                                searchType: document_1.DOCUMENT_SEARCH_TYPES.AUTHORITATIVE,
                                banner: {
                                    authorType: document_1.DOCUMENT_TYPE_BANNER_AUTHOR_TYPE.AICPA,
                                    documentType: 'Authoritative',
                                    color: document_1.COLORS.GRAY,
                                },
                            },
                        },
                    },
                },
                [DOCUMENT_PRIMARY_CLASS_EXPLANATION]: {
                    default: {
                        searchType: document_1.DOCUMENT_SEARCH_TYPES.OTHER,
                        banner: {
                            authorType: document_1.DOCUMENT_TYPE_BANNER_AUTHOR_TYPE.GASB,
                            documentType: 'Other',
                            color: document_1.COLORS.GREEN,
                        },
                    },
                },
                [DOCUMENT_PRIMARY_CLASS_PENDING_LEGISTLATION]: {
                    default: {
                        searchType: document_1.DOCUMENT_SEARCH_TYPES.PROPOSALS,
                        banner: {
                            authorType: document_1.DOCUMENT_TYPE_BANNER_AUTHOR_TYPE.GASB,
                            documentType: 'Proposal',
                            color: document_1.COLORS.BLUE,
                        },
                    },
                },
            },
        },
        [document_1.AUTHORS.FASB]: {
            default: {
                // default primary class - no such class
                searchType: 'Other',
                banner: { authorType: 'FASB', documentType: 'Other', color: document_1.COLORS.GREEN },
            },
            byPrimaryClass: {
                [DOCUMENT_PRIMARY_CLASS_AUTHORITATIVE_RULES]: {
                    default: {
                        searchType: 'Authoritative',
                        banner: { authorType: 'FASB', documentType: 'Authoritative', color: document_1.COLORS.GRAY },
                    },
                },
                [DOCUMENT_PRIMARY_CLASS_PENDING_LEGISTLATION]: {
                    default: {
                        searchType: 'Proposals',
                        banner: { authorType: 'FASB', documentType: 'Proposal', color: document_1.COLORS.BLUE_SHADE },
                    },
                },
                [DOCUMENT_PRIMARY_CLASS_EXPLANATION_GLOSSARY]: {
                    default: {
                        searchType: 'Glossary',
                        banner: { authorType: 'FASB', documentType: 'Glossary', color: document_1.COLORS.GRAY },
                    },
                },
            },
        },
        [document_1.AUTHORS.PCAOB]: {
            default: {
                // default primary class - authoritative-rules-procedures/rule
                searchType: document_1.DOCUMENT_SEARCH_TYPES.AUTHORITATIVE,
                banner: {
                    authorType: document_1.DOCUMENT_TYPE_BANNER_AUTHOR_TYPE.PCAOB,
                    documentType: 'Authoritative',
                    color: document_1.COLORS.GRAY,
                },
            },
            byPrimaryClass: {
                [DOCUMENT_PRIMARY_CLASS_PENDING_LEGISTLATION]: {
                    default: {
                        searchType: document_1.DOCUMENT_SEARCH_TYPES.PROPOSALS,
                        banner: {
                            authorType: document_1.DOCUMENT_TYPE_BANNER_AUTHOR_TYPE.PCAOB,
                            documentType: 'Proposal',
                            color: document_1.COLORS.BLUE,
                        },
                    },
                },
                [DOCUMENT_PRIMARY_CLASS_EXPLANATION]: {
                    default: {
                        searchType: document_1.DOCUMENT_SEARCH_TYPES.INTERPRETATIONS_AND_ANALYSIS,
                        banner: {
                            authorType: document_1.DOCUMENT_TYPE_BANNER_AUTHOR_TYPE.PCAOB,
                            documentType: 'Interpretive',
                            color: document_1.COLORS.TAN,
                        },
                    },
                },
            },
        },
        [document_1.AUTHORS.GAO]: {
            default: {
                // default primary class - authoritative-rules-procedures/rule
                searchType: document_1.DOCUMENT_SEARCH_TYPES.AUTHORITATIVE,
                banner: {
                    authorType: document_1.DOCUMENT_TYPE_BANNER_AUTHOR_TYPE.GAO,
                    documentType: 'Authoritative',
                    color: document_1.COLORS.GRAY,
                },
            },
        },
        [document_1.AUTHORS.HUD]: {
            default: {
                // default primary class - authoritative-rules-procedures/rule
                searchType: document_1.DOCUMENT_SEARCH_TYPES.AUTHORITATIVE,
                banner: {
                    authorType: document_1.DOCUMENT_TYPE_BANNER_AUTHOR_TYPE.HUD,
                    documentType: 'Authoritative',
                    color: document_1.COLORS.GRAY,
                },
            },
            byPrimaryClass: {
                [DOCUMENT_PRIMARY_CLASS_EXPLANATION]: {
                    default: {
                        searchType: document_1.DOCUMENT_SEARCH_TYPES.OTHER,
                        banner: {
                            authorType: document_1.DOCUMENT_TYPE_BANNER_AUTHOR_TYPE.HUD,
                            documentType: 'Other',
                            color: document_1.COLORS.GREEN,
                        },
                    },
                },
            },
        },
        [document_1.AUTHORS.OMB]: {
            default: {
                // default primary class - authoritative-rules-procedures/rule
                searchType: document_1.DOCUMENT_SEARCH_TYPES.AUTHORITATIVE,
                banner: {
                    authorType: document_1.DOCUMENT_TYPE_BANNER_AUTHOR_TYPE.OMB,
                    documentType: 'Authoritative',
                    color: document_1.COLORS.GRAY,
                },
            },
        },
        [document_1.AUTHORS.PCIE]: {
            default: {
                // default primary class - authoritative-rules-procedures/rule
                searchType: document_1.DOCUMENT_SEARCH_TYPES.AUTHORITATIVE,
                banner: {
                    authorType: document_1.DOCUMENT_TYPE_BANNER_AUTHOR_TYPE.PCIE,
                    documentType: 'Authoritative',
                    color: document_1.COLORS.GRAY,
                },
            },
        },
        [document_1.AUTHORS.IIA]: {
            default: {
                // default primary class - authoritative-rules-procedures/rule
                searchType: document_1.DOCUMENT_SEARCH_TYPES.AUTHORITATIVE,
                banner: {
                    authorType: document_1.DOCUMENT_TYPE_BANNER_AUTHOR_TYPE.IIA,
                    documentType: 'Authoritative',
                    color: document_1.COLORS.GRAY,
                },
            },
            byPrimaryClass: {
                [DOCUMENT_PRIMARY_CLASS_EXPLANATION]: {
                    default: {
                        searchType: document_1.DOCUMENT_SEARCH_TYPES.INTERPRETATIONS_AND_ANALYSIS,
                        banner: {
                            authorType: document_1.DOCUMENT_TYPE_BANNER_AUTHOR_TYPE.IIA,
                            documentType: 'Interpretive',
                            color: document_1.COLORS.TAN,
                        },
                    },
                },
            },
        },
        [document_1.AUTHORS.GFOA]: {
            default: {
                // default primary class - authoritative-rules-procedures/rule
                searchType: document_1.DOCUMENT_SEARCH_TYPES.AUTHORITATIVE,
                banner: {
                    authorType: document_1.DOCUMENT_TYPE_BANNER_AUTHOR_TYPE.GFOA,
                    documentType: 'Authoritative',
                    color: document_1.COLORS.GRAY,
                },
            },
        },
    },
    byPrimaryClass: {
        [DOCUMENT_PRIMARY_CLASS_TOPIC]: {
            default: {
                searchType: 'ARM® Topics A-Z',
                banner: {
                // no banner for topics
                },
            },
        },
        [DOCUMENT_PRIMARY_CLASS_PRACTICE_TOOL]: {
            default: {
                searchType: 'Practice Tool',
                banner: {
                // no banner
                },
            },
        },
        [DOCUMENT_PRIMARY_CLASS_EXPLANATION]: {
            byAuthor: {
                // empty author metadata
                '': {
                    byBook: {
                        Wiley: {
                            default: {
                                searchType: document_1.DOCUMENT_SEARCH_TYPES.INTERPRETATIONS_AND_ANALYSIS,
                                banner: {
                                    authorType: document_1.DOCUMENT_TYPE_BANNER_AUTHOR_TYPE.EMPTY,
                                    documentType: 'Interpretive',
                                    color: document_1.COLORS.TAN,
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};
//# sourceMappingURL=TypeIndicator.data.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expectedTestResults = exports.mockData = void 0;
const document_type_constants_1 = require("../document-type.constants");
exports.mockData = {
    searchDocumentWithMetadata: [
        {
            id: 'DEFAULT',
            extendedMetadata: {
                objects: [
                    {
                        name: 'primary-class',
                        value: '<super-class super-class="test"></super-class><sub-class sub-class="test"></sub-class>',
                        attributes: [],
                    },
                    {
                        name: 'pubvol',
                        value: 'armac013',
                        attributes: [],
                    },
                    {
                        name: 'pcicore:isIssuedBy',
                        value: null,
                        attributes: [
                            {
                                key: 'foaf:name',
                                value: 'DEFAULT_AUTHOR',
                            },
                        ],
                    },
                    {
                        name: 'pcicore:isInPublication',
                        value: null,
                        attributes: [
                            {
                                key: 'skos:prefLabel',
                                value: 'DEFAULT_BOOK',
                            },
                        ],
                    },
                ],
                groups: [],
            },
        },
        {
            id: 'DOCUMENT_PRIMARY_CLASS_TOPIC',
            extendedMetadata: {
                objects: [
                    {
                        name: 'primary-class',
                        value: '<super-class super-class="topical-landing-page"></super-class><sub-class sub-class="arm-topical-landing-page"></sub-class>',
                        attributes: [],
                    },
                    {
                        name: 'pubvol',
                        value: 'armac013',
                        attributes: [],
                    },
                    {
                        name: 'pcicore:isIssuedBy',
                        value: null,
                        attributes: [
                            {
                                key: 'foaf:name',
                                value: 'DOCUMENT_PRIMARY_CLASS_TOPIC_AUTHOR',
                            },
                        ],
                    },
                    {
                        name: 'pcicore:isInPublication',
                        value: null,
                        attributes: [
                            {
                                key: 'skos:prefLabel',
                                value: 'DOCUMENT_PRIMARY_CLASS_TOPIC_BOOK',
                            },
                        ],
                    },
                ],
                groups: [],
            },
        },
        {
            id: 'DOCUMENT_PRIMARY_CLASS_PRACTICE_TOOL',
            extendedMetadata: {
                objects: [
                    {
                        name: 'primary-class',
                        value: '<super-class super-class="practice-aid"></super-class><sub-class sub-class="application-proxy"></sub-class>',
                        attributes: [],
                    },
                    {
                        name: 'pubvol',
                        value: 'armac013',
                        attributes: [],
                    },
                    {
                        name: 'pcicore:isIssuedBy',
                        value: null,
                        attributes: [
                            {
                                key: 'foaf:name',
                                value: 'DOCUMENT_PRIMARY_CLASS_PRACTICE_TOOL_AUTHOR',
                            },
                        ],
                    },
                    {
                        name: 'pcicore:isInPublication',
                        value: null,
                        attributes: [
                            {
                                key: 'skos:prefLabel',
                                value: 'DOCUMENT_PRIMARY_CLASS_PRACTICE_TOOL_BOOK',
                            },
                        ],
                    },
                ],
                groups: [],
            },
        },
        {
            id: 'DOCUMENT_AUTHOR_ARM_DEFAULT',
            extendedMetadata: {
                objects: [
                    {
                        name: 'primary-class',
                        value: '<super-class super-class="test"></super-class><sub-class sub-class="test"></sub-class>',
                        attributes: [],
                    },
                    {
                        name: 'pubvol',
                        value: 'armac013',
                        attributes: [],
                    },
                    {
                        name: 'pcicore:isIssuedBy',
                        value: null,
                        attributes: [
                            {
                                key: 'foaf:name',
                                value: 'Accounting Research Manager',
                            },
                        ],
                    },
                    {
                        name: 'pcicore:isInPublication',
                        value: null,
                        attributes: [
                            {
                                key: 'skos:prefLabel',
                                value: 'DOCUMENT_AUTHOR_ARM_DEFAULT_BOOK',
                            },
                        ],
                    },
                ],
                groups: [],
            },
        },
        {
            id: 'DOCUMENT_AUTHOR_ARM_EXPLANATION_PROJECT_UPDATES',
            extendedMetadata: {
                objects: [
                    {
                        name: 'primary-class',
                        value: '<super-class super-class="explanation"></super-class><sub-class sub-class="explanation"></sub-class>',
                        attributes: [],
                    },
                    {
                        name: 'pubvol',
                        value: 'armac013',
                        attributes: [],
                    },
                    {
                        name: 'pcicore:isIssuedBy',
                        value: null,
                        attributes: [
                            {
                                key: 'foaf:name',
                                value: 'Accounting Research Manager',
                            },
                        ],
                    },
                    {
                        name: 'pcicore:isInPublication',
                        value: null,
                        attributes: [
                            {
                                key: 'skos:prefLabel',
                                value: 'Project Updates',
                            },
                        ],
                    },
                ],
                groups: [],
            },
        },
        {
            id: 'DOCUMENT_AUTHOR_ARM_EXPLANATION_SEC_PRACTICE',
            extendedMetadata: {
                objects: [
                    {
                        name: 'primary-class',
                        value: '<super-class super-class="explanation"></super-class><sub-class sub-class="explanation"></sub-class>',
                        attributes: [],
                    },
                    {
                        name: 'pubvol',
                        value: 'armac013',
                        attributes: [],
                    },
                    {
                        name: 'pcicore:isIssuedBy',
                        value: null,
                        attributes: [
                            {
                                key: 'foaf:name',
                                value: 'Accounting Research Manager',
                            },
                        ],
                    },
                    {
                        name: 'pcicore:isInPublication',
                        value: null,
                        attributes: [
                            {
                                key: 'skos:prefLabel',
                                value: 'SEC Practice',
                            },
                        ],
                    },
                ],
                groups: [],
            },
        },
        {
            id: 'DOCUMENT_AUTHOR_ARM_AUTHORITATIVE_RULES_SEC_PRACTICE',
            extendedMetadata: {
                objects: [
                    {
                        name: 'primary-class',
                        value: '<super-class super-class="authoritative-rules-procedures"></super-class><sub-class sub-class="rule"></sub-class>',
                        attributes: [],
                    },
                    {
                        name: 'pubvol',
                        value: 'armac013',
                        attributes: [],
                    },
                    {
                        name: 'pcicore:isIssuedBy',
                        value: null,
                        attributes: [
                            {
                                key: 'foaf:name',
                                value: 'Accounting Research Manager',
                            },
                        ],
                    },
                    {
                        name: 'pcicore:isInPublication',
                        value: null,
                        attributes: [
                            {
                                key: 'skos:prefLabel',
                                value: 'SEC Practice',
                            },
                        ],
                    },
                ],
                groups: [],
            },
        },
        {
            id: 'DOCUMENT_AUTHOR_ARM_PENDING_LEGISTLATION_SEC_PRACTICE',
            extendedMetadata: {
                objects: [
                    {
                        name: 'primary-class',
                        value: '<super-class super-class="pending-legislation"></super-class><sub-class sub-class="pending-legislation"></sub-class>',
                        attributes: [],
                    },
                    {
                        name: 'pubvol',
                        value: 'armac013',
                        attributes: [],
                    },
                    {
                        name: 'pcicore:isIssuedBy',
                        value: null,
                        attributes: [
                            {
                                key: 'foaf:name',
                                value: 'Accounting Research Manager',
                            },
                        ],
                    },
                    {
                        name: 'pcicore:isInPublication',
                        value: null,
                        attributes: [
                            {
                                key: 'skos:prefLabel',
                                value: 'SEC Practice',
                            },
                        ],
                    },
                ],
                groups: [],
            },
        },
        {
            id: 'DOCUMENT_AUTHOR_ARM_RULING_SEC_PRACTICE',
            extendedMetadata: {
                objects: [
                    {
                        name: 'primary-class',
                        value: '<super-class super-class="ruling"></super-class><sub-class sub-class="ruling"></sub-class>',
                        attributes: [],
                    },
                    {
                        name: 'pubvol',
                        value: 'armac013',
                        attributes: [],
                    },
                    {
                        name: 'pcicore:isIssuedBy',
                        value: null,
                        attributes: [
                            {
                                key: 'foaf:name',
                                value: 'Accounting Research Manager',
                            },
                        ],
                    },
                    {
                        name: 'pcicore:isInPublication',
                        value: null,
                        attributes: [
                            {
                                key: 'skos:prefLabel',
                                value: 'SEC Practice',
                            },
                        ],
                    },
                ],
                groups: [],
            },
        },
        {
            id: 'DOCUMENT_AUTHOR_AICPA_DEFAULT',
            extendedMetadata: {
                objects: [
                    {
                        name: 'primary-class',
                        value: '<super-class super-class="test"></super-class><sub-class sub-class="test"></sub-class>',
                        attributes: [],
                    },
                    {
                        name: 'pubvol',
                        value: 'armac013',
                        attributes: [],
                    },
                    {
                        name: 'pcicore:isIssuedBy',
                        value: null,
                        attributes: [
                            {
                                key: 'foaf:name',
                                value: 'AICPA - American Institute of Certified Public Accountants',
                            },
                        ],
                    },
                    {
                        name: 'pcicore:isInPublication',
                        value: null,
                        attributes: [
                            {
                                key: 'skos:prefLabel',
                                value: 'DOCUMENT_AUTHOR_AICPA_DEFAULT_BOOK',
                            },
                        ],
                    },
                ],
                groups: [],
            },
        },
        {
            id: 'DOCUMENT_AUTHOR_AICPA_EXPLANATION_DEFAULT_BOOK',
            extendedMetadata: {
                objects: [
                    {
                        name: 'primary-class',
                        value: '<super-class super-class="explanation"></super-class><sub-class sub-class="explanation"></sub-class>',
                        attributes: [],
                    },
                    {
                        name: 'pubvol',
                        value: 'armac013',
                        attributes: [],
                    },
                    {
                        name: 'pcicore:isIssuedBy',
                        value: null,
                        attributes: [
                            {
                                key: 'foaf:name',
                                value: 'AICPA - American Institute of Certified Public Accountants',
                            },
                        ],
                    },
                    {
                        name: 'pcicore:isInPublication',
                        value: null,
                        attributes: [
                            {
                                key: 'skos:prefLabel',
                                value: 'DOCUMENT_AUTHOR_AICPA_EXPLANATION_DEFAULT_BOOK',
                            },
                        ],
                    },
                ],
                groups: [],
            },
        },
        {
            id: 'DOCUMENT_AUTHOR_AICPA_EXPLANATION_BEST_PRACTICES',
            extendedMetadata: {
                objects: [
                    {
                        name: 'primary-class',
                        value: '<super-class super-class="explanation"></super-class><sub-class sub-class="explanation"></sub-class>',
                        attributes: [],
                    },
                    {
                        name: 'pubvol',
                        value: 'armac013',
                        attributes: [],
                    },
                    {
                        name: 'pcicore:isIssuedBy',
                        value: null,
                        attributes: [
                            {
                                key: 'foaf:name',
                                value: 'AICPA - American Institute of Certified Public Accountants',
                            },
                        ],
                    },
                    {
                        name: 'pcicore:isInPublication',
                        value: null,
                        attributes: [
                            {
                                key: 'skos:prefLabel',
                                value: 'Best Practices in Presentation and Disclosure',
                            },
                        ],
                    },
                ],
                groups: [],
            },
        },
        {
            id: 'DOCUMENT_AUTHOR_AICPA_EXPLANATION_AUDIT_AND_ACCOUNTING',
            extendedMetadata: {
                objects: [
                    {
                        name: 'primary-class',
                        value: '<super-class super-class="explanation"></super-class><sub-class sub-class="explanation"></sub-class>',
                        attributes: [],
                    },
                    {
                        name: 'pubvol',
                        value: 'armac013',
                        attributes: [],
                    },
                    {
                        name: 'pcicore:isIssuedBy',
                        value: null,
                        attributes: [
                            {
                                key: 'foaf:name',
                                value: 'AICPA - American Institute of Certified Public Accountants',
                            },
                        ],
                    },
                    {
                        name: 'pcicore:isInPublication',
                        value: null,
                        attributes: [
                            {
                                key: 'skos:prefLabel',
                                value: 'Audit and Accounting Guides and Risk Alerts Archive',
                            },
                        ],
                    },
                ],
                groups: [],
            },
        },
        {
            id: 'DOCUMENT_AUTHOR_AICPA_EXPLANATION_PRACTICE_BULLETINS',
            extendedMetadata: {
                objects: [
                    {
                        name: 'primary-class',
                        value: '<super-class super-class="explanation"></super-class><sub-class sub-class="explanation"></sub-class>',
                        attributes: [],
                    },
                    {
                        name: 'pubvol',
                        value: 'armac013',
                        attributes: [],
                    },
                    {
                        name: 'pcicore:isIssuedBy',
                        value: null,
                        attributes: [
                            {
                                key: 'foaf:name',
                                value: 'AICPA - American Institute of Certified Public Accountants',
                            },
                        ],
                    },
                    {
                        name: 'pcicore:isInPublication',
                        value: null,
                        attributes: [
                            {
                                key: 'skos:prefLabel',
                                value: 'Practice Bulletins (PB) Archive',
                            },
                        ],
                    },
                ],
                groups: [],
            },
        },
        {
            id: 'DOCUMENT_AUTHOR_AICPA_PENDING_LEGISTLATION_DEFAULT_BOOK',
            extendedMetadata: {
                objects: [
                    {
                        name: 'primary-class',
                        value: '<super-class super-class="pending-legislation"></super-class><sub-class sub-class="pending-legislation"></sub-class>',
                        attributes: [],
                    },
                    {
                        name: 'pubvol',
                        value: 'armac013',
                        attributes: [],
                    },
                    {
                        name: 'pcicore:isIssuedBy',
                        value: null,
                        attributes: [
                            {
                                key: 'foaf:name',
                                value: 'AICPA - American Institute of Certified Public Accountants',
                            },
                        ],
                    },
                    {
                        name: 'pcicore:isInPublication',
                        value: null,
                        attributes: [
                            {
                                key: 'skos:prefLabel',
                                value: 'DOCUMENT_AUTHOR_AICPA_PENDING_LEGISTLATION_DEFAULT_BOOK',
                            },
                        ],
                    },
                ],
                groups: [],
            },
        },
        {
            id: 'DOCUMENT_AUTHOR_AICPA_AUTHORITATIVE_RULES_DEFAULT_BOOK',
            extendedMetadata: {
                objects: [
                    {
                        name: 'primary-class',
                        value: '<super-class super-class="authoritative-rules-procedures"></super-class><sub-class sub-class="rule"></sub-class>',
                        attributes: [],
                    },
                    {
                        name: 'pubvol',
                        value: 'armac013',
                        attributes: [],
                    },
                    {
                        name: 'pcicore:isIssuedBy',
                        value: null,
                        attributes: [
                            {
                                key: 'foaf:name',
                                value: 'AICPA - American Institute of Certified Public Accountants',
                            },
                        ],
                    },
                    {
                        name: 'pcicore:isInPublication',
                        value: null,
                        attributes: [
                            {
                                key: 'skos:prefLabel',
                                value: 'DOCUMENT_AUTHOR_AICPA_AUTHORITATIVE_RULES_DEFAULT_BOOK',
                            },
                        ],
                    },
                ],
                groups: [],
            },
        },
        {
            id: 'DOCUMENT_AUTHOR_COSO_DEFAULT',
            extendedMetadata: {
                objects: [
                    {
                        name: 'primary-class',
                        value: '<super-class super-class="test"></super-class><sub-class sub-class="test"></sub-class>',
                        attributes: [],
                    },
                    {
                        name: 'pubvol',
                        value: 'armac013',
                        attributes: [],
                    },
                    {
                        name: 'pcicore:isIssuedBy',
                        value: null,
                        attributes: [
                            {
                                key: 'foaf:name',
                                value: 'COSO - Committee of Sponsoring Organizations of the Treadway Commission',
                            },
                        ],
                    },
                    {
                        name: 'pcicore:isInPublication',
                        value: null,
                        attributes: [
                            {
                                key: 'skos:prefLabel',
                                value: 'DOCUMENT_AUTHOR_AICPA_PENDING_LEGISTLATION_DEFAULT_BOOK',
                            },
                        ],
                    },
                ],
                groups: [],
            },
        },
        {
            id: 'DOCUMENT_AUTHOR_COSO_PENDING_LEGISTLATION_DEFAULT_BOOK',
            extendedMetadata: {
                objects: [
                    {
                        name: 'primary-class',
                        value: '<super-class super-class="pending-legislation"></super-class><sub-class sub-class="pending-legislation"></sub-class>',
                        attributes: [],
                    },
                    {
                        name: 'pubvol',
                        value: 'armac013',
                        attributes: [],
                    },
                    {
                        name: 'pcicore:isIssuedBy',
                        value: null,
                        attributes: [
                            {
                                key: 'foaf:name',
                                value: 'COSO - Committee of Sponsoring Organizations of the Treadway Commission',
                            },
                        ],
                    },
                    {
                        name: 'pcicore:isInPublication',
                        value: null,
                        attributes: [
                            {
                                key: 'skos:prefLabel',
                                value: 'DOCUMENT_AUTHOR_COSO_PENDING_LEGISTLATION_DEFAULT_BOOK',
                            },
                        ],
                    },
                ],
                groups: [],
            },
        },
        {
            id: 'DOCUMENT_AUTHOR_COSO_AUTHORITATIVE_RULES_DEFAULT_BOOK',
            extendedMetadata: {
                objects: [
                    {
                        name: 'primary-class',
                        value: '<super-class super-class="authoritative-rules-procedures"></super-class><sub-class sub-class="rule"></sub-class>',
                        attributes: [],
                    },
                    {
                        name: 'pubvol',
                        value: 'armac013',
                        attributes: [],
                    },
                    {
                        name: 'pcicore:isIssuedBy',
                        value: null,
                        attributes: [
                            {
                                key: 'foaf:name',
                                value: 'COSO - Committee of Sponsoring Organizations of the Treadway Commission',
                            },
                        ],
                    },
                    {
                        name: 'pcicore:isInPublication',
                        value: null,
                        attributes: [
                            {
                                key: 'skos:prefLabel',
                                value: 'DOCUMENT_AUTHOR_COSO_AUTHORITATIVE_RULES_DEFAULT_BOOK',
                            },
                        ],
                    },
                ],
                groups: [],
            },
        },
        {
            id: 'DOCUMENT_AUTHOR_IASB_DEFAULT',
            extendedMetadata: {
                objects: [
                    {
                        name: 'primary-class',
                        value: '<super-class super-class="test"></super-class><sub-class sub-class="test"></sub-class>',
                        attributes: [],
                    },
                    {
                        name: 'pubvol',
                        value: 'armac013',
                        attributes: [],
                    },
                    {
                        name: 'pcicore:isIssuedBy',
                        value: null,
                        attributes: [
                            {
                                key: 'foaf:name',
                                value: 'IASB - International Accounting Standards Board',
                            },
                        ],
                    },
                    {
                        name: 'pcicore:isInPublication',
                        value: null,
                        attributes: [
                            {
                                key: 'skos:prefLabel',
                                value: 'DOCUMENT_AUTHOR_IASB_DEFAULT_BOOK',
                            },
                        ],
                    },
                ],
                groups: [],
            },
        },
        {
            id: 'DOCUMENT_AUTHOR_IASB_EXPLANATION_IFRICS_BOOK',
            extendedMetadata: {
                objects: [
                    {
                        name: 'primary-class',
                        value: '<super-class super-class="explanation"></super-class><sub-class sub-class="explanation"></sub-class>',
                        attributes: [],
                    },
                    {
                        name: 'pubvol',
                        value: 'armac013',
                        attributes: [],
                    },
                    {
                        name: 'pcicore:isIssuedBy',
                        value: null,
                        attributes: [
                            {
                                key: 'foaf:name',
                                value: 'IASB - International Accounting Standards Board',
                            },
                        ],
                    },
                    {
                        name: 'pcicore:isInPublication',
                        value: null,
                        attributes: [
                            {
                                key: 'skos:prefLabel',
                                value: 'International Financial Reporting Interpretations Committee Superseded',
                            },
                        ],
                    },
                ],
                groups: [],
            },
        },
        {
            id: 'DOCUMENT_AUTHOR_IASB_PENDING_LEGISTLATION_DEFAULT_BOOK',
            extendedMetadata: {
                objects: [
                    {
                        name: 'primary-class',
                        value: '<super-class super-class="pending-legislation"></super-class><sub-class sub-class="pending-legislation"></sub-class>',
                        attributes: [],
                    },
                    {
                        name: 'pubvol',
                        value: 'armac013',
                        attributes: [],
                    },
                    {
                        name: 'pcicore:isIssuedBy',
                        value: null,
                        attributes: [
                            {
                                key: 'foaf:name',
                                value: 'IASB - International Accounting Standards Board',
                            },
                        ],
                    },
                    {
                        name: 'pcicore:isInPublication',
                        value: null,
                        attributes: [
                            {
                                key: 'skos:prefLabel',
                                value: 'DOCUMENT_AUTHOR_IASB_PENDING_LEGISTLATION_DEFAULT_BOOK',
                            },
                        ],
                    },
                ],
                groups: [],
            },
        },
        {
            id: 'DOCUMENT_AUTHOR_IASB_PENDING_LEGISTLATION_AICPA',
            extendedMetadata: {
                objects: [
                    {
                        name: 'primary-class',
                        value: '<super-class super-class="pending-legislation"></super-class><sub-class sub-class="pending-legislation"></sub-class>',
                        attributes: [],
                    },
                    {
                        name: 'pubvol',
                        value: 'armac013',
                        attributes: [],
                    },
                    {
                        name: 'pcicore:isIssuedBy',
                        value: null,
                        attributes: [
                            {
                                key: 'foaf:name',
                                value: 'IASB - International Accounting Standards Board',
                            },
                        ],
                    },
                    {
                        name: 'pcicore:isInPublication',
                        value: null,
                        attributes: [
                            {
                                key: 'skos:prefLabel',
                                value: 'AICPA Proposal Stage Literature',
                            },
                        ],
                    },
                ],
                groups: [],
            },
        },
        {
            id: 'DOCUMENT_AUTHOR_IASB_AUTHORITATIVE_RULES_DEFAULT_BOOK',
            extendedMetadata: {
                objects: [
                    {
                        name: 'primary-class',
                        value: '<super-class super-class="authoritative-rules-procedures"></super-class><sub-class sub-class="rule"></sub-class>',
                        attributes: [],
                    },
                    {
                        name: 'pubvol',
                        value: 'armac013',
                        attributes: [],
                    },
                    {
                        name: 'pcicore:isIssuedBy',
                        value: null,
                        attributes: [
                            {
                                key: 'foaf:name',
                                value: 'IASB - International Accounting Standards Board',
                            },
                        ],
                    },
                    {
                        name: 'pcicore:isInPublication',
                        value: null,
                        attributes: [
                            {
                                key: 'skos:prefLabel',
                                value: 'DOCUMENT_AUTHOR_IASB_AUTHORITATIVE_RULES_DEFAULT_BOOK',
                            },
                        ],
                    },
                ],
                groups: [],
            },
        },
        {
            id: 'DOCUMENT_AUTHOR_GASB_AUTHORITATIVE_RULES_DEFAULT_BOOK',
            extendedMetadata: {
                objects: [
                    {
                        name: 'primary-class',
                        value: '<super-class super-class="authoritative-rules-procedures"></super-class><sub-class sub-class="rule"></sub-class>',
                        attributes: [],
                    },
                    {
                        name: 'pubvol',
                        value: 'armac013',
                        attributes: [],
                    },
                    {
                        name: 'pcicore:isIssuedBy',
                        value: null,
                        attributes: [
                            {
                                key: 'foaf:name',
                                value: 'GASB - Government Accounting Standards Board',
                            },
                        ],
                    },
                    {
                        name: 'pcicore:isInPublication',
                        value: null,
                        attributes: [
                            {
                                key: 'skos:prefLabel',
                                value: 'DOCUMENT_AUTHOR_GASB_AUTHORITATIVE_RULES_DEFAULT_BOOK',
                            },
                        ],
                    },
                ],
                groups: [],
            },
        },
        {
            id: 'DOCUMENT_AUTHOR_FASB_DEFAULT',
            extendedMetadata: {
                objects: [
                    {
                        name: 'primary-class',
                        value: '<super-class super-class="test"></super-class><sub-class sub-class="test"></sub-class>',
                        attributes: [],
                    },
                    {
                        name: 'pubvol',
                        value: 'armac013',
                        attributes: [],
                    },
                    {
                        name: 'pcicore:isIssuedBy',
                        value: null,
                        attributes: [
                            {
                                key: 'foaf:name',
                                value: 'FASB - Financial Accounting Standards Board',
                            },
                        ],
                    },
                    {
                        name: 'pcicore:isInPublication',
                        value: null,
                        attributes: [
                            {
                                key: 'skos:prefLabel',
                                value: 'DOCUMENT_AUTHOR_FASB_DEFAULT',
                            },
                        ],
                    },
                ],
                groups: [],
            },
        },
        {
            id: 'DOCUMENT_AUTHOR_FASB_AUTHORITATIVE_RULES_DEFAULT_BOOK',
            extendedMetadata: {
                objects: [
                    {
                        name: 'primary-class',
                        value: '<super-class super-class="authoritative-rules-procedures"></super-class><sub-class sub-class="rule"></sub-class>',
                        attributes: [],
                    },
                    {
                        name: 'pubvol',
                        value: 'armac013',
                        attributes: [],
                    },
                    {
                        name: 'pcicore:isIssuedBy',
                        value: null,
                        attributes: [
                            {
                                key: 'foaf:name',
                                value: 'FASB - Financial Accounting Standards Board',
                            },
                        ],
                    },
                    {
                        name: 'pcicore:isInPublication',
                        value: null,
                        attributes: [
                            {
                                key: 'skos:prefLabel',
                                value: 'DOCUMENT_AUTHOR_FASB_AUTHORITATIVE_RULES_DEFAULT_BOOK',
                            },
                        ],
                    },
                ],
                groups: [],
            },
        },
        {
            id: 'DOCUMENT_AUTHOR_FASB_PENDING_LEGISTLATION_DEFAULT_BOOK',
            extendedMetadata: {
                objects: [
                    {
                        name: 'primary-class',
                        value: '<super-class super-class="pending-legislation"></super-class><sub-class sub-class="pending-legislation"></sub-class>',
                        attributes: [],
                    },
                    {
                        name: 'pubvol',
                        value: 'armac013',
                        attributes: [],
                    },
                    {
                        name: 'pcicore:isIssuedBy',
                        value: null,
                        attributes: [
                            {
                                key: 'foaf:name',
                                value: 'FASB - Financial Accounting Standards Board',
                            },
                        ],
                    },
                    {
                        name: 'pcicore:isInPublication',
                        value: null,
                        attributes: [
                            {
                                key: 'skos:prefLabel',
                                value: 'DOCUMENT_AUTHOR_FASB_PENDING_LEGISTLATION_DEFAULT_BOOK',
                            },
                        ],
                    },
                ],
                groups: [],
            },
        },
        {
            id: 'DOCUMENT_AUTHOR_FASB_EXPLANATION_GLOSSARY_DEFAULT_BOOK',
            extendedMetadata: {
                objects: [
                    {
                        name: 'primary-class',
                        value: '<super-class super-class="explanation"></super-class><sub-class sub-class="glossary"></sub-class>',
                        attributes: [],
                    },
                    {
                        name: 'pubvol',
                        value: 'armac013',
                        attributes: [],
                    },
                    {
                        name: 'pcicore:isIssuedBy',
                        value: null,
                        attributes: [
                            {
                                key: 'foaf:name',
                                value: 'FASB - Financial Accounting Standards Board',
                            },
                        ],
                    },
                    {
                        name: 'pcicore:isInPublication',
                        value: null,
                        attributes: [
                            {
                                key: 'skos:prefLabel',
                                value: 'DOCUMENT_AUTHOR_FASB_EXPLANATION_GLOSSARY_DEFAULT_BOOK',
                            },
                        ],
                    },
                ],
                groups: [],
            },
        },
        {
            id: 'DOCUMENT_AUTHOR_PCAOB_AUTHORITATIVE_RULES_DEFAULT_BOOK',
            extendedMetadata: {
                objects: [
                    {
                        name: 'primary-class',
                        value: '<super-class super-class="authoritative-rules-procedures"></super-class><sub-class sub-class="rule"></sub-class>',
                        attributes: [],
                    },
                    {
                        name: 'pubvol',
                        value: 'armac013',
                        attributes: [],
                    },
                    {
                        name: 'pcicore:isIssuedBy',
                        value: null,
                        attributes: [
                            {
                                key: 'foaf:name',
                                value: 'PCAOB - Public Company Accounting Oversight Board',
                            },
                        ],
                    },
                    {
                        name: 'pcicore:isInPublication',
                        value: null,
                        attributes: [
                            {
                                key: 'skos:prefLabel',
                                value: 'DOCUMENT_AUTHOR_PCAOB_AUTHORITATIVE_RULES_DEFAULT_BOOK',
                            },
                        ],
                    },
                ],
                groups: [],
            },
        },
        {
            id: 'DOCUMENT_AUTHOR_PCAOB_PENDING_LEGISTLATION_DEFAULT_BOOK',
            extendedMetadata: {
                objects: [
                    {
                        name: 'primary-class',
                        value: '<super-class super-class="pending-legislation"></super-class><sub-class sub-class="pending-legislation"></sub-class>',
                        attributes: [],
                    },
                    {
                        name: 'pubvol',
                        value: 'armac013',
                        attributes: [],
                    },
                    {
                        name: 'pcicore:isIssuedBy',
                        value: null,
                        attributes: [
                            {
                                key: 'foaf:name',
                                value: 'PCAOB - Public Company Accounting Oversight Board',
                            },
                        ],
                    },
                    {
                        name: 'pcicore:isInPublication',
                        value: null,
                        attributes: [
                            {
                                key: 'skos:prefLabel',
                                value: 'DOCUMENT_AUTHOR_PCAOB_PENDING_LEGISTLATION_DEFAULT_BOOK',
                            },
                        ],
                    },
                ],
                groups: [],
            },
        },
        {
            id: 'DOCUMENT_WITHOUT_AUTHOR_EXPLANATION_WILEY_BOOK',
            extendedMetadata: {
                objects: [
                    {
                        name: 'primary-class',
                        value: '<super-class super-class="explanation"></super-class><sub-class sub-class="explanation"></sub-class>',
                        attributes: [],
                    },
                    {
                        name: 'pubvol',
                        value: 'armac013',
                        attributes: [],
                    },
                    {
                        name: 'pcicore:isInPublication',
                        value: null,
                        attributes: [
                            {
                                key: 'skos:prefLabel',
                                value: 'Wiley',
                            },
                        ],
                    },
                ],
                groups: [],
            },
        },
    ],
};
exports.expectedTestResults = {
    DEFAULT: {
        primaryClass: 'test/test',
        book: 'DEFAULT_BOOK',
        authorName: 'DEFAULT_AUTHOR',
        typeIndicator: {
            bgColor: document_type_constants_1.COLORS.GREEN,
            title: ' ',
            subtitle: 'Other',
            searchType: 'Other',
        },
    },
    DOCUMENT_PRIMARY_CLASS_TOPIC: {
        primaryClass: 'topical-landing-page/arm-topical-landing-page',
        book: 'DOCUMENT_PRIMARY_CLASS_TOPIC_BOOK',
        authorName: 'DOCUMENT_PRIMARY_CLASS_TOPIC_AUTHOR',
        typeIndicator: {
            bgColor: undefined,
            title: undefined,
            subtitle: undefined,
            searchType: 'ARM® Topics A-Z',
        },
    },
    DOCUMENT_PRIMARY_CLASS_PRACTICE_TOOL: {
        primaryClass: 'practice-aid/application-proxy',
        book: 'DOCUMENT_PRIMARY_CLASS_PRACTICE_TOOL_BOOK',
        authorName: 'DOCUMENT_PRIMARY_CLASS_PRACTICE_TOOL_AUTHOR',
        typeIndicator: {
            bgColor: undefined,
            title: undefined,
            subtitle: undefined,
            searchType: 'Practice Tool',
        },
    },
    DOCUMENT_AUTHOR_ARM_DEFAULT: {
        primaryClass: 'test/test',
        book: 'DOCUMENT_AUTHOR_ARM_DEFAULT_BOOK',
        authorName: 'Accounting Research Manager',
        typeIndicator: {
            bgColor: document_type_constants_1.COLORS.TAN,
            title: 'ARM',
            subtitle: 'Interpretive',
            searchType: 'Interpretations and Analysis',
        },
    },
    DOCUMENT_AUTHOR_ARM_EXPLANATION_PROJECT_UPDATES: {
        primaryClass: 'explanation/explanation',
        book: 'Project Updates',
        authorName: 'Accounting Research Manager',
        typeIndicator: {
            bgColor: document_type_constants_1.COLORS.GREEN,
            title: 'ARM',
            subtitle: 'Other',
            searchType: 'Other',
        },
    },
    DOCUMENT_AUTHOR_ARM_EXPLANATION_SEC_PRACTICE: {
        primaryClass: 'explanation/explanation',
        book: 'SEC Practice',
        authorName: 'Accounting Research Manager',
        typeIndicator: {
            bgColor: document_type_constants_1.COLORS.TAN,
            title: 'SEC',
            subtitle: 'Interpretive',
            searchType: 'Interpretations and Analysis',
        },
    },
    DOCUMENT_AUTHOR_ARM_AUTHORITATIVE_RULES_SEC_PRACTICE: {
        primaryClass: 'authoritative-rules-procedures/rule',
        book: 'SEC Practice',
        authorName: 'Accounting Research Manager',
        typeIndicator: {
            bgColor: document_type_constants_1.COLORS.GRAY,
            title: 'SEC',
            subtitle: 'Authoritative',
            searchType: 'Authoritative',
        },
    },
    DOCUMENT_AUTHOR_ARM_PENDING_LEGISTLATION_SEC_PRACTICE: {
        primaryClass: 'pending-legislation/pending-legislation',
        book: 'SEC Practice',
        authorName: 'Accounting Research Manager',
        typeIndicator: {
            bgColor: document_type_constants_1.COLORS.BLUE,
            title: 'SEC',
            subtitle: 'Proposal',
            searchType: 'Proposals',
        },
    },
    DOCUMENT_AUTHOR_ARM_RULING_SEC_PRACTICE: {
        primaryClass: 'ruling/ruling',
        book: 'SEC Practice',
        authorName: 'Accounting Research Manager',
        typeIndicator: {
            bgColor: document_type_constants_1.COLORS.GREEN,
            title: 'SEC',
            subtitle: 'Other',
            searchType: 'Other',
        },
    },
    DOCUMENT_AUTHOR_AICPA_DEFAULT: {
        primaryClass: 'test/test',
        book: 'DOCUMENT_AUTHOR_AICPA_DEFAULT_BOOK',
        authorName: 'AICPA - American Institute of Certified Public Accountants',
        typeIndicator: {
            bgColor: document_type_constants_1.COLORS.GRAY,
            title: 'AICPA',
            subtitle: 'Authoritative',
            searchType: 'Authoritative',
        },
    },
    DOCUMENT_AUTHOR_AICPA_EXPLANATION_DEFAULT_BOOK: {
        primaryClass: 'explanation/explanation',
        book: 'DOCUMENT_AUTHOR_AICPA_EXPLANATION_DEFAULT_BOOK',
        authorName: 'AICPA - American Institute of Certified Public Accountants',
        typeIndicator: {
            bgColor: document_type_constants_1.COLORS.GREEN,
            title: 'AICPA',
            subtitle: 'Other',
            searchType: 'Other',
        },
    },
    DOCUMENT_AUTHOR_AICPA_EXPLANATION_BEST_PRACTICES: {
        primaryClass: 'explanation/explanation',
        book: 'Best Practices in Presentation and Disclosure',
        authorName: 'AICPA - American Institute of Certified Public Accountants',
        typeIndicator: {
            bgColor: document_type_constants_1.COLORS.TAN,
            title: 'AICPA',
            subtitle: 'Interpretive',
            searchType: 'Interpretations and Analysis',
        },
    },
    DOCUMENT_AUTHOR_AICPA_EXPLANATION_AUDIT_AND_ACCOUNTING: {
        primaryClass: 'explanation/explanation',
        book: 'Audit and Accounting Guides and Risk Alerts Archive',
        authorName: 'AICPA - American Institute of Certified Public Accountants',
        typeIndicator: {
            bgColor: document_type_constants_1.COLORS.GRAY,
            title: 'AICPA',
            subtitle: 'Authoritative',
            searchType: 'Other',
        },
    },
    DOCUMENT_AUTHOR_AICPA_EXPLANATION_PRACTICE_BULLETINS: {
        primaryClass: 'explanation/explanation',
        book: 'Practice Bulletins (PB) Archive',
        authorName: 'AICPA - American Institute of Certified Public Accountants',
        typeIndicator: {
            bgColor: document_type_constants_1.COLORS.GRAY,
            title: 'AICPA',
            subtitle: 'Authoritative',
            searchType: 'Other',
        },
    },
    DOCUMENT_AUTHOR_AICPA_PENDING_LEGISTLATION_DEFAULT_BOOK: {
        primaryClass: 'pending-legislation/pending-legislation',
        book: 'DOCUMENT_AUTHOR_AICPA_PENDING_LEGISTLATION_DEFAULT_BOOK',
        authorName: 'AICPA - American Institute of Certified Public Accountants',
        typeIndicator: {
            bgColor: document_type_constants_1.COLORS.BLUE,
            title: 'AICPA',
            subtitle: 'Proposal',
            searchType: 'Proposals',
        },
    },
    DOCUMENT_AUTHOR_AICPA_AUTHORITATIVE_RULES_DEFAULT_BOOK: {
        primaryClass: 'authoritative-rules-procedures/rule',
        book: 'DOCUMENT_AUTHOR_AICPA_AUTHORITATIVE_RULES_DEFAULT_BOOK',
        authorName: 'AICPA - American Institute of Certified Public Accountants',
        typeIndicator: {
            bgColor: document_type_constants_1.COLORS.GRAY,
            title: 'AICPA',
            subtitle: 'Authoritative',
            searchType: 'Authoritative',
        },
    },
    DOCUMENT_AUTHOR_COSO_DEFAULT: {
        primaryClass: 'test/test',
        book: 'DOCUMENT_AUTHOR_AICPA_PENDING_LEGISTLATION_DEFAULT_BOOK',
        authorName: 'COSO - Committee of Sponsoring Organizations of the Treadway Commission',
        typeIndicator: {
            bgColor: document_type_constants_1.COLORS.GREEN,
            title: 'COSO',
            subtitle: 'Other',
            searchType: 'Other',
        },
    },
    DOCUMENT_AUTHOR_COSO_PENDING_LEGISTLATION_DEFAULT_BOOK: {
        primaryClass: 'pending-legislation/pending-legislation',
        book: 'DOCUMENT_AUTHOR_COSO_PENDING_LEGISTLATION_DEFAULT_BOOK',
        authorName: 'COSO - Committee of Sponsoring Organizations of the Treadway Commission',
        typeIndicator: {
            bgColor: document_type_constants_1.COLORS.BLUE,
            title: 'AICPA',
            subtitle: 'Proposal',
            searchType: 'Proposals',
        },
    },
    DOCUMENT_AUTHOR_COSO_AUTHORITATIVE_RULES_DEFAULT_BOOK: {
        primaryClass: 'authoritative-rules-procedures/rule',
        book: 'DOCUMENT_AUTHOR_COSO_AUTHORITATIVE_RULES_DEFAULT_BOOK',
        authorName: 'COSO - Committee of Sponsoring Organizations of the Treadway Commission',
        typeIndicator: {
            bgColor: document_type_constants_1.COLORS.GRAY,
            title: 'COSO',
            subtitle: 'Authoritative',
            searchType: 'Authoritative',
        },
    },
    DOCUMENT_AUTHOR_IASB_DEFAULT: {
        primaryClass: 'test/test',
        book: 'DOCUMENT_AUTHOR_IASB_DEFAULT_BOOK',
        authorName: 'IASB - International Accounting Standards Board',
        typeIndicator: {
            bgColor: document_type_constants_1.COLORS.GREEN,
            title: 'IASB',
            subtitle: 'Other',
            searchType: 'Other',
        },
    },
    DOCUMENT_AUTHOR_IASB_EXPLANATION_IFRICS_BOOK: {
        primaryClass: 'explanation/explanation',
        book: 'International Financial Reporting Interpretations Committee Superseded',
        authorName: 'IASB - International Accounting Standards Board',
        typeIndicator: {
            bgColor: document_type_constants_1.COLORS.GRAY,
            title: 'IASB',
            subtitle: 'Authoritative',
            searchType: 'Other',
        },
    },
    DOCUMENT_AUTHOR_IASB_PENDING_LEGISTLATION_DEFAULT_BOOK: {
        primaryClass: 'pending-legislation/pending-legislation',
        book: 'DOCUMENT_AUTHOR_IASB_PENDING_LEGISTLATION_DEFAULT_BOOK',
        authorName: 'IASB - International Accounting Standards Board',
        typeIndicator: {
            bgColor: document_type_constants_1.COLORS.BLUE,
            title: 'IASB',
            subtitle: 'Proposal',
            searchType: 'Proposals',
        },
    },
    DOCUMENT_AUTHOR_IASB_PENDING_LEGISTLATION_AICPA: {
        primaryClass: 'pending-legislation/pending-legislation',
        book: 'AICPA Proposal Stage Literature',
        authorName: 'IASB - International Accounting Standards Board',
        typeIndicator: {
            bgColor: document_type_constants_1.COLORS.BLUE,
            title: 'AICPA',
            subtitle: 'Proposal',
            searchType: 'Proposals',
        },
    },
    DOCUMENT_AUTHOR_IASB_AUTHORITATIVE_RULES_DEFAULT_BOOK: {
        primaryClass: 'authoritative-rules-procedures/rule',
        book: 'DOCUMENT_AUTHOR_IASB_AUTHORITATIVE_RULES_DEFAULT_BOOK',
        authorName: 'IASB - International Accounting Standards Board',
        typeIndicator: {
            bgColor: document_type_constants_1.COLORS.GRAY,
            title: 'IASB',
            subtitle: 'Authoritative',
            searchType: 'Authoritative',
        },
    },
    DOCUMENT_AUTHOR_GASB_AUTHORITATIVE_RULES_DEFAULT_BOOK: {
        primaryClass: 'authoritative-rules-procedures/rule',
        book: 'DOCUMENT_AUTHOR_GASB_AUTHORITATIVE_RULES_DEFAULT_BOOK',
        authorName: 'GASB - Government Accounting Standards Board',
        typeIndicator: {
            bgColor: document_type_constants_1.COLORS.GRAY,
            title: 'GASB',
            subtitle: 'Authoritative',
            searchType: 'Authoritative',
        },
    },
    DOCUMENT_AUTHOR_FASB_DEFAULT: {
        primaryClass: 'test/test',
        book: 'DOCUMENT_AUTHOR_FASB_DEFAULT',
        authorName: 'FASB - Financial Accounting Standards Board',
        typeIndicator: {
            bgColor: document_type_constants_1.COLORS.GREEN,
            title: 'FASB',
            subtitle: 'Other',
            searchType: 'Other',
        },
    },
    DOCUMENT_AUTHOR_FASB_AUTHORITATIVE_RULES_DEFAULT_BOOK: {
        primaryClass: 'authoritative-rules-procedures/rule',
        book: 'DOCUMENT_AUTHOR_FASB_AUTHORITATIVE_RULES_DEFAULT_BOOK',
        authorName: 'FASB - Financial Accounting Standards Board',
        typeIndicator: {
            bgColor: document_type_constants_1.COLORS.GRAY,
            title: 'FASB',
            subtitle: 'Authoritative',
            searchType: 'Authoritative',
        },
    },
    DOCUMENT_AUTHOR_FASB_PENDING_LEGISTLATION_DEFAULT_BOOK: {
        primaryClass: 'pending-legislation/pending-legislation',
        book: 'DOCUMENT_AUTHOR_FASB_PENDING_LEGISTLATION_DEFAULT_BOOK',
        authorName: 'FASB - Financial Accounting Standards Board',
        typeIndicator: {
            bgColor: document_type_constants_1.COLORS.BLUE,
            title: 'FASB',
            subtitle: 'Proposal',
            searchType: 'Proposals',
        },
    },
    DOCUMENT_AUTHOR_FASB_EXPLANATION_GLOSSARY_DEFAULT_BOOK: {
        primaryClass: 'explanation/glossary',
        book: 'DOCUMENT_AUTHOR_FASB_EXPLANATION_GLOSSARY_DEFAULT_BOOK',
        authorName: 'FASB - Financial Accounting Standards Board',
        typeIndicator: {
            bgColor: document_type_constants_1.COLORS.GRAY,
            title: 'FASB',
            subtitle: 'Glossary',
            searchType: 'Glossary',
        },
    },
    DOCUMENT_AUTHOR_PCAOB_AUTHORITATIVE_RULES_DEFAULT_BOOK: {
        primaryClass: 'authoritative-rules-procedures/rule',
        book: 'DOCUMENT_AUTHOR_PCAOB_AUTHORITATIVE_RULES_DEFAULT_BOOK',
        authorName: 'PCAOB - Public Company Accounting Oversight Board',
        typeIndicator: {
            bgColor: document_type_constants_1.COLORS.GRAY,
            title: 'PCAOB',
            subtitle: 'Authoritative',
            searchType: 'Authoritative',
        },
    },
    DOCUMENT_AUTHOR_PCAOB_PENDING_LEGISTLATION_DEFAULT_BOOK: {
        primaryClass: 'pending-legislation/pending-legislation',
        book: 'DOCUMENT_AUTHOR_PCAOB_PENDING_LEGISTLATION_DEFAULT_BOOK',
        authorName: 'PCAOB - Public Company Accounting Oversight Board',
        typeIndicator: {
            bgColor: document_type_constants_1.COLORS.BLUE,
            title: 'PCAOB',
            subtitle: 'Proposal',
            searchType: 'Proposals',
        },
    },
    DOCUMENT_WITHOUT_AUTHOR_EXPLANATION_WILEY_BOOK: {
        primaryClass: 'explanation/explanation',
        book: 'Wiley',
        authorName: undefined,
        typeIndicator: {
            bgColor: document_type_constants_1.COLORS.TAN,
            title: ' ',
            subtitle: 'Interpretive',
            searchType: 'Interpretations and Analysis',
        },
    },
};
//# sourceMappingURL=mocked-data.js.map
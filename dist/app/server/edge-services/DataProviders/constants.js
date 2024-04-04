"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultDocumentMetadataFields = exports.TOOL_RESOLVING_ADDITIONAL_PARAMS = exports.RESOLVE_TOOLS_REGISTERED_URL = exports.RESOLVE_TOOLS_FREEMIUM_URL = exports.NEWS_LETTERS_CONFIG = exports.STATE_CLIENT_IMPACT = exports.FEDERAL_CLIENT_IMPACT = exports.NEWS_CONTENT_TREE_NODE_IDS = exports.REGENT_CONFIG = exports.NON_ARM_HOME_TABS_EXCLUDED_CSH_NODE_IDS = exports.ARM_CSH_CONTENT_NODES = exports.FILTER_TREE_LEVELS_COUNT = exports.JURISDICTION_TREE_ID = exports.TOPIC_FILTERS = exports.BROWSER_PATTERN_METADATA_NAME = exports.EXTERNAL_LINK_METADATA_NAME = exports.INTERNAL_TOOL_LINK_METADATA_NAME = exports.TOOLS_ROOT_NODE_ID = exports.JOURNALS_ROOT_NODE_ID = exports.TREATISES_TREE_NODE_ID = void 0;
exports.TREATISES_TREE_NODE_ID = 'csh-da-filter!WKUS-TAL-DOCS-PHC-{5532d846-5470-3d7c-92c9-ce7244c50c89}';
exports.JOURNALS_ROOT_NODE_ID = 'csh-da-filter!WKUS-TAL-DOCS-PHC-{b25c3556-7cb3-31e2-902d-047e2dad9061}';
exports.TOOLS_ROOT_NODE_ID = 'csh-da-filter!WKUS-TAL-DOCS-PHC-{b3d4b2b5-b65c-3cb4-9c24-f916cf4f0707}';
exports.INTERNAL_TOOL_LINK_METADATA_NAME = 'pcicore:hasTarget';
exports.EXTERNAL_LINK_METADATA_NAME = 'app-link';
exports.BROWSER_PATTERN_METADATA_NAME = 'browse-pattern';
exports.TOPIC_FILTERS = ['ac-intl-doctypes-ats-filter!ATS_Topics'];
exports.JURISDICTION_TREE_ID = 'ac-jurisdictions-ats-filter';
exports.FILTER_TREE_LEVELS_COUNT = 3;
exports.ARM_CSH_CONTENT_NODES = {
    'news': 'csh-da-filter!WKUS-TAL-DOCS-PHC-{3d7b94f0-a12d-309c-99d6-4300ae0a5611}',
    'main': 'csh-da-filter!WKUS-TAL-DOCS-PHC-{25c555fd-aa38-2235-cc99-68a30fc21a77}',
    // note: not only arm content there, but in most cases it is hidden:
    'non-searchable': 'csh-da-filter!WKUS-TAL-DOCS-PHC-{f335f2b8-e7e2-3133-9305-2c8f6aa6dae9}',
};
exports.NON_ARM_HOME_TABS_EXCLUDED_CSH_NODE_IDS = [
    exports.ARM_CSH_CONTENT_NODES.news,
    exports.ARM_CSH_CONTENT_NODES.main,
    exports.ARM_CSH_CONTENT_NODES['non-searchable'],
];
exports.REGENT_CONFIG = {
    treeId: 'ac-regent-tree',
    homePageWidgetsNodeId: 'home-page-widgets',
    freemiumWidgetsNodeId: 'freemium-widgets',
    brandLogosNodeId: 'brand-logos',
    widgetsMetadataKey: 'editorialWidgets',
    allowedIconsMetadataKey: 'editorialIcons',
    freemiumBannerMetadataKey: 'isFreemiumBannerVisible',
    brandLogosMetadataKey: 'brandLogos',
};
exports.NEWS_CONTENT_TREE_NODE_IDS = {
    'federal': 'csh-da-filter!WKUS-TAL-DOCS-PHC-{82a5ff83-8ee2-37bf-9952-3648b1944330}',
    'state': 'csh-da-filter!WKUS-TAL-DOCS-PHC-{b1dfb81d-ea76-36c8-aac7-690c7302a9e6}',
    'international': 'csh-da-filter!WKUS-TAL-DOCS-PHC-{d4207948-fb69-3729-bb15-f655b973b341}',
    'federal-client-impact': '',
};
exports.FEDERAL_CLIENT_IMPACT = {
    ATSFilters: ['ac-all-doctypes-ats-filter!ATS_Events_Doctype', 'ac-jurisdictions-ats-filter!ATS_US-FED'],
};
exports.STATE_CLIENT_IMPACT = {
    ATSFilters: ['ac-all-doctypes-ats-filter!ATS_Events_Doctype', 'ac-jurisdictions-ats-filter!ATS_US-STATES'],
};
exports.NEWS_LETTERS_CONFIG = {
    federal: {
        letterTitle: "This Week's CCH FEDERAL TAX WEEKLY",
        daId: 'WKUS_TAL_1334',
        linkTitle: 'Federal Tax Weekly',
    },
    state: {
        letterTitle: 'New Issue of State Tax Review Available',
        daId: 'WKUS_TAL_1338',
        linkTitle: 'State Tax Review',
    },
};
exports.RESOLVE_TOOLS_FREEMIUM_URL = '/service/public/identity/scibum/resolveTools';
exports.RESOLVE_TOOLS_REGISTERED_URL = '/service/protected/identity/scibum/resolveTools';
exports.TOOL_RESOLVING_ADDITIONAL_PARAMS = {
    cpid: 'WKUS-TAA-AC',
    brand: 'ac',
};
exports.defaultDocumentMetadataFields = [
    'primary-class',
    'sectionStatus',
    'norm-link-values',
    'contextualization',
    'committeeReportLabel',
    'Form',
    'condor:documentType',
    // 'GA_TOP_CLASS_Structural',
    'relatedCodeDocuments',
    'codeSectionBlurb',
    'wkpractice-aid:metadata',
    'wkcase-law:metadata',
    'wkpend-leg:metadata',
    'wkrul:metadata',
    'wkagency-pub:metadata',
    'wkcom-rep:metadata',
    'AtlasTopicSet',
    'region',
    'searchArchivedContent',
    'archive-date',
    'sort-date',
    'cch-paragraph-number',
    'GA_AUTH_ID',
    'discoverable',
    'publication-info',
    'TREATYTYPEINFO',
    'state-tax-type',
    'title',
    'document-num',
    'pubVol',
    'publishing-status',
    // arm metadata:
    'da-title',
    'pcicore:isIssuedBy',
    'pcicore:isInPublication',
    'pcicore:isAbout',
    'wk-doc-id',
    'publishing-status',
    // ARMAC-47 document attachements:
    'pcicore:hasBibliographicResourceType',
    'pcicore:isInSubdivision',
    'pcicore:isAttachmentOf',
    'pcicore:hasManifestation',
];
//# sourceMappingURL=constants.js.map
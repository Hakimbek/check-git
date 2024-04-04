"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expectedResults = exports.metadataMock = exports.typeIndicatorTestDocId = exports.documentWithExtendedMetadataClass = exports.documentWithExtendedMetadata = void 0;
exports.documentWithExtendedMetadata = [
    {
        id: 'ARMFASB6051000161546',
        extendedMetadata: {
            objects: [
                { name: 'Authorized', value: 'T', attributes: [{ key: 'HasSeat', value: 'true' }] },
                { name: 'DocStatus', value: 'Available', attributes: [] },
                { name: 'PersistentId', value: 'T', attributes: [] },
                {
                    name: 'primary-class',
                    value: '<super-class super-class="authoritative-rules-procedures"></super-class><sub-class sub-class="rule"></sub-class>',
                    attributes: [],
                },
                {
                    name: 'pubvol',
                    value: 'armac015',
                    attributes: [{ key: 'publisher-uri', value: 'http://wk-us.com/meta/publishers/#CCH' }],
                },
                {
                    name: 'pcicore:isIssuedBy',
                    value: null,
                    attributes: [
                        { key: 'foaf:name', value: 'FASB - Financial Accounting Standards Board' },
                        { key: 'publisher-uri', value: 'http://wk-us.com/meta/publishers/#CCH' },
                    ],
                },
                {
                    name: 'pcicore:isInPublication',
                    value: null,
                    attributes: [
                        { key: 'publisher-uri', value: 'http://wk-us.com/meta/publishers/#CCH' },
                        { key: 'skos:prefLabel', value: 'FASB Codification' },
                    ],
                },
            ],
            groups: [],
        },
    },
];
exports.documentWithExtendedMetadataClass = [
    { id: 'ARMFASB6051000161546', primaryClass: { superClass: 'authoritative-rules-procedures', subClass: 'rule' } },
];
exports.typeIndicatorTestDocId = 'ARMFASB6051000161546';
exports.metadataMock = {
    metadata: [
        {
            key: 'pcicore:isInPublication',
            attributeKey: 'skos:prefLabel',
            value: 'FASB Codification',
        },
        {
            key: 'pcicore:isIssuedBy',
            attributeKey: 'foaf:name',
            value: 'FASB - Financial Accounting Standards Board',
        },
        {
            key: 'pubvol',
            value: 'armac015',
        },
    ],
};
exports.expectedResults = {
    getDocumentWithExtendedMetadata: {
        id: 'ARMFASB6051000161546',
    },
    getDocumentClass: 'authoritative-rules-procedures/rule',
    getAuthorAndBookName: { authorName: 'FASB - Financial Accounting Standards Board', book: 'FASB Codification' },
    getDocumentTypeIndicator: { bgColor: '#919191', title: 'FASB', subtitle: 'Authoritative' },
};
//# sourceMappingURL=TypeIndicatorService.mock.js.map
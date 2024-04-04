"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockedMetadataWith2Subscriptions = exports.mockedMetadataWith2Seat = exports.mockedMetadataWith1Seat = exports.mockedMetadataWithConcurentAuthorButWithoutSeatMetadata = exports.mockedMetadataWithNonConcurentAuthor = exports.defaultMockedMetadata = exports.concurrencyDaoMock = void 0;
exports.concurrencyDaoMock = {
    DocumentDAO: {
        getDocumentMetadata: jest.fn(),
        getDocumentContent: jest.fn(),
    },
    LicenseDAO: {
        acquire: jest.fn(),
        release: jest.fn(),
        refreshAcquire: jest.fn(),
    },
};
const defaultMetadataObjects = [
    {
        name: 'Authorized',
        value: 'T',
        attributes: [
            {
                key: 'HasSeat',
                value: 'true',
            },
        ],
    },
    {
        name: 'DocStatus',
        value: 'Available',
        attributes: [],
    },
    {
        name: 'PersistentId',
        value: 'T',
        attributes: [],
    },
];
exports.defaultMockedMetadata = {
    objects: [
        ...defaultMetadataObjects,
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
    ],
    groups: [
        {
            name: 'SEAT_SUBSCRIPTION',
            objects: [
                {
                    name: 'SubscriptionId',
                    value: 'ACALL',
                    attributes: [
                        {
                            key: 'EnforceConcurrency',
                            value: 'F',
                        },
                        {
                            key: 'NumOfSeats',
                            value: '0',
                        },
                    ],
                },
            ],
            groups: [],
            id: null,
        },
    ],
};
exports.mockedMetadataWithNonConcurentAuthor = {
    objects: [
        ...defaultMetadataObjects,
        {
            name: 'pcicore:isIssuedBy',
            value: 'ANY NON CONCURRENT AUTHOR',
        },
    ],
};
exports.mockedMetadataWithConcurentAuthorButWithoutSeatMetadata = {
    objects: [
        ...defaultMetadataObjects,
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
    ],
};
exports.mockedMetadataWith1Seat = Object.assign(Object.assign({}, exports.defaultMockedMetadata), { groups: [
        {
            name: 'SEAT_SUBSCRIPTION',
            objects: [
                {
                    name: 'SubscriptionId',
                    value: 'ACALL',
                    attributes: [
                        {
                            key: 'EnforceConcurrency',
                            value: 'T',
                        },
                        {
                            key: 'NumOfSeats',
                            value: '1',
                        },
                    ],
                },
            ],
            groups: [],
            id: null,
        },
    ] });
exports.mockedMetadataWith2Seat = Object.assign(Object.assign({}, exports.defaultMockedMetadata), { groups: [
        {
            name: 'SEAT_SUBSCRIPTION',
            objects: [
                {
                    name: 'SubscriptionId',
                    value: 'ACALL',
                    attributes: [
                        {
                            key: 'EnforceConcurrency',
                            value: 'T',
                        },
                        {
                            key: 'NumOfSeats',
                            value: '2',
                        },
                    ],
                },
            ],
            groups: [],
            id: null,
        },
    ] });
exports.mockedMetadataWith2Subscriptions = Object.assign(Object.assign({}, exports.defaultMockedMetadata), { groups: [
        {
            name: 'SEAT_SUBSCRIPTION',
            objects: [
                {
                    name: 'SubscriptionId',
                    value: 'ACALL',
                    attributes: [
                        {
                            key: 'EnforceConcurrency',
                            value: 'T',
                        },
                        {
                            key: 'NumOfSeats',
                            value: '1',
                        },
                    ],
                },
                {
                    name: 'SubscriptionId',
                    value: 'ACALL_2',
                    attributes: [
                        {
                            key: 'EnforceConcurrency',
                            value: 'T',
                        },
                        {
                            key: 'NumOfSeats',
                            value: '2',
                        },
                    ],
                },
            ],
            groups: [],
            id: null,
        },
    ] });
//# sourceMappingURL=concurrency.mocks.js.map
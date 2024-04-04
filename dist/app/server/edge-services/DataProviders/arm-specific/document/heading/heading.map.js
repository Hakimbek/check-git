"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.headingTemplateMapping = void 0;
exports.headingTemplateMapping = {
    search: {
        'authoritative-rules-procedures': {
            rule: [
                {
                    name: 'title',
                    attributeKey: 'type',
                    attributeValue: 'standard',
                },
                {
                    name: 'primary-citation',
                },
                {
                    name: 'issuing-body',
                },
            ],
        },
        'pending-legislation': {
            'pending-legislation': [
                {
                    name: 'title',
                    attributeKey: 'type',
                    attributeValue: 'standard',
                },
                {
                    name: 'primary-citation',
                },
            ],
        },
    },
    document: {},
    topic: {},
    fallback: {},
};
//# sourceMappingURL=heading.map.js.map
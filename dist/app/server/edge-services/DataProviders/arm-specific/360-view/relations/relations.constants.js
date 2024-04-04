"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RELATED_DOCUMENTS_EXTENDED_METADATA_FIELDS = exports.AS_CONTENT_NODE_ID = exports.ARM_CONTENT_NODES = exports.AC_360_ART_ID = void 0;
const constants_1 = require("../../../constants");
exports.AC_360_ART_ID = 'ARM360-ART'; // 'TAL-ART-AC';
exports.ARM_CONTENT_NODES = Object.values(constants_1.ARM_CSH_CONTENT_NODES);
exports.AS_CONTENT_NODE_ID = 'csh-da-filter!WKUS-TAL-DOCS-PHC-{f335f2b8-e7e2-3133-9305-2c8f6aa6dae9}-{b1182ff7-93fd-37db-931a-f81e4ebbc717}';
exports.RELATED_DOCUMENTS_EXTENDED_METADATA_FIELDS = [
    'title',
    'search-title',
    'primary-class',
    'pubvol',
    'pcicore:isInPublication',
    'da-title',
    'target-path',
    'frbr:Manifestation',
    'publishing-status',
];
//# sourceMappingURL=relations.constants.js.map
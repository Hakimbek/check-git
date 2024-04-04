"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DOCUMENT_SOURCE_MAP = exports.AUDITING_DOCUMENT_SOURCE = exports.AS_DOCUMENT_SOURCE = exports.AS_DOCUMENT_ACTION = exports.AS_DOCUMENT_EVENT_NAME = void 0;
const as_document_event_types_1 = require("./as-document-event.types");
exports.AS_DOCUMENT_EVENT_NAME = 'AS360DocumentEvent';
exports.AS_DOCUMENT_ACTION = 'AS360DocumentOpen';
exports.AS_DOCUMENT_SOURCE = 'ARMACAS360';
exports.AUDITING_DOCUMENT_SOURCE = 'ARMACAUDIT360';
exports.DOCUMENT_SOURCE_MAP = {
    [as_document_event_types_1.EVENT_DOCUMENT_SOURCES.ACCOUNTING]: exports.AS_DOCUMENT_SOURCE,
    [as_document_event_types_1.EVENT_DOCUMENT_SOURCES.AUDITING]: exports.AUDITING_DOCUMENT_SOURCE,
};
//# sourceMappingURL=as-document-event.constants.js.map
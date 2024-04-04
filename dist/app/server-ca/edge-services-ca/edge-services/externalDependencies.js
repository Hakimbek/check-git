"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentTransformation = exports.userTypeService = exports.logService = void 0;
const log_base_1 = require("@wk/log-base");
const metadataService_1 = require("../services/metadataService");
const csnUtils_1 = require("../services/csnUtils");
const docHeadingExtractor_1 = require("../services/docHeadingExtractor");
const durationTrackingService = require('../services/durationTrackingService');
const loggerService = require('../services/loggerService');
const EDGE_SERVICES_LOG_TYPE = 'edge-services';
exports.logService = {
    error: (message, data) => {
        loggerService.log(log_base_1.LogLevel.Error, Object.assign({ message, type: EDGE_SERVICES_LOG_TYPE }, data));
    },
    info: (message, data) => {
        loggerService.log(log_base_1.LogLevel.Info, Object.assign({ message, type: EDGE_SERVICES_LOG_TYPE }, data));
    },
    logRequest: (logLevel, req, configuration, error) => {
        loggerService.logRequest(logLevel, req, Object.assign({ type: EDGE_SERVICES_LOG_TYPE }, configuration), error);
    },
    getChainedCorrelationId: (correlationId) => loggerService.getChainedCorrelationId(correlationId),
    durationTracking: {
        start: () => durationTrackingService.start(),
        end: (entryId) => durationTrackingService.end(entryId),
    },
};
exports.userTypeService = {
    isFreemium: (_req) => false,
    isSubFreemium: (_sub) => false,
};
exports.DocumentTransformation = {
    isProxyDocument: document => metadataService_1.MetadataService.isProxyDocument(document),
    getDocumentType: (document, mapping) => metadataService_1.MetadataService.getDocumentType(document, mapping),
    getItemsWithExtractedTitles: (items) => items.map(item => (Object.assign(Object.assign({}, item), { title: csnUtils_1.CsnUtils.extractParts(docHeadingExtractor_1.DocHeadingExtractor.extract(item)).sectionTitle }))),
    getExtractedTitle: document => docHeadingExtractor_1.DocHeadingExtractor.extract(document),
    getDocumentId: document => csnUtils_1.CsnUtils.getDocumentId(document),
    isStateClientImpactEvent: () => false,
    getStateClientImpactEventTitle: () => null,
    getSortDate: document => metadataService_1.MetadataService.extractSortDate(document),
    getProxyDocumentUrl: document => `/resolve/document/${csnUtils_1.CsnUtils.getDocumentId(document)}`,
    extractMetadata: (document, name, attributeKey, attributeValue) => metadataService_1.MetadataService.extractMetadata(document, name, attributeKey, attributeValue),
    extractRegionCode: document => metadataService_1.MetadataService.extractRegionCode(document),
};
exports.default = {
    logService: exports.logService,
};
//# sourceMappingURL=externalDependencies.js.map
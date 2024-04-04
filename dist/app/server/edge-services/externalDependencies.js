"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envUtils = exports.userTypeService = exports.logService = exports.analyticsService = exports.vars = exports.DocumentTransformation = void 0;
const log_base_1 = require("@wk/log-base");
const global_constants_1 = require("./global.constants");
const path = require('path');
const env = require(path.resolve(process.cwd(), 'server/services/utils/env.util.js'));
const loggerService = require(path.resolve(process.cwd(), 'server/services/loggerService.js'));
const detectUserTypeService = require(path.resolve(process.cwd(), 'server/services/detectUserTypeService.js'));
const durationTrackingService = require(path.resolve(process.cwd(), 'server/services/durationTrackingService.js'));
const serverAnalyticsService = require(path.resolve(process.cwd(), 'server/services/analyticsService.js'));
const EDGE_SERVICES_LOG_TYPE = 'edge-services';
var externalModules_1 = require("./externalModules");
Object.defineProperty(exports, "DocumentTransformation", { enumerable: true, get: function () { return externalModules_1.DocumentTransformation; } });
exports.vars = global_constants_1.vars;
exports.analyticsService = serverAnalyticsService;
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
    getReqWithChainedCorrelationId: (req) => loggerService.getReqWithChainedCorrelationId(req),
};
exports.userTypeService = {
    isFreemium: (req) => detectUserTypeService.isFreemium(req) === 'true',
    isSubFreemium: (sub) => detectUserTypeService.isSubFreemium(sub),
    isIPAnonymousUser: (req) => detectUserTypeService.isIPAnonymousUser(req),
};
exports.envUtils = env;
//# sourceMappingURL=externalDependencies.js.map
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withAsyncRequestLogging = void 0;
const log_base_1 = require("@wk/log-base");
const externalDependencies_1 = require("../externalDependencies");
const DEFAULT_SUCCESS_MESSAGE = 'Success';
// assuming that first argument of the wrapped function will be a 'request'
function withAsyncRequestLogging(fn, config = {}) {
    return function (...args) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            const logServiceImpl = (config === null || config === void 0 ? void 0 : config.logService) || externalDependencies_1.logService;
            const operationId = (_a = logServiceImpl.durationTracking) === null || _a === void 0 ? void 0 : _a.start();
            let logErrorData;
            let result;
            try {
                result = yield fn.apply(this, args);
                return result;
            }
            catch (error) {
                logErrorData = error;
                return config === null || config === void 0 ? void 0 : config.defaultValue;
            }
            finally {
                const operationDuration = (_b = logServiceImpl === null || logServiceImpl === void 0 ? void 0 : logServiceImpl.durationTracking) === null || _b === void 0 ? void 0 : _b.end(operationId);
                const req = args[0];
                const logMessage = logErrorData
                    ? ((_c = config === null || config === void 0 ? void 0 : config.getErrorMessage) === null || _c === void 0 ? void 0 : _c.call(config, logErrorData)) || `${config === null || config === void 0 ? void 0 : config.errorMessage} Error: ${logErrorData.message}`
                    : ((_d = config === null || config === void 0 ? void 0 : config.getSuccessMessage) === null || _d === void 0 ? void 0 : _d.call(config, result)) || (config === null || config === void 0 ? void 0 : config.successMessage) || DEFAULT_SUCCESS_MESSAGE;
                const logData = {
                    message: logMessage,
                    duration: operationDuration,
                    correlationId: req === null || req === void 0 ? void 0 : req.correlationId,
                };
                (config === null || config === void 0 ? void 0 : config.enableStdOutput) && console.log(logData);
                externalDependencies_1.logService === null || externalDependencies_1.logService === void 0 ? void 0 : externalDependencies_1.logService.logRequest(logErrorData ? log_base_1.LogLevel.Error : log_base_1.LogLevel.Info, req, logData, logErrorData);
            }
        });
    };
}
exports.withAsyncRequestLogging = withAsyncRequestLogging;
//# sourceMappingURL=logger.js.map
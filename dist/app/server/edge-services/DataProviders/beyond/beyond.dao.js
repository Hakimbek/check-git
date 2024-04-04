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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBeyondDAO = void 0;
const beyond_client_1 = __importDefault(require("@wk/beyond-client"));
const log_base_1 = require("@wk/log-base");
const externalDependencies_1 = require("../../externalDependencies");
const beyond_constants_1 = require("./beyond.constants");
const env = externalDependencies_1.vars.get('env');
const { workspaceId } = externalDependencies_1.vars.get('beyond');
const isProdEnv = env === 'prod' || env === 'prod-ohio';
const localApiKey = isProdEnv ? process.env.BEYOND_API_KEY_PROD : process.env.BEYOND_API_KEY_NON_PROD;
const beyondApiKey = process.env.AWS_BEYOND_API_KEY || localApiKey;
// this config is only for Beyond requests from the Node
// in case changing please add changes in authorization.router.js for requests from UI too
const beyondClient = beyond_client_1.default.init({
    apiUrl: beyond_constants_1.GATEWAY_BEYOND_API_URL,
    privateConfig: {
        workspaceId: workspaceId,
        apiKey: beyondApiKey,
    },
});
function getBeyondDAO() {
    function harvest(req, harvestData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const harvestDurationId = externalDependencies_1.logService.durationTracking.start();
                externalDependencies_1.logService.logRequest(log_base_1.LogLevel.Info, req, {
                    message: beyond_constants_1.LOG_MESSAGE_REQUEST_HARVEST_START,
                    function: beyond_constants_1.FUNCTION_NAME_BEYOND_HARVEST,
                    harvestData,
                    correlationId: req.correlationId,
                });
                yield beyondClient.harvest(Object.assign(Object.assign({}, harvestData), { overrideConfig: {
                        userToken: req.headers.authorization,
                    } }));
                externalDependencies_1.logService.logRequest(log_base_1.LogLevel.Info, req, {
                    message: beyond_constants_1.LOG_MESSAGE_REQUEST_HARVEST_END,
                    duration: externalDependencies_1.logService.durationTracking.end(harvestDurationId),
                    function: beyond_constants_1.FUNCTION_NAME_BEYOND_HARVEST,
                    correlationId: req.correlationId,
                });
            }
            catch (error) {
                externalDependencies_1.logService.logRequest(log_base_1.LogLevel.Error, req, {
                    message: beyond_constants_1.LOG_MESSAGE_REQUEST_HARVEST_ERROR,
                    function: beyond_constants_1.FUNCTION_NAME_BEYOND_HARVEST,
                    correlationId: req.correlationId,
                }, error);
                throw error;
            }
        });
    }
    function warmEntitlementsCache(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const warmEntitlementsCacheDurationId = externalDependencies_1.logService.durationTracking.start();
                externalDependencies_1.logService.logRequest(log_base_1.LogLevel.Info, req, {
                    message: beyond_constants_1.LOG_MESSAGE_REQUEST_WARM_ENTITLEMENTS_CACHE_START,
                    function: beyond_constants_1.FUNCTION_NAME_BEYOND_WARM_ENTITLEMENTS_CACHE,
                    correlationId: req.correlationId,
                });
                yield beyondClient.warmEntitlementsCache({
                    overrideConfig: {
                        userToken: req.headers.authorization,
                    },
                });
                externalDependencies_1.logService.logRequest(log_base_1.LogLevel.Info, req, {
                    message: beyond_constants_1.LOG_MESSAGE_REQUEST_WARM_ENTITLEMENTS_CACHE_END,
                    duration: externalDependencies_1.logService.durationTracking.end(warmEntitlementsCacheDurationId),
                    function: beyond_constants_1.FUNCTION_NAME_BEYOND_WARM_ENTITLEMENTS_CACHE,
                    correlationId: req.correlationId,
                });
            }
            catch (error) {
                externalDependencies_1.logService.logRequest(log_base_1.LogLevel.Error, req, {
                    message: beyond_constants_1.LOG_MESSAGE_REQUEST_WARM_ENTITLEMENTS_CACHE_ERROR,
                    function: beyond_constants_1.FUNCTION_NAME_BEYOND_WARM_ENTITLEMENTS_CACHE,
                    correlationId: req.correlationId,
                }, error);
                throw error;
            }
        });
    }
    function retrieveAnswers(req, answersParams) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const retrieveAnswersDurationId = externalDependencies_1.logService.durationTracking.start();
                externalDependencies_1.logService.logRequest(log_base_1.LogLevel.Info, req, {
                    message: beyond_constants_1.LOG_MESSAGE_REQUEST_RETRIEVE_ANSWERS_START,
                    function: beyond_constants_1.FUNCTION_NAME_BEYOND_RETRIEVE_ANSWERS,
                    answersParams,
                    correlationId: req.correlationId,
                });
                const answers = yield beyondClient.retrieveAnswers(Object.assign(Object.assign({}, answersParams), { overrideConfig: {
                        userToken: req.headers.authorization,
                    } }));
                externalDependencies_1.logService.logRequest(log_base_1.LogLevel.Info, req, {
                    message: beyond_constants_1.LOG_MESSAGE_REQUEST_RETRIEVE_ANSWERS_END,
                    duration: externalDependencies_1.logService.durationTracking.end(retrieveAnswersDurationId),
                    function: beyond_constants_1.FUNCTION_NAME_BEYOND_RETRIEVE_ANSWERS,
                    correlationId: req.correlationId,
                });
                return answers;
            }
            catch (error) {
                externalDependencies_1.logService.logRequest(log_base_1.LogLevel.Error, req, {
                    message: beyond_constants_1.LOG_MESSAGE_REQUEST_RETRIEVE_ANSWERS_ERROR,
                    function: beyond_constants_1.FUNCTION_NAME_BEYOND_RETRIEVE_ANSWERS,
                    correlationId: req.correlationId,
                }, error);
                throw error;
            }
        });
    }
    function retrieveSuggestions(req, query, beyondSearchScope) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const retrieveSuggestionsDurationId = externalDependencies_1.logService.durationTracking.start();
                externalDependencies_1.logService.logRequest(log_base_1.LogLevel.Info, req, {
                    message: beyond_constants_1.LOG_MESSAGE_REQUEST_RETRIEVE_SUGGESTIONS_START,
                    function: beyond_constants_1.FUNCTION_NAME_BEYOND_RETRIEVE_SUGGESTIONS,
                    query,
                    correlationId: req.correlationId,
                });
                const suggestions = yield beyondClient.retrieveSuggestions({
                    query,
                    filterSpecs: beyondSearchScope || [],
                    overrideConfig: {
                        userToken: req.headers.authorization,
                    },
                });
                externalDependencies_1.logService.logRequest(log_base_1.LogLevel.Info, req, {
                    message: beyond_constants_1.LOG_MESSAGE_REQUEST_RETRIEVE_SUGGESTIONS_END,
                    duration: externalDependencies_1.logService.durationTracking.end(retrieveSuggestionsDurationId),
                    function: beyond_constants_1.FUNCTION_NAME_BEYOND_RETRIEVE_SUGGESTIONS,
                    correlationId: req.correlationId,
                });
                return suggestions;
            }
            catch (error) {
                externalDependencies_1.logService.logRequest(log_base_1.LogLevel.Error, req, {
                    message: beyond_constants_1.LOG_MESSAGE_REQUEST_RETRIEVE_SUGGESTIONS_ERROR,
                    function: beyond_constants_1.FUNCTION_NAME_BEYOND_RETRIEVE_SUGGESTIONS,
                    correlationId: req.correlationId,
                }, error);
                throw error;
            }
        });
    }
    return {
        harvest,
        retrieveAnswers,
        warmEntitlementsCache,
        retrieveSuggestions,
    };
}
exports.getBeyondDAO = getBeyondDAO;
//# sourceMappingURL=beyond.dao.js.map
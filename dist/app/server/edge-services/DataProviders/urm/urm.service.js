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
exports.getURMService = void 0;
const log_base_1 = require("@wk/log-base");
const urm_dao_1 = require("./urm.dao");
const externalDependencies_1 = require("../../externalDependencies");
const redisCacheService_1 = __importDefault(require("../../services/cacheService/redisCacheService"));
const urm_constants_1 = require("./urm.constants");
const { default: { headers: { 'x-cpid': AC_CPID }, }, } = externalDependencies_1.vars.get('osaProductConfig');
function getURMService() {
    const DAO = urm_dao_1.getURMDAO();
    function getUserSubscriptionsStatus(req, ignoreCache) {
        return __awaiter(this, void 0, void 0, function* () {
            const cacheKey = req.forwardedSub; // user boss key
            let cachedUserSubscriptionsStatus;
            if (!ignoreCache) {
                try {
                    cachedUserSubscriptionsStatus = yield getFromCache(cacheKey);
                }
                catch (error) {
                    externalDependencies_1.logService.logRequest(log_base_1.LogLevel.Error, req, {
                        message: urm_constants_1.LOG_MESSAGE_GET_USER_SUBSCRIPTIONS_STATUS_FROM_CACHE_FAIL,
                        function: urm_constants_1.FUNCTION_NAME_GET_USER_SUBSCRIPTIONS_STATUS,
                        correlationId: req.correlationId,
                    }, error);
                }
                const isAllACSubscriptionsSuspended = !(cachedUserSubscriptionsStatus === null || cachedUserSubscriptionsStatus === void 0 ? void 0 : cachedUserSubscriptionsStatus.hasACSubscriptions) && (cachedUserSubscriptionsStatus === null || cachedUserSubscriptionsStatus === void 0 ? void 0 : cachedUserSubscriptionsStatus.hasSuspendedSubscriptions);
                if (cachedUserSubscriptionsStatus && !isAllACSubscriptionsSuspended) {
                    return cachedUserSubscriptionsStatus;
                }
            }
            const userGroupSubscriptions = yield DAO.getUserGroupSubscriptions(req);
            const userSubscriptionsStatus = {
                hasSuspendedSubscriptions: false,
                hasACSubscriptions: false,
            };
            userGroupSubscriptions.some(group => {
                if (group.active) {
                    userSubscriptionsStatus.hasACSubscriptions =
                        userSubscriptionsStatus.hasACSubscriptions ||
                            group.carbonProducts.some(product => product.id === AC_CPID);
                }
                else {
                    userSubscriptionsStatus.hasSuspendedSubscriptions =
                        userSubscriptionsStatus.hasSuspendedSubscriptions || group.endDate > new Date();
                }
                return userSubscriptionsStatus.hasSuspendedSubscriptions && userSubscriptionsStatus.hasACSubscriptions;
            });
            try {
                yield putToCache(cacheKey, userSubscriptionsStatus);
            }
            catch (error) {
                externalDependencies_1.logService.logRequest(log_base_1.LogLevel.Error, req, {
                    message: urm_constants_1.LOG_MESSAGE_SAVE_USER_SUBSCRIPTIONS_STATUS_TO_CACHE_FAIL,
                    function: urm_constants_1.FUNCTION_NAME_GET_USER_SUBSCRIPTIONS_STATUS,
                    correlationId: req.correlationId,
                }, error);
            }
            return userSubscriptionsStatus;
        });
    }
    function getFromCache(cacheKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const cachedData = yield redisCacheService_1.default.getValueForServiceByKey({
                serviceId: urm_constants_1.SERVICE_ID,
                key: cacheKey,
            }, { useLocalCacheAsFallback: true });
            return JSON.parse(cachedData);
        });
    }
    function putToCache(cacheKey, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield redisCacheService_1.default.setValueForService({
                serviceId: urm_constants_1.SERVICE_ID,
                key: cacheKey,
                value: JSON.stringify(data),
            }, {
                TTL: urm_constants_1.CACHE_TTL,
                useLocalCacheAsFallback: true,
            });
        });
    }
    return {
        getUserSubscriptionsStatus,
    };
}
exports.getURMService = getURMService;
//# sourceMappingURL=urm.service.js.map
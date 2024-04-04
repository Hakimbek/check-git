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
exports.CacheService = void 0;
const redisCacheService_1 = __importDefault(require("../../../../services/cacheService/redisCacheService"));
const SERVICE_ID = 'concurrency_svc';
const TIMEOUT_REDIS_MULTIPLIER = 60; // 60 secs
const TIMEOUT_MULTIPLIER = 60000; // 60 * 1000 ms
class CacheService {
    static addEntry({ key, value }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield redisCacheService_1.default.setValueForService({ serviceId: SERVICE_ID, key, value }, { TTL: CacheService.SEAT_TIMEOUT * TIMEOUT_REDIS_MULTIPLIER } // EX
                );
            }
            catch (error) {
                // for local development, without connection to Redis
                CacheService.temporaryCache[key] = {
                    value,
                    ttl: new Date().getTime() + CacheService.SEAT_TIMEOUT * TIMEOUT_MULTIPLIER,
                };
            }
        });
    }
    // @TODO return the whole list
    static getKeyBySubscriptionIdAndBosKey(bosKey, subscriptionId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const keys = yield redisCacheService_1.default.getKeysForServiceByPattern({
                    serviceId: SERVICE_ID,
                    keyPattern: `*${subscriptionId}:${bosKey}:*`,
                });
                return keys[0];
            }
            catch (error) {
                const requiredKey = (_a = Object.entries(CacheService.temporaryCache)
                    .filter(entry => entry[1].value === bosKey)) === null || _a === void 0 ? void 0 : _a.find(entry => entry[0].includes(`${subscriptionId}:`));
                if (!requiredKey) {
                    return void 0;
                }
                if (requiredKey[1].ttl < new Date().getTime()) {
                    CacheService.removeKey(requiredKey[0]);
                    return void 0;
                }
                return requiredKey[0];
            }
        });
    }
    // @TODO return the whole list
    static getKeysByBosKey(bosKey) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const keys = yield redisCacheService_1.default.getKeysForServiceByPattern({
                    serviceId: SERVICE_ID,
                    keyPattern: `*${bosKey}:*`,
                });
                return keys;
            }
            catch (error) {
                const storedKeys = Object.entries(CacheService.temporaryCache).filter(entry => entry[1].value === bosKey);
                if (!(storedKeys === null || storedKeys === void 0 ? void 0 : storedKeys.length)) {
                    return [];
                }
                const result = [];
                storedKeys.forEach(key => {
                    if (key[1].ttl < new Date().getTime()) {
                        CacheService.removeKey(key[0]);
                        return void 0;
                    }
                    return void result.push(key[0]);
                });
                return result;
            }
        });
    }
    static getKeysBySubscriptionId(subscriptionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const keys = yield redisCacheService_1.default.getKeysForServiceByPattern({
                    serviceId: SERVICE_ID,
                    keyPattern: `*${subscriptionId}:*:*`,
                });
                return keys;
            }
            catch (error) {
                const requiredKeysRecords = Object.entries(CacheService.temporaryCache).filter(entry => entry[0].includes(`${subscriptionId}:`));
                if (!requiredKeysRecords.length) {
                    return void 0;
                }
                const requiredKeys = requiredKeysRecords
                    .filter(requiredKeyRecord => {
                    if (requiredKeyRecord[1].ttl < new Date().getTime()) {
                        CacheService.removeKey(requiredKeyRecord[0]);
                        return false;
                    }
                    return true;
                })
                    .map(requiredKeyRecord => requiredKeyRecord[0]);
                return requiredKeys;
            }
        });
    }
    static removeKey(key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield redisCacheService_1.default.removeByKey({
                    serviceId: SERVICE_ID,
                    key,
                });
            }
            catch (error) {
                delete CacheService.temporaryCache[key];
            }
        });
    }
}
exports.CacheService = CacheService;
CacheService.SEAT_TIMEOUT = 1;
// key: `subscriptionId:bosKey:licenseGuid`
// value: 'bosKey'
CacheService.temporaryCache = {};
//# sourceMappingURL=cache.service.js.map
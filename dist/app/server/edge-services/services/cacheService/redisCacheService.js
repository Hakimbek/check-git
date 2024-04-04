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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const process_1 = require("process");
const redis_1 = require("redis");
const util_1 = require("util");
const externalDependencies_1 = require("../../externalDependencies");
const ENVIRONMENT_PREFIX = (_a = process.env.env) === null || _a === void 0 ? void 0 : _a.toUpperCase();
const { hostName, port } = externalDependencies_1.vars.get('redisHost');
const DEFAULT_SET_TTL = 300; // 5 minutes, EX redis param
// specific use case for 'suggestions'
// @TODO move it out
const KEY_TTL_TIME = 28800000; // 8hours to expire
const CLIENT_RETRY_TIME = 3600000; // 1hour retry time
const auth = process_1.env.REDIS_AUTH_APPLICATION;
const SCAN_KEY_COUNT = '10';
class RedisCacheService {
    constructor() {
        this.connectionIsFailed = false;
        // cache for local development
        this.localCache = {};
        this.client = this.getNewClient();
        this.client.on('error', error => {
            this.connectionIsFailed = true;
            this.connectionErrorMessage = error.message;
        });
        this.client.on('connect', () => {
            this.connectionIsFailed = false;
        });
    }
    getNewClient() {
        const clientOptions = {
            retry_strategy: options => {
                var _a;
                this.connectionIsFailed = true;
                this.connectionErrorMessage = (_a = options.error) === null || _a === void 0 ? void 0 : _a.message;
                return CLIENT_RETRY_TIME;
            },
        };
        if (externalDependencies_1.envUtils.isHub()) {
            clientOptions.url = `rediss://:${auth}@${hostName}:${port}`;
        }
        return redis_1.createClient(clientOptions);
    }
    /**
     * @deprecated Use more generic setValueForService instead
     */
    setItem({ serviceId, userBossKey, sessionId, cacheItemValue }) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkConnection();
            const setAsync = util_1.promisify(this.client.set).bind(this.client);
            const key = this.getFullItemKey(serviceId, userBossKey, sessionId);
            yield setAsync(key, JSON.stringify(cacheItemValue), 'PX', KEY_TTL_TIME);
        });
    }
    setValueForService(params, option) {
        return __awaiter(this, void 0, void 0, function* () {
            const isLocalCacheShouldBeUsed = !externalDependencies_1.envUtils.isHub() && (option === null || option === void 0 ? void 0 : option.useLocalCacheAsFallback);
            if (!isLocalCacheShouldBeUsed) {
                this.checkConnection();
            }
            const setAsync = util_1.promisify(this.client.set).bind(this.client);
            const composedKey = `${process.env.env}:${params.serviceId}:${params.key}`;
            if (isLocalCacheShouldBeUsed) {
                this.putValueToLocalCache(composedKey, params.value, (option === null || option === void 0 ? void 0 : option.TTL) || DEFAULT_SET_TTL);
            }
            else {
                yield setAsync(composedKey, params.value, 'EX', (option === null || option === void 0 ? void 0 : option.TTL) || DEFAULT_SET_TTL);
            }
        });
    }
    getValueForServiceByKey(params, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const isLocalCacheShouldBeUsed = !externalDependencies_1.envUtils.isHub() && (options === null || options === void 0 ? void 0 : options.useLocalCacheAsFallback);
            if (!isLocalCacheShouldBeUsed) {
                this.checkConnection();
            }
            const getAsync = util_1.promisify(this.client.get).bind(this.client);
            const composedKey = `${process.env.env}:${params.serviceId}:${params.key}`;
            const cachedValue = isLocalCacheShouldBeUsed
                ? this.getValueFromLocalCache(composedKey)
                : yield getAsync(composedKey);
            return cachedValue;
        });
    }
    getKeysForServiceByPattern(params) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkConnection();
            const composedKeyPattern = `${process.env.env}:${params.serviceId}:${params.keyPattern}`;
            const cachedValues = yield this.scanForKeys(composedKeyPattern);
            // return Keys without ENV and Service Id prefixes
            return cachedValues.map(value => value.replace(/^[^:]*:[^:]*:/, ''));
        });
    }
    removeByKey(params) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkConnection();
            const delAsync = util_1.promisify(this.client.del).bind(this.client);
            const composedKey = `${process.env.env}:${params.serviceId}:${params.key}`;
            yield delAsync(composedKey);
        });
    }
    /**
     * @deprecated Use more generic getValueForServiceByKey instead
     */
    getItem({ serviceId, userBossKey, sessionId, cacheItemKey }) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkConnection();
            const getAsync = util_1.promisify(this.client.get).bind(this.client);
            const key = this.getFullItemKey(serviceId, userBossKey, sessionId, cacheItemKey);
            const cacheItem = yield getAsync(key);
            return JSON.parse(cacheItem);
        });
    }
    getKeys({ serviceId, userBossKey, sessionId, keysPattern }) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkConnection();
            const pattern = this.getFullItemKey(serviceId, userBossKey, sessionId, keysPattern);
            const keys = yield this.scanForKeys(pattern);
            return keys;
        });
    }
    deleteItem(cacheItemKey) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkConnection();
            const delAsync = util_1.promisify(this.client.del).bind(this.client);
            yield delAsync(cacheItemKey);
        });
    }
    cleanSessionCache({ serviceId, userBossKey, sessionId }) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkConnection();
            const keysPattern = this.getFullItemKey('*', userBossKey, sessionId);
            const keys = yield this.getKeys({
                serviceId,
                userBossKey,
                sessionId,
                keysPattern,
            });
            yield Promise.all(keys.map((cacheItemKey) => this.deleteItem(cacheItemKey)));
        });
    }
    isRedisConnected() {
        return !this.connectionIsFailed;
    }
    checkConnection() {
        if (this.connectionIsFailed) {
            throw new Error(`Redis connection error: ${this.connectionErrorMessage}`);
        }
    }
    scanForKeys(scanPattern) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkConnection();
            const scanAsync = util_1.promisify(this.client.scan).bind(this.client);
            const startCursor = '0';
            let keys = [];
            const scanAll = (pattern, cursorPosition) => __awaiter(this, void 0, void 0, function* () {
                const scanReplay = yield scanAsync(cursorPosition, 'MATCH', pattern, 'COUNT', SCAN_KEY_COUNT);
                const currentCursor = scanReplay[0];
                keys = keys.concat(scanReplay[1]);
                if (currentCursor !== '0') {
                    yield scanAll(pattern, currentCursor);
                }
            });
            yield scanAll(scanPattern, startCursor);
            return keys;
        });
    }
    getFullItemKey(serviceId, userBossKey, sessionId, keysPattern) {
        if (keysPattern) {
            return keysPattern;
        }
        if (serviceId && userBossKey && sessionId) {
            return `${ENVIRONMENT_PREFIX}:${serviceId}:${userBossKey}:${sessionId}`;
        }
        return '';
    }
    putValueToLocalCache(key, value, ttl) {
        const ttlInMilliseconds = ttl * 1000;
        this.localCache[key] = {
            value,
            expirationTime: Date.now() + ttlInMilliseconds,
        };
    }
    getValueFromLocalCache(key) {
        const cachedData = this.localCache[key];
        const isCacheExpired = cachedData && cachedData.expirationTime < Date.now();
        if (isCacheExpired) {
            delete this.localCache[key];
        }
        return cachedData && !isCacheExpired ? cachedData.value : null;
    }
}
exports.default = new RedisCacheService();
//# sourceMappingURL=redisCacheService.js.map
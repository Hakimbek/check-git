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
exports.ConcurrencyCore = void 0;
const concurrency_dao_osa2_1 = require("./concurrency.dao.osa2");
const cache_service_1 = require("./services/cache.service");
const externalDependencies_1 = require("../../../externalDependencies");
const SEAT_TIMEOUT = 30;
const ENVIRONMENT_PREFIX = ((_a = process.env.env) === null || _a === void 0 ? void 0 : _a.toUpperCase()) || 'debug';
const APP_VERSION = externalDependencies_1.envUtils.getAppVersion(); // branch name also
const SERVICE_ID = 'arm_concurrency_svc';
if (ENVIRONMENT_PREFIX === 'debug') {
    // should be executed only on dev machines
    console.log('ENV: ', ENVIRONMENT_PREFIX);
    console.log('app version: ', APP_VERSION);
}
const AUTHORS_UNDER_CONCURRENCY_CONTROL = [
    'AICPA - American Institute of Certified Public Accountants',
    'COSO - Committee of Sponsoring Organizations of the Treadway Commission',
    'FASB - Financial Accounting Standards Board',
    'GASB - Governmental Accounting Standards Board',
    'IASB - International Accounting Standards Board',
    'IIA - The Institute of Internal Auditors',
];
class ConcurrencyCore {
    constructor({ logService, analyticsService } = {}) {
        this.logService = {
            error: (message, data) => {
                var _a;
                try {
                    const extendedLogData = Object.assign({}, { svc_id: SERVICE_ID }, data);
                    (_a = this.externalLogService) === null || _a === void 0 ? void 0 : _a.error(message, extendedLogData);
                }
                catch (error) {
                    if (ENVIRONMENT_PREFIX === 'debug') {
                        console.log(error);
                        console.log(message, data);
                    }
                }
            },
            info: (message, data) => {
                var _a;
                try {
                    const extendedLogData = Object.assign({}, { svc_id: SERVICE_ID }, data);
                    (_a = this.externalLogService) === null || _a === void 0 ? void 0 : _a.info(message, extendedLogData);
                }
                catch (error) {
                    if (ENVIRONMENT_PREFIX === 'debug') {
                        console.log(error);
                        console.log(message, data);
                    }
                }
            },
        };
        cache_service_1.CacheService.SEAT_TIMEOUT = SEAT_TIMEOUT;
        this.externalLogService = logService;
        this.externalAnalyticsService = analyticsService;
    }
    hasDocumentSeats(req, id, bosKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const docMetadata = yield this.getRequiredDocMetadata(req, id);
            const isConcurrencyControlApplicable = this.getIsConcurrencyControlApplicableByAuthor(docMetadata.author);
            if (!isConcurrencyControlApplicable) {
                return true;
            }
            const seatsSubscriptionsMetadata = yield this.getSeatSubscriptionsMetadata(req, id);
            let failedTries = 0;
            let subscriptionId = null;
            const subscriptionsIds = [];
            for (let i = 0; i < seatsSubscriptionsMetadata.length; i++) {
                const seatsMetadata = [seatsSubscriptionsMetadata[i]];
                const maxSeatsNumber = this.getMaxAvailableSeats(seatsMetadata).value;
                // if EnforceConcurrency === F of SubscriptionId metadata attribute
                if (maxSeatsNumber === '0') {
                    return true;
                }
                subscriptionId = this.getSubscriptionId(seatsMetadata);
                subscriptionsIds.push(subscriptionId);
                try {
                    yield this.acquireLicenseForSubscription({
                        bosKey,
                        maxSeatsNumber: Number(maxSeatsNumber),
                        subscriptionId,
                    });
                    break;
                }
                catch (error) {
                    failedTries++;
                }
            }
            if (failedTries === seatsSubscriptionsMetadata.length && seatsSubscriptionsMetadata.length > 0) {
                let concurrentUsers = [];
                try {
                    concurrentUsers = concurrentUsers.concat(...(yield Promise.all(subscriptionsIds.map(subscriptionId => this.getConcurrentUsers(req, subscriptionId)))));
                }
                catch (error) {
                    this.logService.error('Cannot get concurrent users info', error);
                }
                this.trackSeatAcquisition({
                    req,
                    subscriptionId,
                    seatsSubscriptionsMetadata,
                    successful: false,
                    publicationName: docMetadata.publicationName,
                });
                throw new Error(JSON.stringify({ message: 'Getting license failed', concurrentUsers: concurrentUsers }));
            }
            // the seat license acquired/updated, the document can be opened
            this.trackSeatAcquisition({
                req,
                subscriptionId,
                seatsSubscriptionsMetadata,
                successful: true,
                publicationName: docMetadata.publicationName,
            });
            return true;
        });
    }
    releaseSeat(bosKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const savedSeatKeys = yield cache_service_1.CacheService.getKeysByBosKey(bosKey);
            savedSeatKeys.forEach((savedSeatKey) => __awaiter(this, void 0, void 0, function* () {
                if (savedSeatKey) {
                    const cachedKeyData = this.getDataFromCachedKey(savedSeatKey);
                    yield cache_service_1.CacheService.removeKey(savedSeatKey);
                    try {
                        yield concurrency_dao_osa2_1.LicenseDAO.release(cachedKeyData.licenseName, cachedKeyData.licenseGuid);
                    }
                    catch (error) {
                        this.logService.error('Cannot release license', error);
                    }
                }
            }));
            // return number of released seats
            return savedSeatKeys.length;
        });
    }
    getConcurrentUsers(req, subscriptionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const concurrentBosKeys = yield this.getConcurrentBosKeys(subscriptionId);
            let concurrentUsersInfo = [];
            try {
                concurrentUsersInfo = yield concurrency_dao_osa2_1.UsersDAO.getConcurrentUsersInfo(req, concurrentBosKeys);
            }
            catch (error) {
                // cannot get user info for some reason
                this.logService.error('Cannot get concurrent user info', error);
            }
            const productName = yield concurrency_dao_osa2_1.UsersDAO.getProductName(req, subscriptionId);
            const isIPAnonymousUser = externalDependencies_1.userTypeService.isIPAnonymousUser(req);
            return concurrentBosKeys.map(bosKey => {
                const userInfo = concurrentUsersInfo.find(user => user.userKey === bosKey);
                const userName = `${(userInfo === null || userInfo === void 0 ? void 0 : userInfo.name) || ''} ${(userInfo === null || userInfo === void 0 ? void 0 : userInfo.lastName) || ''}`;
                return {
                    name: isIPAnonymousUser ? 'Anonymous User' : userName,
                    username: isIPAnonymousUser ? 'N/A ' : userInfo === null || userInfo === void 0 ? void 0 : userInfo.loginId,
                    subscription: productName,
                };
            });
        });
    }
    acquireLicenseForSubscription({ bosKey, subscriptionId, maxSeatsNumber, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const cachedSeatKey = yield cache_service_1.CacheService.getKeyBySubscriptionIdAndBosKey(bosKey, subscriptionId);
            if (cachedSeatKey) {
                try {
                    yield this.refreshSeatLicense({
                        savedSeatKey: cachedSeatKey,
                        bosKey,
                        subscriptionId,
                        seatLimit: Number(maxSeatsNumber),
                    });
                    return true;
                }
                catch (error) {
                    throw new Error('Refresh Error');
                }
            }
            else {
                try {
                    yield this.acquireSeatLicense({ subscriptionId, bosKey, seatLimit: Number(maxSeatsNumber) });
                    return true;
                }
                catch (error) {
                    throw new Error('Acquire Error');
                }
            }
        });
    }
    getConcurrentBosKeys(subscriptionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const cachedKeys = yield cache_service_1.CacheService.getKeysBySubscriptionId(subscriptionId);
            return cachedKeys.map(cachedKey => { var _a; return (_a = this.getDataFromCachedKey(cachedKey)) === null || _a === void 0 ? void 0 : _a.bosKey; });
        });
    }
    acquireSeatLicense({ subscriptionId, bosKey, seatLimit, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const licenseName = this.getLicenseName(subscriptionId);
            let acquiringSuccess = false;
            // it should throw an error if acquiring is not possible
            try {
                const licenseGuid = yield concurrency_dao_osa2_1.LicenseDAO.acquire({
                    licenseName: licenseName,
                    seatLimit: seatLimit,
                    seatTimeOutInMinutes: SEAT_TIMEOUT,
                });
                acquiringSuccess = true;
                yield this.releaseSeat(bosKey);
                // release current seat if it is in cache
                yield cache_service_1.CacheService.addEntry({ key: `${licenseName}:${bosKey}:${licenseGuid}`, value: bosKey });
            }
            catch (error) {
                if (!acquiringSuccess) {
                    // release all user seats if acquiring failed, to avoid extra blocking
                    this.releaseSeat(bosKey);
                }
                this.logService.error('Cannot acquire seat', error);
                throw new Error('Cannot acquire seat');
            }
        });
    }
    getLicenseName(subscriptionId) {
        return `${ENVIRONMENT_PREFIX}_${APP_VERSION}_${subscriptionId}`;
    }
    refreshSeatLicense({ bosKey, savedSeatKey, seatLimit, subscriptionId, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { licenseGuid } = this.getDataFromCachedKey(savedSeatKey);
            const licenseName = this.getLicenseName(subscriptionId);
            try {
                const updatedLicenseGuid = yield concurrency_dao_osa2_1.LicenseDAO.refreshAcquire({
                    licenseGuid,
                    licenseName: licenseName,
                    seatTimeOutInMinutes: SEAT_TIMEOUT,
                    seatLimit: seatLimit,
                });
                yield cache_service_1.CacheService.addEntry({ key: `${licenseName}:${bosKey}:${licenseGuid}`, value: bosKey });
                if (updatedLicenseGuid !== licenseGuid) {
                    yield cache_service_1.CacheService.removeKey(savedSeatKey);
                    yield concurrency_dao_osa2_1.LicenseDAO.release(licenseName, licenseGuid);
                }
            }
            catch (error) {
                this.logService.error('Cannot refresh license', error);
                // Do we want to remove all user seats in that case?
                try {
                    yield concurrency_dao_osa2_1.LicenseDAO.release(licenseName, licenseGuid);
                }
                catch (licenseApiError) {
                    this.logService.error('Cannot release license name after failed refresh try', licenseApiError);
                }
                yield cache_service_1.CacheService.removeKey(savedSeatKey);
                throw new Error('Seat cannot be refreshed');
            }
        });
    }
    getDataFromCachedKey(cacheKey) {
        const dataGroups = cacheKey.match(/^([^:]*):([^:]*):([^:]*)$/);
        const licenseGuidIndex = 3;
        const bosKeyIndex = 2;
        const licenseNameIndex = 1; // subscription id
        return {
            licenseGuid: dataGroups[licenseGuidIndex],
            bosKey: dataGroups[bosKeyIndex],
            licenseName: dataGroups[licenseNameIndex],
        };
    }
    getRequiredDocMetadata(req, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const authorMetadataKey = 'pcicore:isIssuedBy';
            const bookMetadataKey = 'pcicore:isInPublication';
            const documentMetadata = yield concurrency_dao_osa2_1.DocumentDAO.getDocumentMetadata(req, id, [authorMetadataKey, bookMetadataKey]);
            const documentAuthorAttribute = this.getMetadataAttributeEntry(documentMetadata.objects, authorMetadataKey, 'foaf:name');
            const documentBookAttribute = this.getMetadataAttributeEntry(documentMetadata.objects, bookMetadataKey, 'skos:prefLabel');
            return {
                author: documentAuthorAttribute === null || documentAuthorAttribute === void 0 ? void 0 : documentAuthorAttribute.value,
                publicationName: documentBookAttribute === null || documentBookAttribute === void 0 ? void 0 : documentBookAttribute.value,
            };
        });
    }
    getIsConcurrencyControlApplicableByAuthor(docAuthor) {
        return AUTHORS_UNDER_CONCURRENCY_CONTROL.includes(docAuthor);
    }
    // this call is used only when document is applicable for concurrency flow
    // due to it's complexity on GA side (according to solution):
    // GA_SEAT_SUBSCRIPTION metadata is calculated
    getSeatSubscriptionsMetadata(req, id) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const seatMetadataKey = 'SEAT_SUBSCRIPTION';
            const metadata = yield concurrency_dao_osa2_1.DocumentDAO.getDocumentMetadata(req, id, [`GA_${seatMetadataKey}`]);
            const seatMeatadata = (_a = metadata.groups) === null || _a === void 0 ? void 0 : _a.find(group => group.name === seatMetadataKey);
            if (!seatMeatadata) {
                return [];
            }
            return [...seatMeatadata.objects];
        });
    }
    getMaxAvailableSeats(metadata) {
        const seatsNumber = this.getMetadataAttributeEntry(metadata, 'SubscriptionId', 'NumOfSeats');
        return seatsNumber;
    }
    getSubscriptionId(metadata) {
        const metadataEntry = metadata.find(entry => entry.name === 'SubscriptionId');
        return metadataEntry.value;
    }
    getMetadataAttributeEntry(metadataList, metadataName, attributeKey) {
        var _a;
        const metadataEntry = metadataList.find(entry => entry.name === metadataName);
        const attributeEntry = (_a = metadataEntry === null || metadataEntry === void 0 ? void 0 : metadataEntry.attributes) === null || _a === void 0 ? void 0 : _a.find(entry => entry.key === attributeKey);
        return attributeEntry;
    }
    trackSeatAcquisition({ req, subscriptionId, seatsSubscriptionsMetadata, successful, publicationName, }) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            let customEventParams = null;
            try {
                const relatedSubscriptionsIds = [];
                for (let i = 0; i < seatsSubscriptionsMetadata.length; i++) {
                    const seatsMetadata = [seatsSubscriptionsMetadata[i]];
                    subscriptionId = this.getSubscriptionId(seatsMetadata);
                    relatedSubscriptionsIds.push(subscriptionId);
                }
                const cachedKeysPromises = [];
                for (let i = 0; i <= relatedSubscriptionsIds.length; i++) {
                    cachedKeysPromises.push(cache_service_1.CacheService.getKeysBySubscriptionId(relatedSubscriptionsIds[i]));
                }
                const cachedKeys = (yield Promise.all(cachedKeysPromises)).reduce((allKeys, keys) => {
                    if (keys) {
                        return allKeys.concat(keys);
                    }
                    else {
                        return allKeys;
                    }
                }, []);
                const eventName = SERVICE_ID;
                customEventParams = {
                    eventType: 'AppEvent',
                    subType: successful ? 'successfulSeatAcquisition' : 'failedSeatAcquisition',
                    subscriptionId: successful ? subscriptionId : relatedSubscriptionsIds.join(','),
                    count: cachedKeys.length,
                    publicationName: publicationName,
                };
                yield ((_a = this.externalAnalyticsService) === null || _a === void 0 ? void 0 : _a.trackCustomEvent({
                    eventName,
                    customEventParams,
                    req,
                    isExternalUser: false,
                }));
            }
            catch (error) {
                (_b = this.externalLogService) === null || _b === void 0 ? void 0 : _b.error('concurrency svc sending analytics event error ', customEventParams);
            }
        });
    }
}
exports.ConcurrencyCore = ConcurrencyCore;
//# sourceMappingURL=concurrency.service.js.map
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const log_base_1 = require("@wk/log-base");
const constants_1 = require("../../config/constants");
const externalDependencies_1 = require("../../externalDependencies");
const osaService_1 = __importDefault(require("../common/osaService"));
const MAX_RIGHTS_RESULTS_SIZE = 4000;
const INITIAL_EXPAND_STEP = 1;
class AbstractClaimsService {
    constructor() {
        this.userName = '<UserName>';
        this.lastUpdateDate = 0;
        this.updateClaimsInterval = externalDependencies_1.vars.get('updateClaimsInterval');
        this.updateClaimsSuccessInterval = this.updateClaimsInterval;
    }
    getClaims(requestData) {
        if (!this.claimsPromise || Date.now() - this.lastUpdateDate > this.updateClaimsInterval) {
            this.lastUpdateDate = Date.now();
            externalDependencies_1.logService.logRequest(log_base_1.LogLevel.Info, requestData, {
                message: `Getting ${this.userName} user claims is started`,
            });
            this.claimsPromise = this.updateClaims(this.getRequestData(requestData))
                .then((claims) => {
                externalDependencies_1.logService.logRequest(log_base_1.LogLevel.Info, requestData, {
                    message: `Getting ${this.userName} user claims is ended successfully`,
                });
                this.updateClaimsInterval = this.updateClaimsSuccessInterval;
                return Promise.resolve(claims);
            })
                .catch(error => {
                this.updateClaimsInterval = constants_1.UPDATE_CLAIMS_FAILED_INTERVAL;
                externalDependencies_1.logService.logRequest(log_base_1.LogLevel.Error, requestData, {
                    message: `Failed to get ${this.userName} user claims`,
                }, error);
                return Promise.reject(error);
            });
        }
        return this.claimsPromise;
    }
    // Note: method should be redefined
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateClaims(requestData) {
        return Promise.resolve(null);
    }
    getRights(requestData) {
        return __awaiter(this, void 0, void 0, function* () {
            const rights = yield osaService_1.default
                .createDomainServiceInstance(constants_1.URM_DOMAIN_NAME, requestData)
                .rights.many();
            if (rights.hasNext) {
                return this.expandRights(rights, INITIAL_EXPAND_STEP);
            }
            return rights;
        });
    }
    getRequestData(_a) {
        var { headers: { 'user-agent': userAgent } } = _a, requestData = __rest(_a, ["headers"]);
        return Object.assign(Object.assign({}, requestData), { forwardedAuthorization: `freemium ${this.userName}`, headers: {
                'user-agent': userAgent,
            } });
    }
    expandRights(initialRightsRef, step, rightsSum = []) {
        return __awaiter(this, void 0, void 0, function* () {
            if (step === INITIAL_EXPAND_STEP) {
                rightsSum = initialRightsRef;
            }
            if (initialRightsRef.hasNext) {
                const expandedRights = yield initialRightsRef.next({
                    $skip: step * MAX_RIGHTS_RESULTS_SIZE,
                });
                rightsSum = rightsSum.concat(expandedRights);
                return expandedRights.hasNext ? this.expandRights(initialRightsRef, ++step, rightsSum) : rightsSum;
            }
            return rightsSum;
        });
    }
}
exports.default = AbstractClaimsService;
//# sourceMappingURL=AbstractClaimsService.js.map
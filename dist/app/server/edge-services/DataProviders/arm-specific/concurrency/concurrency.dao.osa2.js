"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersDAO = exports.DocumentDAO = exports.LicenseDAO = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const osa_urm_1 = require("@wk/osa-urm");
const externalDependencies_1 = require("../../../externalDependencies");
const osaService_1 = __importDefault(require("../../../services/common/osaService"));
const CommonDAO = __importStar(require("../../Common/CommonDAO.osa2"));
const LICENSE_API_HOST = (_a = externalDependencies_1.vars.get('arm')) === null || _a === void 0 ? void 0 : _a.license_api_host;
const LICENSE_API_KEY = process.env.ARMAC_LICENSE_API_KEY;
const LICENSE_API_REQUEST_CONTENT_TYPE = 'application/json';
class LicenseDAO {
    static acquire(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiResponse = yield node_fetch_1.default(`${LICENSE_API_HOST}/License/Acquire`, {
                method: 'POST',
                headers: {
                    'Ocp-Apim-Subscription-Key': LICENSE_API_KEY,
                    'Content-Type': LICENSE_API_REQUEST_CONTENT_TYPE,
                },
                body: JSON.stringify(Object.assign({}, params)),
            });
            const acquiringResult = yield apiResponse.json();
            if (acquiringResult.success) {
                return acquiringResult.newSeatGuid;
            }
            throw new Error(acquiringResult.message);
        });
    }
    static release(licenseName, licenseGuid) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiResponse = yield node_fetch_1.default(`${LICENSE_API_HOST}/License/Release`, {
                method: 'POST',
                headers: {
                    'Ocp-Apim-Subscription-Key': LICENSE_API_KEY,
                    'Content-Type': LICENSE_API_REQUEST_CONTENT_TYPE,
                },
                body: JSON.stringify({ licenseName, guid: licenseGuid }),
            });
            const releasingResult = yield apiResponse.json();
            if (releasingResult.success) {
                return;
            }
            throw new Error(releasingResult.message);
        });
    }
    static refreshAcquire(param) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiResponse = yield node_fetch_1.default(`${LICENSE_API_HOST}/License/AcquireRefresh`, {
                method: 'POST',
                headers: {
                    'Ocp-Apim-Subscription-Key': LICENSE_API_KEY,
                    'Content-Type': LICENSE_API_REQUEST_CONTENT_TYPE,
                },
                body: JSON.stringify({
                    licenseName: param.licenseName,
                    guid: param.licenseGuid,
                    seatTimeOutInMinutes: param.seatTimeOutInMinutes,
                    seatLimit: param.seatLimit,
                }),
            });
            const refreshingResult = yield apiResponse.json();
            if (refreshingResult.success) {
                return refreshingResult.seat.guid;
            }
            throw new Error(refreshingResult.message);
        });
    }
}
exports.LicenseDAO = LicenseDAO;
class DocumentDAO {
    static getDocumentMetadata(req, documentId, metadataKeys) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield CommonDAO.getDocumentsExtendedMetadata(req, [documentId], metadataKeys);
            return result[0].metadata[0];
        });
    }
}
exports.DocumentDAO = DocumentDAO;
class UsersDAO {
    static getConcurrentUsersInfo(req, bosKeys) {
        return __awaiter(this, void 0, void 0, function* () {
            const defaultOsaUrl = osaService_1.default.getOsaUrl();
            // this request uses special hidden for client osa service
            osaService_1.default.setOsaUrl('/private-osa/@@OSA-DOMAIN-NAME@@');
            const osaUrmService = osaService_1.default.createDomainServiceInstance(osa_urm_1.domain.name, req);
            osaService_1.default.setOsaUrl(defaultOsaUrl);
            const users = yield osaUrmService.users.many({
                $filter: bosKeys.map(bosKey => `UserKey eq '${bosKey}'`).join(' or '),
            });
            // we need to update osa urm version
            return users.map((user) => ({
                loginId: user.loginId,
                name: user.name,
                lastName: user.surname,
                userKey: user.userKey,
            }));
        });
    }
    static getProductName(req, subscriptionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const osaUrmService = osaService_1.default.createDomainServiceInstance(osa_urm_1.domain.name, req);
            const product = yield osaUrmService.requestEntityProperty(new osa_urm_1.Subscription({ id: subscriptionId }), 'Product');
            return product.description;
        });
    }
}
exports.UsersDAO = UsersDAO;
//# sourceMappingURL=concurrency.dao.osa2.js.map
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
exports.getUserRegistrationDAO = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const edge_services_1 = require("@wk/acm-osa-service/edge-services");
const edge_services_2 = require("@wk/edge-services");
const osa_personalitem_1 = require("@wk/osa-personalitem");
const user_registration_1 = require("../../client-server/user-registration");
const constants_1 = require("../../config/constants");
const global_constants_1 = require("../../global.constants");
const user_registration_constants_1 = require("./user-registration.constants");
const icAdminUrl = global_constants_1.vars.get('ICAdminUrl');
function getUserRegistrationDAO() {
    function registerUser(req, registerData) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const osaPersonalItemService = edge_services_1.osaService.createDomainServiceInstance(osa_personalitem_1.PersonalitemOsaService, osa_personalitem_1.domain.name, req);
            try {
                const createOrUpdateUserUrl = yield osaPersonalItemService.getToolUrl(new osa_personalitem_1.GetToolUrl({
                    toolLink: `${icAdminUrl}rest/icadmin/createOrUpdateUser`,
                }));
                const request = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': user_registration_constants_1.AUTHORIZATION_HEADER,
                    },
                    body: JSON.stringify(Object.assign(Object.assign({}, registerData), { tenantId: user_registration_constants_1.NA_TENANT_ID, city: '', country: '', subAccountNumber: [], state: '', businessUnit: '', modelUserId: '', endUserSystemId: '', emailTrigger: true })),
                };
                const response = yield node_fetch_1.default(createOrUpdateUserUrl, request);
                const responseJSON = yield response.json();
                if (responseJSON.errorCode !== user_registration_constants_1.SUCCESS_CODE || !responseJSON.enduserSystemID) {
                    if (responseJSON.errorCode === user_registration_constants_1.ERROR_CODE_1 &&
                        responseJSON.errorMessage === user_registration_constants_1.DUPLICATE_USER_ID_RES_ERROR_MESSAGE) {
                        throw new edge_services_2.ServiceError(constants_1.RESPONSE_STATUSES.BAD_REQUEST, user_registration_1.RegisterUserErrorResponseEnum.DUBLICATE_EMAIL_ERROR);
                    }
                    if (responseJSON.errorCode === user_registration_constants_1.ERROR_CODE_100 && ((_a = responseJSON.errorMessage) === null || _a === void 0 ? void 0 : _a.includes(user_registration_constants_1.INVALID_FIRST_OR_LAST_NAME_RES_ERROR_MESSAGE))) {
                        throw new edge_services_2.ServiceError(constants_1.RESPONSE_STATUSES.BAD_REQUEST, user_registration_1.RegisterUserErrorResponseEnum.FIRST_LAST_NAME_INVALID_ERROR);
                    }
                    if (responseJSON.errorCode === user_registration_constants_1.ERROR_CODE_1 &&
                        responseJSON.errorMessage === user_registration_constants_1.ACCOUNT_LIMITS_RES_ERROR_MESSAGE) {
                        throw new edge_services_2.ServiceError(constants_1.RESPONSE_STATUSES.BAD_REQUEST, user_registration_1.RegisterUserErrorResponseEnum.ACCOUNT_LIMITS_ERROR);
                    }
                    throw new edge_services_2.ServiceError(constants_1.RESPONSE_STATUSES.BAD_REQUEST, user_registration_1.RegisterUserErrorResponseEnum.COMMON_ERROR);
                }
                return { status: constants_1.RESPONSE_STATUSES.SUCCESS, enduserSystemID: responseJSON.enduserSystemID };
            }
            catch (error) {
                if (user_registration_1.RegisterUserErrorResponseEnum[error.message]) {
                    throw error;
                }
                throw new edge_services_2.ServiceError(constants_1.RESPONSE_STATUSES.INTERNAL_SERVER_ERROR, user_registration_1.RegisterUserErrorResponseEnum.COMMON_ERROR);
            }
        });
    }
    return {
        registerUser,
    };
}
exports.getUserRegistrationDAO = getUserRegistrationDAO;
//# sourceMappingURL=user-registration.dao.js.map
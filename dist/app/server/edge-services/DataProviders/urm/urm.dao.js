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
exports.getURMDAO = void 0;
const osa_urm_1 = require("@wk/osa-urm");
const constants_1 = require("../../config/constants");
const osaService_1 = __importDefault(require("../../services/common/osaService"));
function getURMDAO() {
    function getUserGroupSubscriptions(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const urmService = osaService_1.default.createDomainServiceInstance(constants_1.URM_DOMAIN_NAME, req);
                const response = yield urmService.getUserGroupSubscriptions(new osa_urm_1.GetUserGroupSubscriptions({}));
                return response.userGroupSubscriptions;
            }
            catch (error) {
                throw error;
            }
        });
    }
    return {
        getUserGroupSubscriptions,
    };
}
exports.getURMDAO = getURMDAO;
//# sourceMappingURL=urm.dao.js.map
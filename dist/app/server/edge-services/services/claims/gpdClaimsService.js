"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const log_base_1 = require("@wk/log-base");
const AbstractClaimsService_1 = __importDefault(require("./AbstractClaimsService"));
const constants_1 = require("../../config/constants");
const externalDependencies_1 = require("../../externalDependencies");
class GpdClaimsService extends AbstractClaimsService_1.default {
    constructor() {
        super(...arguments);
        this.userName = constants_1.GPD_USER_NAME;
    }
    updateClaims(requestData) {
        externalDependencies_1.logService.logRequest(log_base_1.LogLevel.Info, requestData, {
            message: `Retrieving ${this.userName} user rights is started.`,
        });
        return this.getRights(requestData)
            .then(rights => {
            externalDependencies_1.logService.logRequest(log_base_1.LogLevel.Info, requestData, {
                message: `Retrieving ${this.userName} user rights is ended (${rights.length} pcs.).`,
            });
            return rights.reduce((claims, item) => {
                claims[item['id']] = true;
                return claims;
            }, {});
        })
            .catch(err => {
            externalDependencies_1.logService.logRequest(log_base_1.LogLevel.Error, requestData, {
                message: `Failed to retrieve list of rights for ${this.userName} user.`,
            }, err);
            return Promise.reject(err);
        });
    }
}
exports.default = new GpdClaimsService();
//# sourceMappingURL=gpdClaimsService.js.map
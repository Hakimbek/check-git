"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const log_base_1 = require("@wk/log-base");
const constants_1 = require("../../config/constants");
const externalDependencies_1 = require("../../externalDependencies");
const gpdClaimsService_1 = __importDefault(require("../../services/claims/gpdClaimsService"));
class GpdUserClaimsRoute {
    handler(req, res) {
        externalDependencies_1.logService.logRequest(log_base_1.LogLevel.Info, req, {
            message: `Claims for ${constants_1.GPD_USER_NAME} user have been requested.`,
        });
        return gpdClaimsService_1.default
            .getClaims(req)
            .then(claims => {
            externalDependencies_1.logService.logRequest(log_base_1.LogLevel.Info, req, {
                message: `Claims for ${constants_1.GPD_USER_NAME} user  have been sent (${Object.keys(claims).length} pcs.).`,
            });
            res.status(constants_1.RESPONSE_STATUSES.SUCCESS).send(claims);
        })
            .catch(err => {
            externalDependencies_1.logService.logRequest(log_base_1.LogLevel.Error, req, {
                message: `Sending ${constants_1.GPD_USER_NAME} user claims is failed`,
            }, err);
            res.status(constants_1.RESPONSE_STATUSES.INTERNAL_SERVER_ERROR).send(err.message);
        });
    }
    middleware(req, res, next) {
        next();
    }
}
exports.default = new GpdUserClaimsRoute();
//# sourceMappingURL=claims.js.map
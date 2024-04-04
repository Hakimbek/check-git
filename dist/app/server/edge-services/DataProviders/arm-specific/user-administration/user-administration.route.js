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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserAdministrationMiddleware = void 0;
const express_1 = require("express");
const UserAdministrationService = __importStar(require("./user-administration.service"));
const constants_1 = require("../../../config/constants");
const GET_CONTACT_SITES_URL = '/get-contact-sites';
function getUserAdministrationMiddleware() {
    const router = express_1.Router();
    function getContactSites(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.send(yield UserAdministrationService.getContactSites(req));
            }
            catch (error) {
                res.status((_a = error.status) !== null && _a !== void 0 ? _a : constants_1.RESPONSE_STATUSES.INTERNAL_SERVER_ERROR).send({ error: error.message });
            }
        });
    }
    // Full API url:
    // /service/edge/services/arm/get-contact-sites
    router.get(GET_CONTACT_SITES_URL, getContactSites);
    return {
        router,
        services: {},
    };
}
exports.getUserAdministrationMiddleware = getUserAdministrationMiddleware;
//# sourceMappingURL=user-administration.route.js.map
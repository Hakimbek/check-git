"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveShortifyConfigKey = exports.getShortifyConfigKey = void 0;
const osa_shortify_1 = require("@wk/osa-shortify");
const constants_1 = require("../../../config/constants");
const osaService_1 = __importDefault(require("../../../services/common/osaService"));
const SHORTIFY_LINKS_TTI = 365 * 24 * 3600;
function getShortifyConfigKey(req, documentData) {
    const shortifyService = osaService_1.default.createDomainServiceInstance(constants_1.SHORTIFY_DOMAIN_NAME, req);
    const configKey = shortifyService.create(new osa_shortify_1.Create({
        input: JSON.stringify(documentData),
        timeToIdle: SHORTIFY_LINKS_TTI,
    }));
    return configKey;
}
exports.getShortifyConfigKey = getShortifyConfigKey;
function resolveShortifyConfigKey(req, key) {
    const shortifyService = osaService_1.default.createDomainServiceInstance(constants_1.SHORTIFY_DOMAIN_NAME, req);
    const resolvedConfigKey = shortifyService.resolve({ key });
    return resolvedConfigKey;
}
exports.resolveShortifyConfigKey = resolveShortifyConfigKey;
//# sourceMappingURL=shortify.dao.osa2.js.map
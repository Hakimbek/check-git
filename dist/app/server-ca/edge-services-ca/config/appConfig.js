"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONTENT_TYPES = void 0;
const varsService_1 = require("../services/varsService");
const appConfig = {
    ANONYMOUS_USER_AMR_KEY: 'Anonymous',
    IP_USER_AMR_KEY: 'IP',
    FORWARDED_PROTO_HEADER_NAME: 'x-forwarded-proto',
    FORWARDED_HOST_HEADER_NAME: 'X-Forwarded-Host',
    FORWARDED_SUB_HEADER_NAME: 'x-sws-token-sub',
    FORWARDED_AMR_HEADER_NAME: 'x-sws-token-amr',
    FORWARDED_AUTHORIZATION_HEADER_NAME: 'authorization',
    FORWARDED_AUTHORITY_HEADER_NAME: 'x-sws-token-authentication_authority',
    FORWARDED_SESSION_HEADER_NAME: 'x-session-token',
    PREVIOUSLY_LOGGED_IN_COOKIE_NAME: 'previously_logged_in',
    USER_TYPE_IP: 'ip-user',
    USER_TYPE_REGISTERED: 'registered',
};
const clientId = varsService_1.VarsService.get('clientId');
const osaConfig = {
    osa: {
        url: '/osa/@@OSA-DOMAIN-NAME@@',
        appendTimestamp: true,
        sessionTimeoutInMinutes: 525600,
        sessionRefreshInMinutes: 1440,
    },
    osaProductConfig: {
        default: {
            clientInfo: {
                clientId,
                version: 1,
                originip: 1,
            },
            headers: {
                'x-cpid': varsService_1.VarsService.get('cpid'),
            },
        },
    },
};
const RESPONSE_STATUSES = {
    SUCCESS: 200,
    LOCKED: 423,
    INTERNAL_SERVER_ERROR: 500,
    FORBIDDEN: 403,
};
const adminPageRegentTreeIdPostfix = varsService_1.VarsService.get('adminPageRegentTreeIdPostfix');
const REGENT_CONFIG = {
    treeId: `acca-regent-tree${adminPageRegentTreeIdPostfix}`,
    homePageWidgetsNodeId: `acca-home-page-widgets${adminPageRegentTreeIdPostfix}`,
    freemiumWidgetsNodeId: `acca-freemium-widgets${adminPageRegentTreeIdPostfix}`,
    widgetsMetadataKey: 'editorialWidgets',
    allowedIconsMetadataKey: 'editorialIcons',
    freemiumBannerMetadataKey: 'isFreemiumBannerVisible',
};
exports.CONTENT_TYPES = {
    APPLICATION_JSON: 'application/json',
};
module.exports = {
    appConfig,
    osaConfig,
    RESPONSE_STATUSES,
    clientId,
    REGENT_CONFIG,
    CONTENT_TYPES: exports.CONTENT_TYPES,
};
//# sourceMappingURL=appConfig.js.map
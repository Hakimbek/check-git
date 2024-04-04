"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LOGGING_MESSAGES = exports.FUNCTION_NAMES = exports.LOGGING_LEVELS = void 0;
exports.LOGGING_LEVELS = {
    ERROR: 'error',
    WARN: 'warn',
    INFO: 'info',
    DEBUG: 'debug',
};
exports.FUNCTION_NAMES = {
    AUTHENTICATION: 'authentificationMiddleware',
    GET_PREFERENCE: 'getPreference',
    EXCHANGE_OAUTH_CODE: 'exchangeOauthCode',
    LICENSE_AGREEMENT: 'licenseAgreementMiddleware',
    NOTIFICATION: 'notificationMiddleware',
    OSA_REDIRECT_TOOLS: 'osaRedirectTools',
    OSA_SERVICE_DEBUG: 'osaServiceDebug',
    PARSE_TOKEN: 'parseToken',
    REDIRECT_TO_LICENSE_AGREEMENT: 'redirectToLicenseAgreement',
    REFERRED_MIDDLEWARE: 'referrerdMiddleware',
    REGISTERED_FLOW: 'registeredFlow',
    STATIC_PAGES_MIDDLEWARE: 'staticPagesMiddleware',
    HTML_CONVERTER: 'htmlConverter',
    SEND_EMAIL: 'sendEmail',
};
exports.LOGGING_MESSAGES = {
    AUTHENTICATION_START: 'Started authentication flow',
    CREATE_SESSION_PROCESS_START: 'Started create session process',
    CREATE_SESSION_PROCESS_FAIL: 'Create session process has failed',
    CREATE_SESSION_SUCCESS_VALID_TOKEN: 'wkOsaIdentity.createSession: obtained token is valid',
    ERROR_WHILE_RENDER_STATIC_PAGE: 'An error occurred while rendering a static page',
    GETTING_COOKIE_FROM_HEADER_FAIL: 'Getting cookie from header url has failed',
    GETTING_TOOL_URL_PROCESS_FAIL: 'Process of getting tool url has failed',
    HAS_ACCESS_TO_PRODUCT: 'User has access to product',
    HAS_NOT_ACCESS_TO_PRODUCT: `User hasn't access to product`,
    INVALID_TOKEN: 'Auth Failed: token is invalid',
    LICENSE_AGREEMENT_SHOW_ERROR: 'Error while showing license agreement page',
    NO_TOKEN: 'No token',
    PARSE_TOKEN_FAIL: 'Failed to parse token',
    PORT_AND_NAME_SHOULD_UNIQ: 'Server port and name should be uniq',
    PREFERENCES_REQUEST_SUCCESS: 'Preferences request has been successful',
    PREFERENCES_REQUEST_FAIL: 'Preferences request has been failed',
    RENDER_STATIC_PAGE: 'Static page has been rendered',
    REDIRECT_TO_LICENSE_AGREEMENT_PAGE: 'Redirect to license agreement page',
    REDIRECT_TO_NOTIFICATION_PAGE: 'Redirect to notification page',
    SESSION_IS_VALID: 'Session is valid',
    SETTING_COOKIE_TO_RES_FAIL: 'Setting cookie to response url has failed',
    SUBSCRIPTION_VALIDATION_PROCESS_FAIL: 'User subscription validation process has failed',
    TEMPLATE_PATH_NOT_FOUND: 'Template path is not found',
    HTML_CONVERTER_SERVICE_UNAVAILABLE: 'HTML converter service unavailable',
    FAILURE_SENDING_EMAIL: 'Failure sending mail',
};
//# sourceMappingURL=loggerConstants.js.map
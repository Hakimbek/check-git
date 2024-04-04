const LOGGING_LEVELS = {
    ERROR: 'error',
    WARN: 'warn',
    INFO: 'info',
    DEBUG: 'debug',
};

const FUNCTION_NAMES = {
    NO_ACCESS: 'noAccessMiddleware',
    AUTHENTICATION: 'authentificationMiddleware',
    LICENSE_AGREEMENT: 'licenseAgreementMiddleware',
    WELCOME_PAGE: 'welcomePageResolver',
    REGISTER_OPERATION: 'registerOperation',
    REFERRER_IC: 'referrerIC',
    BRAND_REDIRECT: 'brandRedirect',
    SPOOLER_REDIRECT: 'spoolerRedirect',
    OSA_REDIRECT_TOOLS: 'osaRedirectTools',
    AURA: 'aura',
    GENERATE_CANONICAL_URL: 'generateCanonicalUrl',
    GET_INDEX_RULE: 'getIndexRule',
    STATIC_PAGES_MIDDLEWARE: 'staticPagesMiddleware',
    OSA_SERVICE_DEBUG: 'osaServiceDebug',
    CREATE_SESSION: 'createSession',
    GET_PREFERENCE: 'getPreference',
    PERMISSION_OPERATION: 'permissionOperation',
    PUBLIC_OPERATION: 'publicOperation',
    CFACTOR_POPUPS_ROUTER: 'cfactorPopupsRouter',
    REGISTERED: 'registeredMiddleware',
};

const LOGGING_MESSAGES = {
    PORT_AND_NAME_SHOULD_UNIQ: 'Server port and name should be uniq',
    LOGGER_NOT_INITIALIZED: 'LoggerService has not been initialized',
    REDIRECT_TO_ACCESS_PAGE: 'Redirect to no access page',
    REDIRECT_TO_WELCOME_PAGE: 'Redirect to welcome page',
    REDIRECT_TO_LICENSE_AGREEMENT_PAGE: 'Redirect to license agreement page',
    PERMISSION_CHECK_PROCESS_FAIL: 'Process of permission checking for given operation has failed',
    PERMISSION_CHECK_SUCCESS: 'Permission check for given operation has been successfully done',
    PERMISSION_CHECK_FAIL: 'Permission check for given operation has failed',
    SUBSCRIPTION_VALIDATION_PROCESS_FAIL: 'User subscription validation process has failed',
    AUTHENTICATION_START: 'Started authentication flow',
    LICENSE_AGREEMENT_SHOW_ERROR: 'Error while showing license agreement page',
    HAS_ACCESS_TO_PRODUCT: 'User has access to product',
    HAS_NOT_ACCESS_TO_PRODUCT: `User hasn't access to product`,
    GETTING_TOOL_URL_PROCESS_FAIL: 'Process of getting tool url has failed',
    SETTING_REP_PROCESS_FAIL: 'Process of setting repository urls to aura config has failed',
    GENERATE_CANONICAL_ERROR: 'seoInjection: cannot generate a canonical url',
    GET_INDEX_RULE_ERROR_MESSAGE: 'seoInjection: cannot get an index rule',
    RENDER_STATIC_PAGE: 'Static page has been rendered',
    ERROR_WHILE_RENDER_STATIC_PAGE: 'An error occurred while rendering a static page',
    TEMPLATE_PATH_NOT_FOUND: 'Template path is not found',
    GETTING_COOKIE_FROM_HEADER_FAIL: 'Getting cookie from header url has failed',
    SETTING_COOKIE_TO_RES_FAIL: 'Setting cookie to response url has failed',
    PREFERENCES_REQ_SUCCESS: 'Preferences request has been successful',
    PREFERENCES_REQ_FAIL: 'Preferences request has been failed',
    REDIS_DELETE_ERROR: "REDIS: Can't remove item from cache",
    REDIS_SET_ERROR: "REDIS: Can't set item to cache",
    REDIS_GET_ERROR: "REDIS: Can't get item from cache",
    CFACTOR_POPUP_REQ_FAIL: 'Failed attempt to get html file for the cfactor popup from S3 bucket',
    REDIRECT_TO_SUSPENDED_SUBSCRIPTION_PAGE: 'Redirect to suspended subscription page',
    GETTING_USER_SUBSCRIPTIONS_STATUS_PROCESS_FAIL: 'Process of getting user subscriptions status has failed',
};

module.exports = {
    LOGGING_LEVELS,
    FUNCTION_NAMES,
    LOGGING_MESSAGES,
};

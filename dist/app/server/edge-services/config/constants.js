"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UPDATE_CLAIMS_FAILED_INTERVAL = exports.DEFAULT_QUEUE_CONFIG = exports.DEFAULT_EMAIL_CONFIG = exports.CRYPTO_OUTPUT_ENCODING = exports.CRYPTO_INPUT_ENCODING = exports.CRYPTO_IV = exports.CRYPTO_SECRET = exports.CRYPTO_ALGORITHM = exports.REGEXP_DOUBLE_COMMA_PATTERN = exports.REGEXP_AMPERSAND_PATTERN = exports.REGEXP_EXTRA_SPACE_PATTERN = exports.REGEXP_TAG_PATTERN = exports.REPORT_MINUTES = exports.REPORT_HOURS = exports.REPORTS_SAFE_PERIOD = exports.REPORTS_STORE_DIR = exports.REPORT_CLEANING_JOB_REMOVE = exports.REPORT_CLEANING_JOB_RUN = exports.REPORT_CLEANING_JOB_STOP = exports.REPORT_CLEANING_JOB_START = exports.REPORT_CLEANING_JOB_REPORT_STATS_UNAVAILABLE_ERROR_MESSAGE = exports.REPORT_CLEANING_JOB_REPORTS_UNAVAILABLE_ERROR_MESSAGE = exports.CREATING_REPORTS_STORE_FAIL_MESSAGE = exports.TOPIC_LIST_REPORT_GENERATION_FAILD = exports.TOPIC_LIST_REPORT_GENERATION_SUCCESS = exports.TOPIC_LIST_REPORT_CANNOT_GET_TOPIC_BY_ID = exports.TOPIC_LIST_REPORT_START_GENERATION_PROCESS = exports.REPORT_GENERATION_OK = exports.REPORT_GENERATION_LOCKED = exports.UTF_BOM = exports.TOPIC_LIST_HEADER = exports.PROTECTED_END_POINT = exports.UI_HOST_HEADER_NAME = exports.FORWARDED_AUTHORIZATION_HEADER_NAME = exports.USERACTIVITYHISTORY_DOMAIN_NAME = exports.SHORTIFY_DOMAIN_NAME = exports.DOMAIN_NAME_PATERN = exports.QUERY_DOMAIN_NAME = exports.PERSONALITEM_DOMAIN_NAME = exports.IDENTITY_DOMAIN_NAME = exports.TOPIC_DOMAIN_NAME = exports.NOTIFICATION_DOMAIN_NAME = exports.URM_DOMAIN_NAME = exports.RESOURCE_DOMAIN_NAME = exports.RESEARCH_DOMAIN_NAME = exports.BROWSE_DOMAIN_NAME = exports.ALERTING_DOMAIN_NAME = exports.FREE_USER_NAME = exports.GPD_USER_NAME = exports.DEFAULT_REQUEST_CONFIG = void 0;
exports.PREVIOUSLY_LOGGED_IN_COOKIE_NAME = exports.CONTENT_TYPES = exports.RESPONSE_STATUSES = void 0;
exports.DEFAULT_REQUEST_CONFIG = {
    method: 'GET',
    gzip: true,
    json: true,
};
exports.GPD_USER_NAME = 'gpduser';
exports.FREE_USER_NAME = 'freeuser';
exports.ALERTING_DOMAIN_NAME = 'Alerting';
exports.BROWSE_DOMAIN_NAME = 'Browse';
exports.RESEARCH_DOMAIN_NAME = 'Research';
exports.RESOURCE_DOMAIN_NAME = 'Resource';
exports.URM_DOMAIN_NAME = 'Urm';
exports.NOTIFICATION_DOMAIN_NAME = 'Notification';
exports.TOPIC_DOMAIN_NAME = 'Topic';
exports.IDENTITY_DOMAIN_NAME = 'Identity';
exports.PERSONALITEM_DOMAIN_NAME = 'Personalitem';
exports.QUERY_DOMAIN_NAME = 'Query';
exports.DOMAIN_NAME_PATERN = '@@OSA-DOMAIN-NAME@@';
exports.SHORTIFY_DOMAIN_NAME = 'Shortify';
exports.USERACTIVITYHISTORY_DOMAIN_NAME = 'Useractivityhistory';
exports.FORWARDED_AUTHORIZATION_HEADER_NAME = 'authorization';
exports.UI_HOST_HEADER_NAME = 'x-api-key';
exports.PROTECTED_END_POINT = 'api/2.0/protected/navigation/openDocumentById';
exports.TOPIC_LIST_HEADER = 'Topic Title,API link,ID,Summary\n';
exports.UTF_BOM = '\ufeff';
exports.REPORT_GENERATION_LOCKED = 'Report generation is locked';
exports.REPORT_GENERATION_OK = 'Report generation can be started';
exports.TOPIC_LIST_REPORT_START_GENERATION_PROCESS = 'TopicList report: Start report generation process';
exports.TOPIC_LIST_REPORT_CANNOT_GET_TOPIC_BY_ID = 'ToppicList report: Cannot get topic by id ';
exports.TOPIC_LIST_REPORT_GENERATION_SUCCESS = 'TopicList report: Report generation was successful';
exports.TOPIC_LIST_REPORT_GENERATION_FAILD = 'TopicList report: Cannot get topic list. Report generation was failed';
exports.CREATING_REPORTS_STORE_FAIL_MESSAGE = 'Reports store creation failed';
exports.REPORT_CLEANING_JOB_REPORTS_UNAVAILABLE_ERROR_MESSAGE = 'Failed to get list of stored reports';
exports.REPORT_CLEANING_JOB_REPORT_STATS_UNAVAILABLE_ERROR_MESSAGE = 'Failed to get stats of a stored report';
exports.REPORT_CLEANING_JOB_START = 'Report cleaning job was started';
exports.REPORT_CLEANING_JOB_STOP = 'Report cleaning job was stopped';
exports.REPORT_CLEANING_JOB_RUN = 'Report cleaning job was run';
exports.REPORT_CLEANING_JOB_REMOVE = 'report was removed';
exports.REPORTS_STORE_DIR = 'static/reports';
exports.REPORTS_SAFE_PERIOD = 86400000;
exports.REPORT_HOURS = 24;
exports.REPORT_MINUTES = 60;
exports.REGEXP_TAG_PATTERN = /(<[^>]+>|\n|\r\n)/gi;
exports.REGEXP_EXTRA_SPACE_PATTERN = / {2,}/gi;
exports.REGEXP_AMPERSAND_PATTERN = /&amp;/gi;
exports.REGEXP_DOUBLE_COMMA_PATTERN = /"/gi;
exports.CRYPTO_ALGORITHM = 'aes256';
exports.CRYPTO_SECRET = 'ca306592-5beb-447e-a765-81ecb70d8c74';
exports.CRYPTO_IV = null;
exports.CRYPTO_INPUT_ENCODING = 'utf8';
exports.CRYPTO_OUTPUT_ENCODING = 'hex';
exports.DEFAULT_EMAIL_CONFIG = {
    body: 'This email was sent from CCH® AnswerConnect',
    subject: 'Your document from CCH AnswerConnect is ready',
    attachmentName: 'Topic Report',
    contentType: 'text/html',
};
exports.DEFAULT_QUEUE_CONFIG = {
    timeout: 1000,
    concurrency: 1,
    autostart: true,
};
exports.UPDATE_CLAIMS_FAILED_INTERVAL = 0;
exports.RESPONSE_STATUSES = {
    SUCCESS: 200,
    LOCKED: 423,
    INTERNAL_SERVER_ERROR: 500,
    FORBIDDEN: 403,
    BAD_REQUEST: 400,
};
exports.CONTENT_TYPES = {
    APPLICATION_JSON: 'application/json',
    APPLICATION_FORM_URLENCODED: 'application/x-www-form-urlencoded',
};
exports.PREVIOUSLY_LOGGED_IN_COOKIE_NAME = 'previously_logged_in';
//# sourceMappingURL=constants.js.map
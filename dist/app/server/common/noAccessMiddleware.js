const { NOACCESS_NOTIFICATION_URL } = require('../config/notificationPage.config');
const logger = require('../services/loggerService');
const {
    LOGGING_LEVELS: { INFO },
    FUNCTION_NAMES: { NO_ACCESS },
    LOGGING_MESSAGES: { REDIRECT_TO_ACCESS_PAGE },
} = require('../loggerConstants');

module.exports = (req, res) => {
    logger.logRequest(INFO, req, {
        message: REDIRECT_TO_ACCESS_PAGE,
        function: NO_ACCESS,
        url: NOACCESS_NOTIFICATION_URL,
        correlationId: req.correlationId,
    });

    res.redirect(NOACCESS_NOTIFICATION_URL);
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loggerConstants_1 = require("../loggerConstants");
const varsService_1 = require("../services/varsService");
const logger = require('../services/loggerService');
module.exports = (req, res, _next) => {
    const notificationUrl = req.notification === 'loginerror'
        ? varsService_1.VarsService.get('loginerrorNotificationUrl')
        : varsService_1.VarsService.get('noaccessNotificationUrl');
    logger.logRequest(loggerConstants_1.LOGGING_LEVELS.INFO, req, {
        message: loggerConstants_1.LOGGING_MESSAGES.REDIRECT_TO_NOTIFICATION_PAGE,
        function: loggerConstants_1.FUNCTION_NAMES.NOTIFICATION,
        url: notificationUrl,
        correlationId: req.correlationId,
    });
    res.redirect(`${req.forwardedProto}://${req.forwardedHost}${notificationUrl}`);
};
//# sourceMappingURL=notificationMiddleware.js.map
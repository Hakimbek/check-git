const logger = require('../services/loggerService');

module.exports = function (req, res, next) {
    req.correlationId = req.headers.correlationid || logger.getCorrelationId();
    next();
};

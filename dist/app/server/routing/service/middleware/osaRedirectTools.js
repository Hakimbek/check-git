const url = require('url');
const toolsService = require('../../../services/toolsService');
const { NOACCESS_NOTIFICATION_URL } = require('../../../config/notificationPage.config');
const logger = require('../../../services/loggerService');
const {
    LOGGING_LEVELS: { INFO, ERROR },
    FUNCTION_NAMES: { OSA_REDIRECT_TOOLS },
    LOGGING_MESSAGES: { GETTING_TOOL_URL_PROCESS_FAIL },
} = require('../../../loggerConstants');

const RESOLVE_ERROR_NOTIFICATION_URL = '/tools/notResolved';

module.exports = (req, res) =>
    toolsService
        .getToolUrl(req)
        .then(url => {
            logger.logRequest(INFO, req, {
                message: `Redirect to ${url}`,
                function: OSA_REDIRECT_TOOLS,
                correlationId: req.correlationId,
            });

            res.redirect(url);
        })
        .catch(error => {
            logger.logRequest(
                ERROR,
                req,
                {
                    message: GETTING_TOOL_URL_PROCESS_FAIL,
                    function: OSA_REDIRECT_TOOLS,
                    correlationId: req.correlationId,
                },
                error
            );

            if (error.code === '401') {
                logger.logRequest(INFO, req, {
                    message: `Code error = 401. Redirect to ${NOACCESS_NOTIFICATION_URL}`,
                    function: OSA_REDIRECT_TOOLS,
                    correlationId: req.correlationId,
                });

                res.redirect(NOACCESS_NOTIFICATION_URL);
            } else {
                const notificationUrl = url.format({
                    query: {
                        toolUrl: req.query.tool,
                    },
                    pathname: RESOLVE_ERROR_NOTIFICATION_URL,
                });

                logger.logRequest(INFO, req, {
                    message: `Redirect to ${notificationUrl}`,
                    function: OSA_REDIRECT_TOOLS,
                    correlationId: req.correlationId,
                });

                res.redirect(notificationUrl);
            }
        });

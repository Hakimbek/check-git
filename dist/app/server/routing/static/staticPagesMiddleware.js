const fs = require('fs');
const path = require('path');
const ejs = require('../../services/utils/ejs.util');
const logger = require('../../services/loggerService');
const { wkVars } = require('../../services/utils/vars.util');
const { getPublicDir } = require('../../services/utils/env.util');
const durationTrackingService = require('../../services/durationTrackingService');
const {
    LOGGING_LEVELS: { DEBUG, ERROR, INFO },
    FUNCTION_NAMES: { STATIC_PAGES_MIDDLEWARE },
    LOGGING_MESSAGES: { RENDER_STATIC_PAGE, ERROR_WHILE_RENDER_STATIC_PAGE, TEMPLATE_PATH_NOT_FOUND },
} = require('../../loggerConstants');

const getTemplateData = () => ({ currentYear: new Date().getFullYear() });

module.exports = function (req, res) {
    const { correlationId } = req;
    const staticPagesMap = wkVars.vars('server_staticPages');
    const templatePath = path.resolve(getPublicDir(), staticPagesMap[req.path]);

    logger.logRequest(DEBUG, req, {
        function: STATIC_PAGES_MIDDLEWARE,
        templatePath,
        correlationId,
    });

    if (fs.existsSync(templatePath)) {
        const renderStaticId = durationTrackingService.start();
        let renderStaticDuration;
        ejs.renderFile(templatePath, getTemplateData(), { delimiter: '&' })
            .then(data => {
                renderStaticDuration = durationTrackingService.end(renderStaticId);
                logger.logRequest(INFO, req, {
                    message: RENDER_STATIC_PAGE,
                    function: STATIC_PAGES_MIDDLEWARE,
                    templatePath,
                    duration: renderStaticDuration,
                    correlationId,
                });

                res.send(data);
            })
            .catch(error => {
                renderStaticDuration = durationTrackingService.end(renderStaticId);
                logger.logRequest(
                    ERROR,
                    req,
                    {
                        message: ERROR_WHILE_RENDER_STATIC_PAGE,
                        function: STATIC_PAGES_MIDDLEWARE,
                        templatePath,
                        duration: renderStaticDuration,
                        correlationId,
                    },
                    error
                );
            });
    } else {
        logger.logRequest(ERROR, req, {
            message: TEMPLATE_PATH_NOT_FOUND,
            function: STATIC_PAGES_MIDDLEWARE,
            path: req.path,
            templatePath,
            correlationId,
        });

        res.send(`${req.path} is not found`);
    }
};

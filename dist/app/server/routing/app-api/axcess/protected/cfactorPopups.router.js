const express = require('express');
const s3ClientService = require('../../../../services/s3ClientService');
const { s3AxcessBucketName } = require('../../../../services/utils/s3.util');
const logger = require('../../../../services/loggerService');
const {
    LOGGING_LEVELS: { ERROR },
    FUNCTION_NAMES: { CFACTOR_POPUPS_ROUTER },
    LOGGING_MESSAGES: { CFACTOR_POPUP_REQ_FAIL },
} = require('../../../../loggerConstants');
const analyticsService = require('../../../../services/analyticsService');

const router = express.Router();

const NOT_FOUND_STATUS_CODE = 404;
const INTERNAL_ERROR_STATUS_CODE = 500;
const NO_SUCH_KEY_ERROR_CODE = 'NoSuchKey';

router.get('/:returnType/:year/:complexityFactorName', async (req, res) => {
    const popupName = `${req.path.slice(1)}.html`;

    analyticsService.trackExternalIncomeEvent(req, res, { isExternalUser: true });

    try {
        const popupHtml = await s3ClientService.getObjectBody(popupName, s3AxcessBucketName);

        res.type('html').send(popupHtml);
    } catch (error) {
        if (error.Code === NO_SUCH_KEY_ERROR_CODE) {
            res.sendStatus(NOT_FOUND_STATUS_CODE);
        } else {
            logger.logRequest(
                ERROR,
                req,
                {
                    message: CFACTOR_POPUP_REQ_FAIL,
                    function: CFACTOR_POPUPS_ROUTER,
                    correlationId: req.correlationId,
                },
                error
            );

            res.sendStatus(INTERNAL_ERROR_STATUS_CODE);
        }
    }
});

module.exports = router;

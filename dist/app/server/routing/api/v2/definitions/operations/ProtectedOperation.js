const {
    durationTrackingService,
    subscriptionService,
    logger,
    notificationPageConfig: { NOACCESS_NOTIFICATION_URL },
    loggerConstants: {
        LOGGING_LEVELS: { INFO, ERROR },
        FUNCTION_NAMES: { PROTECTED_OPERATION },
        LOGGING_MESSAGES: { PERMISSION_CHECK_SUCCESS, PERMISSION_CHECK_FAIL, PERMISSION_CHECK_PROCESS_FAIL },
    },
} = require('./../../ApiModuleDependencies');
const PublicOperation = require('./PublicOperation');
const ApiError = require('../common/ApiError');

const ERROR_MESSAGE_NO_ACCESS = 'The user has no rights to this operation';

class ProtectedApiOperation extends PublicOperation {
    constructor(isProtected = true) {
        super(isProtected);
    }

    async checkPermissions(req, res) {
        await super.checkPermissions(req, res);
        const {
            correlationId,
            query: { keyRights },
        } = req;
        let isOperationPermitted = true;

        if (keyRights) {
            const keyRightsList = keyRights.split(',');
            const operationPermittedId = durationTrackingService.start();
            let operationPermittedDuration;
            try {
                isOperationPermitted = await subscriptionService.isOperationPermitted(keyRightsList, req);
                operationPermittedDuration = durationTrackingService.end(operationPermittedId);

                logger.logRequest(INFO, req, {
                    message: isOperationPermitted ? PERMISSION_CHECK_SUCCESS : PERMISSION_CHECK_FAIL,
                    function: PROTECTED_OPERATION,
                    duration: operationPermittedDuration,
                    correlationId,
                });
            } catch (error) {
                operationPermittedDuration = durationTrackingService.end(operationPermittedId);
                logger.logRequest(
                    ERROR,
                    req,
                    {
                        message: PERMISSION_CHECK_PROCESS_FAIL,
                        function: PROTECTED_OPERATION,
                        duration: operationPermittedDuration,
                        correlationId: correlationId,
                    },
                    error
                );
                isOperationPermitted = false;
            }
        }

        if (!isOperationPermitted) {
            throw new ApiError(ERROR_MESSAGE_NO_ACCESS, NOACCESS_NOTIFICATION_URL);
        }

        return isOperationPermitted;
    }
}

module.exports = ProtectedApiOperation;

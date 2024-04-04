const { subscriptionService } = require('../../ApiModuleDependencies');

const {
    durationTrackingService,
    logger,
    loggerConstants: {
        LOGGING_LEVELS: { INFO, ERROR },
        FUNCTION_NAMES: { PUBLIC_OPERATION },
        LOGGING_MESSAGES: { HAS_ACCESS_TO_PRODUCT, HAS_NOT_ACCESS_TO_PRODUCT, SUBSCRIPTION_VALIDATION_PROCESS_FAIL },
    },
} = require('./../../ApiModuleDependencies');

const AbstractApiOperation = require('./AbstractOperation');

class PublicApiOperation extends AbstractApiOperation {
    constructor(isProtected = false) {
        super(isProtected);
    }

    async checkPermissions(req, res) {
        await super.checkPermissions(req, res);
        let isOperationPermitted = false;
        let hasAccessToProdDuration;
        const hasAccessToProdId = durationTrackingService.start();
        const { correlationId } = req;

        try {
            isOperationPermitted = await subscriptionService.hasAccessToProduct(req);
            hasAccessToProdDuration = durationTrackingService.end(hasAccessToProdId);

            logger.logRequest(INFO, req, {
                message: isOperationPermitted ? HAS_ACCESS_TO_PRODUCT : HAS_NOT_ACCESS_TO_PRODUCT,
                function: PUBLIC_OPERATION,
                duration: hasAccessToProdDuration,
                correlationId,
            });
        } catch (error) {
            hasAccessToProdDuration = durationTrackingService.end(hasAccessToProdId);
            logger.logRequest(
                ERROR,
                req,
                {
                    message: SUBSCRIPTION_VALIDATION_PROCESS_FAIL,
                    function: PUBLIC_OPERATION,
                    duration: hasAccessToProdDuration,
                    correlationId: correlationId,
                },
                error
            );
        }

        if (!isOperationPermitted) {
            return Promise.reject(new Error('Operation is not permitted'));
        }

        return isOperationPermitted;
    }
}

module.exports = PublicApiOperation;

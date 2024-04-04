const express = require('express');
const externalDependencies = require('./../../ApiModuleDependencies');
const {
    LOGGING_LEVELS: { WARN, ERROR },
    FUNCTION_NAMES: { REGISTER_OPERATION },
} = require('../../../../../loggerConstants');

const TrackingParams = require('./../common/TrackingParams');

class AbstractApiDomain {
    constructor(urlPath) {
        if (this.constructor === AbstractApiDomain) {
            throw new TypeError('AbstractApiDomain class cannot be instantiated directly');
        }

        this.urlPath = urlPath;
        this.trackingParams = new TrackingParams();

        this.router = express.Router();
        this.operations = {};
    }

    /**
     * Registers single API operation in API domain
     * @param {string} name Name of the API operation
     * @param {function} Operation API operation constructor
     */
    registerOperation(name, Operation) {
        const operationInstance = new Operation();
        if (this.operations[name]) {
            externalDependencies.logger.log(WARN, {
                message: `Replacing existing operation "${name}"`,
                function: REGISTER_OPERATION,
            });
        }
        this.operations[name] = operationInstance;
        operationInstance.endpoints.forEach(endpoint => {
            this.router[endpoint.method](
                (operationInstance.isProtected ? '/protected' : '/public') + this.urlPath + endpoint.url,
                async (req, res) => {
                    await this.doOperation(req, res, operationInstance);
                }
            );
        });
    }

    async doOperation(req, res, operationInstance) {
        try {
            await this.preOperationTasks(req, res, operationInstance);
            await operationInstance.performTask(req, res);
            await this.postOperationTasks(req, res, operationInstance);
        } catch (error) {
            await this.handleError(req, res, error);
        }
    }

    async preOperationTasks(req, res, operationInstance) {
        // tasks performed before operation
        operationInstance.validateRequiredParams(req, res);
        await operationInstance.checkPermissions(req, res);
    }

    /*eslint-disable no-unused-vars*/
    async postOperationTasks(req, res, operationInstance) {
        // tasks performed after operation
        await this.processTrackingParams(req, res);
    }

    async handleError(req, res, error) {
        externalDependencies.logger.logRequest(
            ERROR,
            req,
            {
                message: error.message,
                correlationId: req.correlationId,
            },
            error
        );
    }

    async processTrackingParams(req, res) {
        // const trackingParams =
        this.trackingParams.getAnalyticsParamsFromRequest(req);
        // process trackingParams
    }
}

module.exports = AbstractApiDomain;

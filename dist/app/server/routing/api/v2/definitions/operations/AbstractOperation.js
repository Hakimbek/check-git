class AbstractApiOperation {
    constructor(isProtected) {
        if (this.constructor === AbstractApiOperation) {
            throw new TypeError('AbstractApiOperation class cannot be instantiated directly');
        }

        this.isProtected = isProtected;
        this.endpoints = [];
    }

    /*eslint-disable no-unused-vars*/
    async checkPermissions(req, res) {
        // implemented separately for public and protected operations
        return true;
    }

    async performTask(req, res) {
        // implemented separately for each operation
    }

    validateRequiredParams(req, res) {
        if (!this.endpoints.every(endpoint => !endpoint.requiredParams || this.isValidEndpoint(endpoint, req))) {
            throw new Error('Required parameters for API method are not provided');
        }
    }

    isValidEndpoint(endpoint, req) {
        return endpoint.options.checkingMethod === 'OR'
            ? endpoint.requiredParams.some(param => req.query[param] || req.params[param])
            : endpoint.requiredParams.every(param => req.query[param] || req.params[param]);
    }
}

module.exports = AbstractApiOperation;

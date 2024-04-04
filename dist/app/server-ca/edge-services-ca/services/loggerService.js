"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const varsService_1 = require("./varsService");
class LoggerService {
    constructor() {
        const { clientId, componentEnvironment: environment, region, tenant, } = {
            componentEnvironment: varsService_1.VarsService.getEnvFromProcessArgs(),
            region: 'NA',
            tenant: varsService_1.VarsService.get('cpid'),
            clientId: varsService_1.VarsService.get('clientId'),
        };
        this.defaultFields = { clientId, environment, region, tenant };
    }
    log(type, messageObj) {
        const logObject = this.prepareMessage(messageObj);
        logObject.level = type;
        console.log(JSON.stringify(logObject));
    }
    getChainedCorrelationId(correlationId) {
        const [chainPart] = uuid_1.v4().split('-');
        return `${correlationId}.${chainPart}`;
    }
    logRequest(type, req, configuration, error = {}) {
        const options = Object.assign(Object.assign(Object.assign({}, configuration), { reqUrl: req.originalUrl, userAgent: req.headers['user-agent'], component: 'AC-Canada-React-App' }), this.defaultFields);
        if (error) {
            options.statusCode = error.status;
        }
        this.log(type, options);
    }
    prepareMessage(message) {
        return typeof message === 'string' ? { message } : message;
    }
}
module.exports = new LoggerService();
//# sourceMappingURL=loggerService.js.map
const productInfo = require('./utils/getPackageInfo')();
const { wkVars } = require('./utils/vars.util');
const wkLog = require('@wk/log');
const {
    CorrelationId: { guid },
} = require('@wk/log/correlation-id');
const {
    LOGGING_MESSAGES: { LOGGER_NOT_INITIALIZED },
} = require('../loggerConstants');
const cloneDeep = require('lodash/cloneDeep');

const logLevel =
    process.env.env !== 'prod' &&
    process.env.env !== 'stg' &&
    process.env.env !== 'prod-ohio' &&
    process.env.env !== 'tal-tst'
        ? 'debug'
        : 'warning';
const LOG_LEVEL_INFO = 'info';
const LOG_LEVEL_WARNING = 'warning';

class LoggerService {
    constructor() {
        this._logger = null;

        const { clientId, componentEnvironment: environment, region, tenant } = wkVars.vars('logstash');

        this.defaultFields = { clientId, environment, region, tenant };
    }

    init(app) {
        if (!wkVars.vars('logstash').enable) {
            return;
        }
        this._logger = wkLog.defaultInit({
            server: app,
            nodeLogger: {
                esindex: wkVars.vars('logstash').esindex,
                component: productInfo.name,
                componentVersion: productInfo.version,
            },
            winston: {
                transports: [
                    {
                        name: 'console',
                        options: {
                            handleExceptions: true,
                            json: true,
                            stringify: true,
                            level: wkVars.vars('logstash').level,
                        },
                    },
                ],
            },
        });
    }

    log(type, ...messages) {
        if (type === LOG_LEVEL_INFO && logLevel === LOG_LEVEL_WARNING) {
            return;
        }

        if (this._logger) {
            messages.forEach(message => this._logger[type]({ ...this.prepareMessage(message), ...this.defaultFields }));
        } else {
            console.log(LOGGER_NOT_INITIALIZED);
        }
    }

    logRequest(type, req, configuration, error) {
        if (this._logger) {
            const { forwardedSub: userId = 'no_userId' } = req;
            const options = {
                ...configuration,
                reqUrl: req.originalUrl,
                userId,
                userAgent: req.headers['user-agent'],
                ...this.defaultFields,
            };

            if (error) {
                options.statusCode = error.status;
                options.stacktrace = error.stack;
            }

            this._logger[type](options);
        } else {
            console.log(LOGGER_NOT_INITIALIZED);
        }
    }

    getCorrelationId() {
        return guid();
    }

    // additional level of nesting correlationId for parallel requests
    // (example: one call from UI --> 10 calls from Node.js) (ACUSUI-354)
    getChainedCorrelationId(correlationId) {
        const [chainPart] = guid().split('-');

        return `${correlationId}.${chainPart}`;
    }

    getReqWithChainedCorrelationId(req) {
        // it's important to use deepClone instead spread syntax during correlation id chaining to avoid problems with osa service
        const reqClone = cloneDeep(req);

        reqClone.correlationId = this.getChainedCorrelationId(req.correlationId);

        return reqClone;
    }

    prepareMessage(message) {
        return typeof message === 'string' ? { message } : message;
    }
}

module.exports = new LoggerService();

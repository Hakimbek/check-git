const healthCheckRouter = require('./healthCheck.router');

module.exports = function (router) {
    router.use('/health_check', healthCheckRouter);
};

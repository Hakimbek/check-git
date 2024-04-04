const identityRouter = require('./identity.router');

module.exports = function (router) {
    router.use('/identity', identityRouter);
};

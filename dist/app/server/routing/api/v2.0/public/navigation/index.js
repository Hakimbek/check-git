const navigationRouter = require('./navigation.router');

module.exports = function (router) {
    router.use('/navigation', navigationRouter);
};

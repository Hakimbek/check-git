const cfactorPopupsRouter = require('./cfactorPopups.router');

module.exports = function (router) {
    router.use('/', cfactorPopupsRouter);
};

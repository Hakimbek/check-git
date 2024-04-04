const cfactorPopupsRouter = require('./cfactorPopups.router');
const { PREVIOUSLY_LOGGED_IN_COOKIE_NAME } = require('../../../../config/appConfig');
const compressionMiddleware = require('../../../../common/compressionMiddleware');
const cookieService = require('../../../../services/cookieService');

const setPreviouslyLoggedInCookieMiddleware = (req, res, next) => {
    cookieService.addPersistentCookies(res, PREVIOUSLY_LOGGED_IN_COOKIE_NAME, true);

    next();
};

module.exports = function (router) {
    router.use('/cfactors-idaas', compressionMiddleware, cfactorPopupsRouter);
    router.use('/cfactors-oneid', compressionMiddleware, setPreviouslyLoggedInCookieMiddleware, cfactorPopupsRouter);
};

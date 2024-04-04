const ProtectedOperation = require('../routing/api/v2/definitions/operations/ProtectedOperation');
const noAcessPageFlow = require('../common/noAccessMiddleware');
const { addPersistentCookies } = require('../services/cookieService');
const authentification = require('../login/authentificationMiddleware');
const { PREVIOUSLY_LOGGED_IN_COOKIE_NAME } = require('../config/appConfig');

const protectedOperation = new ProtectedOperation();

async function protectedRoute(req, res, next) {
    if (req.forwardedFreemium) {
        return authentification(req, res, next);
    }

    try {
        !req.originalUrl.includes('api/2.0/protected/navigation') &&
            (await protectedOperation.checkPermissions(req, res));
    } catch (error) {
        return noAcessPageFlow(req, res, next);
    }

    addPersistentCookies(res, PREVIOUSLY_LOGGED_IN_COOKIE_NAME, true);

    return next();
}

module.exports = protectedRoute;

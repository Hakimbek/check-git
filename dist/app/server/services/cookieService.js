const moment = require('moment');
const EXPIRES_COOKIE_DAY = 360;

class CookieService {
    addPersistentCookies(res, cookieName, cookieValue) {
        res.cookie(cookieName, cookieValue, { path: '/', expires: moment().add(EXPIRES_COOKIE_DAY, 'days').toDate() });
    }

    addSessionCookie(res, cookieName, cookieValue) {
        res.cookie(cookieName, cookieValue);
    }

    clearCookie(res, cookieName) {
        res.clearCookie(cookieName, { path: '/' });
    }
}

module.exports = new CookieService();

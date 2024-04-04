const moment = require('moment');
const EXPIRES_COOKIE_DAY = 365;
class CookieService {
    addPersistentCookies(res, cookieName, cookieValue, expireDays = EXPIRES_COOKIE_DAY) {
        res.cookie(cookieName, cookieValue, {
            path: '/',
            expires: moment().add(expireDays, 'days').toDate(),
            sameSite: 'lax',
            secure: true,
        });
    }
    clearCookie(res, cookieName) {
        res.clearCookie(cookieName, { path: '/' });
    }
}
module.exports = new CookieService();
//# sourceMappingURL=cookieService.js.map
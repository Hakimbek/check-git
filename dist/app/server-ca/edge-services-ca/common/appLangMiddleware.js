"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const varsService_1 = require("../services/varsService");
const acceptLanguageParser = require('accept-language-parser');
const appLangCookieName = varsService_1.VarsService.get('appLangCookieName');
const acceptedLanguages = ['en', 'fr'];
module.exports = (req, res, next) => {
    const appLang = req.cookies[appLangCookieName] || getLangFromHeader(req);
    setCookieLang(res, appLang);
    req.appLang = appLang;
    next();
};
function getLangFromHeader(request) {
    const languages = acceptLanguageParser.parse(request.headers['accept-language']);
    return !languages.length || acceptedLanguages.indexOf(languages[0].code) === -1
        ? acceptedLanguages[0]
        : languages[0].code;
}
function setCookieLang(response, appLang) {
    response.cookie(appLangCookieName, appLang, { maxAge: 1000 * 60 * 60 * 24 * 100, path: '/' });
}
//# sourceMappingURL=appLangMiddleware.js.map
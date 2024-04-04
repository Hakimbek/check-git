const url = require('url');
const _ = require('lodash');
const cookieService = require('../services/cookieService');
const { wkVars } = require('../services/utils/vars.util');

const skipExternalIncomeEventQueryFlag = wkVars.vars('skipExternalIncomeEventQueryFlag');
const skipExternalIncomeEventCookieName = wkVars.vars('skipExternalIncomeEventCookieName');

module.exports = (req, res, next) => {
    if (req.query[skipExternalIncomeEventQueryFlag]) {
        cookieService.addSessionCookie(res, skipExternalIncomeEventCookieName, true);

        return res.redirect(
            url.format({
                query: _.omit(req.query, skipExternalIncomeEventQueryFlag),
                pathname: url.parse(req.originalUrl).pathname,
            })
        );
    }

    return next();
};

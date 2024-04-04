const { PRERENDER_TOKEN } = require('../config/appConfig');
const prerender = require('prerender-node');
const detectUserTypeService = require('../services/detectUserTypeService');
const { wkVars } = require('../services/utils/vars.util');

prerender.crawlerUserAgents = wkVars.vars('prerenderAllowedCrawlerUserAgents');

module.exports = (req, res, next) => {
    if (!detectUserTypeService.isFreemium(req)) {
        return next();
    }

    return prerender.set('prerenderToken', PRERENDER_TOKEN)(req, res, next);
};

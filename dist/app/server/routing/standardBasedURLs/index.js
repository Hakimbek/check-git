const initGooglePage = require('./googlePage');
const initVersionTxt = require('./versionTxtRoute');
const initRobots = require('./robotsRoute');
const initAura = require('./aura');
const initSitemaps = require('./sitemaps');

module.exports = function (router) {
    initGooglePage(router);
    initRobots(router);
    initVersionTxt(router);
    initAura(router);
    initSitemaps(router);
};

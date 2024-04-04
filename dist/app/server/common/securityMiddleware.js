const { wkVars } = require('../services/utils/vars.util');
const { isHub } = require('../services/utils/env.util');

const clearProto = str => str.replace(/(\/\/)|(https:\/\/)/, '');

const wkCdn = 'cdn.wolterskluwer.io';
const pardotHosts = ['cdn.pardot.com', 'pi.pardot.com'];
const videoHost = 'player.vimeo.com';
const bingAdsHost = 'bat.bing.com';
const engageTaxHost = 'engagetax.wolterskluwer.com';
const livereloadPlugin = isHub() ? '' : 'localhost:35729 http://localhost:35729';
const mouseflowHost = '*.mouseflow.com';
const appcuesHosts = ['*.appcues.com', '*.appcues.net'];
const googleHosts = [
    '*.google-analytics.com',
    '*.googletagmanager.com',
    '*.googleadservices.com',
    '*.google.com',
    'https://googleads.g.doubleclick.net',
];
const connectCSPProtocols = [
    mouseflowHost,
    'wss://*.appcues.net',
    'wss://*.appcues.com',
    bingAdsHost,
    ...googleHosts,
    clearProto(wkVars.vars('idpAxcessUrl')),
    clearProto(wkVars.vars('idpOneIdUrl')),
    clearProto(wkVars.vars('gpd').host),
    isHub() ? '' : `ws://${livereloadPlugin}`,
];
const imgCSPHosts = [
    'data:',
    ...appcuesHosts,
    'intelliconnect-answerconnect-dev3.psdidevenvs.com',
    'talcudvl.wolterskluwertal.com',
    clearProto(wkVars.vars('intelliConnect-host')),
    clearProto(wkVars.vars('mediaServer-host')),
    bingAdsHost,
    ...googleHosts,
    // arm img hosts
    's3.amazonaws.com', // ktmine
    'www.sec.gov',
    'res.cloudinary.com', // Appcues
    'cdn.jsdelivr.net', // Appcues
];
const ICAdminHost = wkVars
    .vars('ICAdminUrl')
    .match(/\/\/(.+)\/saas\//)
    .pop();

const framesCSPHosts = [
    clearProto(wkVars.vars('cdnHost')),
    clearProto(wkVars.vars('idpAxcessUrl')),
    clearProto(wkVars.vars('taxSnapshotHost')),
    clearProto(wkVars.vars('intelliConnect-host')),
    clearProto(wkVars.vars('mediaServer-host')),
    ICAdminHost,
    videoHost,
    // arm iframe hosts
    's3.amazonaws.com', // ktmine
    'intelliconnect.stg.cch.com',
    'intelliconnect.cch.com',
    'talcudvl.wolterskluwertal.com',
    'intelliconnect-acdev.psdidevenvs.com',
    'intelliconnect-answerconnect-dev3.psdidevenvs.com',
    'www.sec.gov',
    '*.appcues.com',
];

const stylesCSPHosts = [
    // arm styles hosts
    's3.amazonaws.com', // ktmine
    'www.sec.gov',
    'fonts.googleapis.com',
    'fonts.google.com',
];

const scriptsCSPHosts = [
    // arm scripts hosts
    's3.amazonaws.com', // ktmine
    'www.sec.gov',
];

const fontsCSPHosts = ['fonts.gstatic.com', mouseflowHost];

const CSP_HEADER_CONFIG = Object.entries({
    'default-src': ["'self'"],
    'script-src': [
        "'self'",
        "'unsafe-inline'",
        "'unsafe-eval'",
        bingAdsHost,
        engageTaxHost,
        wkVars.vars('gpd').host,
        livereloadPlugin,
        mouseflowHost,
        ...pardotHosts,
        ...googleHosts,
        ...appcuesHosts,
        ...scriptsCSPHosts,
    ],
    'style-src': ["'self'", wkCdn, "'unsafe-inline'", ...appcuesHosts, ...stylesCSPHosts],
    'font-src': ["'self'", wkCdn, 'data:', ...fontsCSPHosts],
    'img-src': ["'self'", wkCdn, ...imgCSPHosts],
    'connect-src': ["'self'", ...appcuesHosts, ...connectCSPProtocols],
    'frame-src': ["'self'", ...framesCSPHosts],
})
    .map(([key, value]) => `${key} ${value.join(' ')}`)
    .join('; ');

module.exports = (req, res, next) => {
    res.setHeader('X-Frame-Options', ['sameorigin', clearProto(wkVars.vars('idpAxcessUrl'))].join(' '));
    res.setHeader('X-XSS-Protection', 1);
    res.setHeader('Content-Security-Policy', CSP_HEADER_CONFIG);
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; preload');
    res.setHeader('X-Content-Type-Options', 'nosniff');

    next();
};

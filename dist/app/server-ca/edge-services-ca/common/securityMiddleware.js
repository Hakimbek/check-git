"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const varsService_1 = require("../services/varsService");
const wkCdn = 'cdn.wolterskluwer.io';
const appcuesHostDotCom = 'https://*.appcues.com';
const appcuesHostDotNet = 'https://*.appcues.net';
const connectCSPProtocols = ['*.mouseflow.com', 'wss://*.appcues.net', 'wss://*.appcues.com'];
const imgCSPHosts = [
    'intelliconnect-acdev.psdidevenvs.com',
    '*.appcues.com',
    'res.cloudinary.com',
    'logo.clearbit.com',
    'twemoji.maxcdn.com',
];
const ICAdminHost = varsService_1.VarsService.get('ICAdminUrl')
    .match(/\/\/(.+)\/public\//)
    .pop();
const CSP_HEADER_CONFIG = Object.entries({
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", appcuesHostDotCom, appcuesHostDotNet],
    'style-src': ["'self'", wkCdn, "'unsafe-inline'", appcuesHostDotCom, appcuesHostDotNet],
    'font-src': ["'self'", wkCdn],
    'img-src': ["'self'", wkCdn, ...imgCSPHosts],
    'connect-src': ["'self'", appcuesHostDotCom, appcuesHostDotNet, ...connectCSPProtocols],
    'frame-src': [ICAdminHost],
})
    .map(([key, value]) => `${key} ${value.join(' ')}`)
    .join('; ');
module.exports = (_req, res, next) => {
    res.setHeader('X-Frame-Options', 'sameorigin');
    res.setHeader('X-XSS-Protection', 1);
    res.setHeader('Content-Security-Policy', CSP_HEADER_CONFIG);
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; preload');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
};
//# sourceMappingURL=securityMiddleware.js.map
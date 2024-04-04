const express = require('express');
const proxy = require('express-http-proxy');
const { wkVars } = require('../../services/utils/vars.util');
const { getSitemapsDir } = require('../../services/utils/env.util');
const logger = require('../../services/loggerService');

const { host: GPDHost, sitemaps: GPDSitemaps, sitemapFileName } = wkVars.vars('gpd');
const staticSitemaps = wkVars.vars('staticSitemaps');
const mainSeoHost = wkVars.vars('mainSeoHost');
const staticSitemapsLastModified = wkVars.vars('staticSitemapsLastModified');
const STATUS_CODE_OK = 200;

function sitemapStaticInjection() {
    return staticSitemaps
        .map(
            item => `
        <sitemap>
            <loc>
                ${mainSeoHost}/sitemaps/${item}
            </loc>
            <lastmod>${staticSitemapsLastModified}</lastmod>
        </sitemap>
    `
        )
        .join('');
}

module.exports = function (router) {
    router.get(
        '/sitemap.xml',
        proxy(GPDHost, {
            proxyReqPathResolver: () => GPDSitemaps + sitemapFileName,
            userResDecorator: (res, body) => {
                const firstSitemapIndex = body.indexOf('<sitemap>');
                const extendedSitemap = [
                    body.slice(0, firstSitemapIndex),
                    sitemapStaticInjection(),
                    body.slice(firstSitemapIndex),
                ].join('');

                return extendedSitemap;
            },
            proxyErrorHandler: (err, res) => {
                logger.log('error', 'Cannot get original sitemap from GPD');

                res.type('text/xml').status(STATUS_CODE_OK).send(`
                <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
                    ${sitemapStaticInjection()}
                </sitemapindex>
            `);
            },
        })
    );

    router.use('/sitemaps', express.static(getSitemapsDir()));

    router.get(
        '/sitemaps/:sitemapId',
        proxy(GPDHost, {
            proxyReqPathResolver: req => GPDSitemaps + req.params.sitemapId,
        })
    );
};

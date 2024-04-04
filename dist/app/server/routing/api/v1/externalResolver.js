const _ = require('lodash');
const url = require('url');
const registeredMiddleware = require('./../../../login/registeredMiddleware');

const wkVars = require('../../../services/utils/vars.util').wkVars;
const redirectToTool = require('../../../routing/service/middleware/osaRedirectTools');
const analyticsService = require('../../../services/analyticsService');
const durationTrackingService = require('../../../services/durationTrackingService');
const logger = require('../../../services/loggerService');
const {
    LOGGING_LEVELS: { INFO },
    FUNCTION_NAMES: { REFERRER_IC, BRAND_REDIRECT, SPOOLER_REDIRECT },
} = require('../../../loggerConstants');
const cookieService = require('../../../services/cookieService');
const { getAlertsServiceProcessor } = require('@wk/acm-news/edge-services/src/alerts/alerts.service');

const velvetHost = wkVars.vars('velvet-host');
const skipExternalIncomeEventCookieName = wkVars.vars('skipExternalIncomeEventCookieName');
const alerts10KCustomContext = wkVars.vars('10KAlertsCustomContext');

const pathnames = {
    document: '/resolve/document/',
    citation: '/resolve/citation/',
    search: wkVars.vars('reactAppLinks').searchResolverUrl,
};
const DEFAULT_ALERTS_TYPE_FOR_UNSUBSCRIBE = 'all';
const UNIQUE_CANONICAL_LINKS = [
    '/all',
    '/state',
    '/federal',
    '/tax-news',
    '/international',
    '/document/:documentId',
    '/document/:documentId/*',
];
const CANONICAL_LINKS_INDISTINGUISHABLE_FROM_INTERNAL_LINKS = [
    '/topics/browse/all',
    '/topics/browse/state/list',
    '/topics/browse/federal/list',
    '/browse/categories-horizontal/csh-da-filter!WKUS-TAL-DOCS-PHC-%7Bb3d4b2b5-b65c-3cb4-9c24-f916cf4f0707%7D',
    '/topic/:documentId/*',
];

function referrerIC(req, res, next) {
    let searchParams = {};
    const { forwardedSub: userId = 'no_userId' } = req;

    if (req.query.linksource) {
        let params = wkVars.vars('referrerIC');
        let path = '/';

        if (req.query.icinteraction) {
            path = req.path;
        }

        searchParams = _.pickBy(req.query, (v, key) => !(key in params));

        // /?linksource=&document=
        if (req.query.document) {
            path = pathnames.document + req.query.document;

            // /?linksource=&citation=
        } else if (req.query.citation) {
            path = pathnames.citation + req.query.citation;

            // /?linksource=&tool=
        } else if (req.query.tool) {
            return redirectToTool(req, res);

            // /?linksource=&query=
        } else if (req.query.query) {
            path = pathnames.search;
            searchParams.query = req.query.query;
            searchParams.tab = 'all';

            if (req.query.searchid) {
                searchParams.searchId = req.query.searchid;
            }

            // needs to support broken searchId parameter to match already used api interface
            searchParams.searchId = null;
        }

        logger.logRequest(INFO, req, {
            message: `Redirect to ${url.format({ query: searchParams, pathname: path })}`,
            function: REFERRER_IC,
            linksource: req.query.linksource,
            correlationId: req.correlationId,
        });

        return res.redirect(url.format({ query: searchParams, pathname: path }));
    }

    if (req.query.redirect) {
        let params = {
            redirect: true,
        };
        // here we take all query params, except 'redirect' and throw them to next page
        searchParams = _.pickBy(req.query, (v, key) => !(key in params));
        let result = url.format({ pathname: '/', query: searchParams });

        logger.log(INFO, {
            message: `Redirect to ${result}) }`,
            function: REFERRER_IC,
            url: req.url,
            linksource: req.query.linksource,
            correlationId: req.correlationId,
            userId,
        });

        return res.redirect(result);
    }

    return next();
}

function brandRedirect(req, res) {
    const { forwardedSub: userId = 'no_userId' } = req;

    let pathname = req.path;
    let query = {
        ...req.query,
        _timestamp: Date.now(),
    };

    // it is supposed that all arm citations has '/ARMAC' after id
    const armacCitationMatch = req.path.match(/pit\/(.+)\/ARMAC/);

    // BSP redirects to a specific route
    // ex.: /scion/document/default/ARMB401AA2FFCE15DE310BF86179EBF74D6F2DC86CD?cfu=TAA&cpid=WKUS-TAA-AC&uAppCtx=ics&refURL=https%3A%2F%2Fcchconnect.cch.com%2F
    const armDocumentMatch = req.path.match(/document\/default\/(ARM[a-zA-Z0-9]+)/);

    if (armacCitationMatch && armacCitationMatch[1]) {
        pathname = '/app/acr/navigation';
        query = {
            citation: 'ARMAC ' + armacCitationMatch[1],
            _timestamp: Date.now(),
        };
    } else if (armDocumentMatch && armDocumentMatch[1]) {
        pathname = '/app/acr/navigation';
        query = {
            documentId: armDocumentMatch[1],
            _timestamp: Date.now(),
        };
    } else {
        // arm 10k alerts has their own routes: edge-services\src\DataProviders\arm-specific\news\news.route.ts
        const pathPrefix = req.path.match('arm/alerts-10k') ? '' : '/extlink';

        pathname = pathPrefix + req.path;
    }

    const target = url.format({
        protocol: req.forwardedProto,
        host: req.forwardedHost,
        pathname: pathname,
        query: query,
    });

    logger.log(INFO, {
        message: `Redirect to ${target}) }`,
        function: BRAND_REDIRECT,
        url: req.url,
        correlationId: req.correlationId,
        userId,
    });

    analyticsService.trackExternalIncomeEvent(req, res);
    cookieService.addSessionCookie(res, skipExternalIncomeEventCookieName, true);

    res.redirect(target);
}

async function alertUnsubscribeRedirect(req, res) {
    const patchedLogger = logger;
    // monkey pathcing to adhere interface of edge-services logger from
    // edge-services\src\externalDependencies.ts
    // @TODO should be replaced with updated/new logger class
    patchedLogger.durationTracking = {
        start: durationTrackingService.start.bind(durationTrackingService),
        end: durationTrackingService.end.bind(durationTrackingService),
    };

    const alertsEdgeService = getAlertsServiceProcessor({ logService: patchedLogger });
    const alertsType = req.query.type || DEFAULT_ALERTS_TYPE_FOR_UNSUBSCRIBE;
    let status = null;

    try {
        const { operationStatus } = await alertsEdgeService.unsubscribeUserFromNews(req, alertsType, [
            alerts10KCustomContext,
        ]);

        status = operationStatus;
    } catch (error) {
        status = 'error';
    }

    const target = url.format({
        protocol: req.forwardedProto,
        host: req.forwardedHost,
        pathname: '/',
        query: { showUnsubscribeMessage: status, _timestamp: Date.now() },
    });

    logger.log(INFO, {
        message: `Redirect to ${target}) }`,
        function: BRAND_REDIRECT,
        url: req.url,
        correlationId: req.correlationId,
    });

    res.redirect(target);
}

function spoolerRedirect(req, res) {
    const config = wkVars.vars('spoolerFiles');
    const { forwardedSub: userId = 'no_userId' } = req;

    const target = url.format({
        protocol: req.protocol,
        host: config.host,
        pathname: config.path + req.path,
    });

    logger.log(INFO, {
        message: `Redirect to ${target}) }`,
        function: SPOOLER_REDIRECT,
        url: req.url,
        correlationId: req.correlationId,
        userId,
    });

    res.redirect(target);
}

function externalIncomeEventTrackingMiddleware(req, res, next) {
    analyticsService.trackExternalIncomeEvent(req, res, {
        isEventTrackingForbiddenForUnknownReferrers: req.skipExternalIncomeEventForUnknownSources,
    });

    req.skipExternalIncomeEventAfterLogin = true;

    next();
}

module.exports = router => {
    router.get('/redirect', (req, res) => {
        res.redirect(velvetHost + req.url);
    });

    // CSN-13933: we need to trigger externalIncome events if the user comes from IC in cases mentioned in the ticket
    router.get(['/', '/home', '/topic/:topicId', '/topics/browse/international/jurisdiction'], referrerIC);

    router.get(UNIQUE_CANONICAL_LINKS, externalIncomeEventTrackingMiddleware);

    router.get(
        CANONICAL_LINKS_INDISTINGUISHABLE_FROM_INTERNAL_LINKS,
        (req, res, next) => {
            req.skipExternalIncomeEventForUnknownSources = true;
            next();
        },
        externalIncomeEventTrackingMiddleware
    );

    router.use(
        '/scion/alertunsubscribe',
        externalIncomeEventTrackingMiddleware,
        registeredMiddleware,
        alertUnsubscribeRedirect
    );
    router.use('/scion', brandRedirect);
    router.use('/spooler', spoolerRedirect);
};

const dotenv = require('dotenv');

dotenv.config();

const initApi = require('./routing/api');
const initAppApi = require('./routing/app-api');
const initService = require('./routing/service');
const initStandardBasedURL = require('./routing/standardBasedURLs');
const initStatic = require('./routing/static');
const initUi = require('./routing/ui');
const initHook = require('./routing/hook');
const initSpecialUrl = require('./routing/api/v1/specialUrlRoute');
const memoryCache = require('./common/memoryCacheMiddleware');
const { wkVars } = require('./services/utils/vars.util');
const licenseAgreementMiddleware = require('./login/licenseAgreementMiddleware');
const accountLockedMiddleware = require('./login/accountLockedMiddleware');
const logService = require('./services/loggerService.js');
const { PREVIOUSLY_LOGGED_IN_COOKIE_NAME } = require('./config/appConfig');
const nodeFetch = require('node-fetch');

const { osaService, edgeServiceFactory, osaContextMiddleware } = require('@wk/acm-osa-service/edge-services');
const { osa3Service, osa3ContextMiddleware } = require('@wk/acm-osa3-service/edge-services');

osaService.configure({
    osa: wkVars.vars('osa'),
    osaProductConfig: wkVars.vars('osaProductConfig'),
    previouslyLoggedInCookieName: PREVIOUSLY_LOGGED_IN_COOKIE_NAME,
    logService,
});

edgeServiceFactory.configure(
    {
        listeners: {
            onRequestStart: event => {
                event.request.headers['correlationid'] = logService.getCorrelationId();
            },
        },
        fetch: () => nodeFetch,
    },
    wkVars.vars('baseEdgeServicesUrl')
);

osa3Service.configure({
    osa: wkVars.vars('osa'),
    osaProductConfig: wkVars.vars('osaProductConfig'),
    previouslyLoggedInCookieName: PREVIOUSLY_LOGGED_IN_COOKIE_NAME,
    logService,
});

const securityMiddleware = require('./common/securityMiddleware');
const forwardedMiddleware = require('./common/forwardedMiddleware');

const routesToCache = wkVars.vars('routesToCache');
const licenseAgreementTextCacheTTL = wkVars.vars('licenseAgreementTextCacheTTL');
const latestVersionOfLicenseAgreementTextUrl = wkVars.vars('latestVersionOfLicenseAgreementTextUrl');
const routesToCacheExceptions = wkVars.vars('routesToCacheExceptions');
const STATUS_CODE_OK = 200;
const isCachingApplied = req => !routesToCacheExceptions.some(url => req.originalUrl.startsWith(url));
const isCachingAppliedForLicenseAgreementText = (req, res) => res.statusCode === STATUS_CODE_OK;

const edgeServicesRoutes = require('./edge-services/routes/routes').default;
const reportsRemovingService = require('./edge-services/serverJobs/reportStoreJob').default;

reportsRemovingService.start();

module.exports = serverInstance => {
    initStatic(serverInstance.app);

    serverInstance.app.use(securityMiddleware);
    serverInstance.app.use(forwardedMiddleware);
    serverInstance.app.use(osaContextMiddleware);
    serverInstance.app.use(osa3ContextMiddleware);

    initHook(serverInstance.app);

    serverInstance.app.use('/', require('./common/correlationIdMiddleware'));
    serverInstance.app.use('/', require('./common/skipAnalyticsMiddleware'));

    serverInstance.app.use('/sul', require('./login/standardLoginForIpUsersMiddleware'));

    serverInstance.app.use('/service/edge', edgeServicesRoutes);

    serverInstance.app.use('/', require('./common/prerenderMiddleware'));
    serverInstance.app.use('/', require('./login/welcomePageMiddleware'));

    initSpecialUrl(serverInstance.app);

    serverInstance.app.get(routesToCache, memoryCache(null, isCachingApplied), (req, res, next) => {
        next();
    });

    serverInstance.app.get(
        latestVersionOfLicenseAgreementTextUrl,
        memoryCache(licenseAgreementTextCacheTTL, isCachingAppliedForLicenseAgreementText),
        (req, res, next) => {
            next();
        }
    );

    initStandardBasedURL(serverInstance.app);
    initAppApi(serverInstance.app);
    initApi(serverInstance.app);
    initService(serverInstance.app);

    serverInstance.app.use('/', require('./routing/static/fallbackRoutes'));
    serverInstance.app.use('/', require('./login/loginTypeMiddleware'));
    serverInstance.app.use('/', require('./common/detectUserTypeMiddleware'));
    serverInstance.app.use('/', accountLockedMiddleware);
    serverInstance.app.use('/', licenseAgreementMiddleware);

    initUi(serverInstance.app);
};

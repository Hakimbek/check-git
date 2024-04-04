const PublicOperation = require('../routing/api/v2/definitions/operations/PublicOperation');
const noAcessPageFlow = require('../common/noAccessMiddleware');
const { addPersistentCookies } = require('../services/cookieService');
const authentification = require('../login/authentificationMiddleware');
const { PREVIOUSLY_LOGGED_IN_COOKIE_NAME } = require('../config/appConfig');
const detectUserTypeService = require('../services/detectUserTypeService');
const { FULLYSUSPENDED_NOTIFICATION_URL } = require('../config/notificationPage.config');
const { getURMService } = require('../edge-services/DataProviders/urm/urm.service');
const analyticsService = require('../services/analyticsService');
const logger = require('../services/loggerService');
const {
    LOGGING_LEVELS: { INFO, ERROR },
    FUNCTION_NAMES: { REGISTERED },
    LOGGING_MESSAGES: { REDIRECT_TO_SUSPENDED_SUBSCRIPTION_PAGE, GETTING_USER_SUBSCRIPTIONS_STATUS_PROCESS_FAIL },
} = require('../loggerConstants');

const LOGOUT_PAGE_URL = '/static/logout';
const publicOperation = new PublicOperation();
const urmService = getURMService();

async function isAllACSubscriptionsSuspended(req, ignoreCache) {
    try {
        const { hasSuspendedSubscriptions, hasACSubscriptions } = await urmService.getUserSubscriptionsStatus(
            req,
            ignoreCache
        );

        return !hasACSubscriptions && hasSuspendedSubscriptions;
    } catch (e) {
        logger.logRequest(
            ERROR,
            req,
            {
                message: GETTING_USER_SUBSCRIPTIONS_STATUS_PROCESS_FAIL,
                function: REGISTERED,
                correlationId: req.correlationId,
            },
            e
        );

        return false;
    }
}

function redirectToFullySuspendedNotificationPage(req, res) {
    logger.logRequest(INFO, req, {
        message: REDIRECT_TO_SUSPENDED_SUBSCRIPTION_PAGE,
        function: REGISTERED,
        url: FULLYSUSPENDED_NOTIFICATION_URL,
        correlationId: req.correlationId,
    });

    analyticsService.trackCustomEvent({
        eventName: 'fullySuspendedLoginReject',
        req,
    });

    return res.redirect(FULLYSUSPENDED_NOTIFICATION_URL);
}

async function registeredRoute(req, res, next) {
    if (req.forwardedFreemium) {
        // force the login page when a user has a freemium token accidentially
        return authentification(req, res, next);
    }

    if (detectUserTypeService.hasFreemiumSub(req)) {
        // force the logout page if someone tries to login as the freemium
        req.forceLoginByMiddleware = true;

        return authentification(req, res);
    }

    if (!req.forwardedSub) {
        return res.redirect(LOGOUT_PAGE_URL);
    }

    if (await isAllACSubscriptionsSuspended(req)) {
        return redirectToFullySuspendedNotificationPage(req, res);
    }

    let isOperationPermitted = true;

    try {
        await publicOperation.checkPermissions(req, res);
    } catch (error) {
        isOperationPermitted = false;
    } finally {
        if (await isAllACSubscriptionsSuspended(req, !isOperationPermitted)) {
            return redirectToFullySuspendedNotificationPage(req, res);
        }

        if (!isOperationPermitted) {
            return noAcessPageFlow(req, res, next);
        }
    }

    addPersistentCookies(res, PREVIOUSLY_LOGGED_IN_COOKIE_NAME, true);

    return next();
}

module.exports = registeredRoute;

const bowser = require('bowser');
const formatISO = require('date-fns/formatISO');
const nodeFetch = require('node-fetch');
const detectUserTypeService = require('./detectUserTypeService');
const cookieService = require('./cookieService');
const logger = require('./loggerService');
const { wkVars } = require('./utils/vars.util');
const {
    LOGGING_LEVELS: { ERROR },
} = require('../loggerConstants');
const { version: applicationVersion } = require('../../package.json');
const { edgeServiceFactory } = require('@wk/acm-osa-service/edge-services');
const {
    AnalyticsService: AnalyticsServiceContract,
} = require('@wk/acm-analytics/shared/src/analytics/analytics.service');
const EXTERNAL_INCOME_EVENT_NAME = 'externalIncome';
const idpUrlRegexp = new RegExp(`^${wkVars.vars('idpOneIdUrl')}`);
const skipExternalIncomeEventCookieName = wkVars.vars('skipExternalIncomeEventCookieName');

class AnalyticsService {
    async _sendEvent(eventCode, eventParams, req, isExternalUser) {
        const analyticsEdgeService = edgeServiceFactory.createEdgeServiceInstance(req, AnalyticsServiceContract);

        try {
            if (isExternalUser) {
                await nodeFetch(
                    `${req.forwardedProto}://${req.forwardedHost}/service/edge/services/modular/kasandra/send-event`,
                    {
                        body: JSON.stringify({
                            eventData: {
                                code: eventCode,
                                attributes: eventParams,
                            },
                        }),
                        method: 'POST',
                        headers: {
                            'Content-type': 'application/json',
                        },
                    }
                );
            } else {
                await analyticsEdgeService.sendEvent({
                    code: eventCode,
                    attributes: eventParams,
                });
            }
        } catch (error) {
            logger.log(ERROR, `Failed to send ${eventCode} event`, error);
        }
    }

    _getCommonEventParams(req, isExternalUser) {
        const userClientInfo = bowser.parse(req.headers['user-agent']);
        const params = {
            timeStamp: formatISO(new Date()),
            userInfo: {
                browser: `${userClientInfo.browser.name} ${userClientInfo.browser.version}`,
                os: `${userClientInfo.os.name} ${userClientInfo.os.version}`,
                uiVersion: applicationVersion,
            },
        };

        if (!isExternalUser) {
            params.userType = detectUserTypeService.isRegistered(req) ? 'subscribed' : 'freemium';
        }

        return params;
    }

    _getExternalSourceInfo(req, referrer) {
        const isApi20 = req.originalUrl.match('/api/2.0');
        const externalSourceInfo = {};

        if (isApi20 && req.query.linksource) {
            externalSourceInfo.incomeSource = req.query.linksource;

            if (req.query.linkcontext) {
                externalSourceInfo.sourceLocation = req.query.linkcontext;
            }
        }

        if (referrer) {
            externalSourceInfo.referrer = referrer;
        }

        return externalSourceInfo;
    }

    trackCustomEvent({ eventName, customEventParams, req, isExternalUser }) {
        const eventParams = {
            ...(customEventParams || {}),
            ...this._getCommonEventParams(req, isExternalUser),
        };

        this._sendEvent(eventName, eventParams, req, isExternalUser);
    }

    trackExternalIncomeEvent(req, res, { isEventTrackingForbiddenForUnknownReferrers, isExternalUser } = {}) {
        if (req.cookies[skipExternalIncomeEventCookieName]) {
            cookieService.clearCookie(res, skipExternalIncomeEventCookieName);
        }

        if (req.skipExternalIncomeEvent || req.cookies[skipExternalIncomeEventCookieName]) {
            return;
        }

        const referrer = req.get('Referrer') || '';
        const selfReferrerRegExp = new RegExp(`^${req.forwardedProto}://${req.forwardedHost}`);
        const isSelfReferrer = referrer.match(selfReferrerRegExp);

        if (isSelfReferrer) {
            return;
        }

        const isReferrerUnknown = !referrer || referrer.match(idpUrlRegexp);

        if (isEventTrackingForbiddenForUnknownReferrers && isReferrerUnknown) {
            return;
        }

        const eventParams = {
            ...this._getCommonEventParams(req, isExternalUser),
            eventType: 'AppEvent',
            subType: EXTERNAL_INCOME_EVENT_NAME,
            action: EXTERNAL_INCOME_EVENT_NAME,
            payload: {
                ...this._getExternalSourceInfo(req, !isReferrerUnknown ? referrer : undefined),
                targetURL: `${req.forwardedProto}://${req.forwardedHost}${req.originalUrl}`,
            },
        };

        this._sendEvent(EXTERNAL_INCOME_EVENT_NAME, eventParams, req, isExternalUser);
    }
}

module.exports = new AnalyticsService();

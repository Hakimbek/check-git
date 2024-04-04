const {
    PREVIOUSLY_LOGGED_IN_COOKIE_NAME,
    FORWARDER_AMR_HEADER_NAME,
    IP_USER_AMR_KEY,
    ANONYMOUS_USER_AMR_KEY,
    REFERRER_USER_AMR_KEY,
    USER_TYPE_FREEMIUM,
    USER_TYPE_REGISTERED,
    USER_TYPE_GOOGLE_BOT,
    USER_TYPE_PRERENDER_BOT,
    USER_TYPE_IP,
    USER_TYPE_DELOITTE,
    USER_TYPE_SITECONTACT,
} = require('./../config/appConfig');
const { userTypeService } = require('../edge-services/services/common/userTypeService');

const FREEMIUM_USER_SUBJECT_CLAIMS = [
    'acfreedev@cch.com', // DEV, QA, ST envs
    '998b826eaa603295be66e7263c2f577c8dd077e7', // INT env
    '795099d97a24201a67236a3c07fd9082880577ab', // PROD env
    '39906632eca4ee3863810067700c661eb1fbccf3', // STG env
    'c0272a1c967c6a7b15ede79ffbaecc513d3f7d3b', // TAL-DVL env
    '4eef240a2d8764bb4eecdb7fddd995fbb0386c2e', // TAL-TST env
];

const FORWARDED_AUTHORITY_DELOITTE_LIST = ['Deloitte', 'https://sts.windows.net/7e4ad40b-fd3d-43c4-8ffe-d0d60cfd9be5/'];

class DetectUserTypeService {
    getPreviousLoggedInCookie(cookies = {}) {
        return cookies[PREVIOUSLY_LOGGED_IN_COOKIE_NAME];
    }

    isRegistered({ cookies = {}, forwardedFreemium } = {}) {
        return !!this.getPreviousLoggedInCookie(cookies) || !forwardedFreemium;
    }

    isFreemium({ cookies = {}, forwardedFreemium } = {}) {
        return !this.getPreviousLoggedInCookie(cookies) && forwardedFreemium;
    }

    isCrawler({ headers = {} } = {}) {
        return /googlebot|Google-InspectionTool/i.test(headers['user-agent']);
    }

    isPrerenderBot({ headers = {} } = {}) {
        return /prerender/i.test(headers['user-agent']);
    }

    isReferrerUser(req) {
        const forwardedAmrValues = this._getAmrValues(req);

        return forwardedAmrValues.includes(REFERRER_USER_AMR_KEY);
    }

    isIPAnonymousUser(req) {
        const forwardedAmrValues = this._getAmrValues(req);

        // ACUS-910: need to check for IP and Anonymous fields in forwarderAmr header to distinguish IP user from IP Prompt user
        return forwardedAmrValues.includes(IP_USER_AMR_KEY) && forwardedAmrValues.includes(ANONYMOUS_USER_AMR_KEY);
    }

    isDeloitteUser({ forwardedAuthority } = {}) {
        return FORWARDED_AUTHORITY_DELOITTE_LIST.includes(forwardedAuthority);
    }

    hasFreemiumSub(req) {
        return this.isSubFreemium(req.forwardedSub);
    }

    isSubFreemium(sub) {
        return FREEMIUM_USER_SUBJECT_CLAIMS.some(freemiumSub => sub === freemiumSub);
    }

    async isSiteContactUser(req) {
        return await userTypeService.isSiteContactUser(req);
    }

    async getUserType(req) {
        if (this.isFreemium(req) || this.hasFreemiumSub(req)) {
            return USER_TYPE_FREEMIUM;
        }

        if (this.isRegistered(req)) {
            let registeredUserType = USER_TYPE_REGISTERED;
            const isSiteContactUser = await this.isSiteContactUser(req);

            if (this.isIPAnonymousUser(req) || this.isReferrerUser(req)) {
                // we can add a separate type for referrer users later in needed
                // (currently both users should have the same treatment)
                registeredUserType = `${registeredUserType} ${USER_TYPE_IP}`;
            }

            if (this.isDeloitteUser(req)) {
                registeredUserType = `${registeredUserType} ${USER_TYPE_DELOITTE}`;
            }

            if (isSiteContactUser) {
                registeredUserType = `${registeredUserType} ${USER_TYPE_SITECONTACT}`;
            }

            return registeredUserType;
        }

        if (this.isCrawler(req)) {
            return USER_TYPE_GOOGLE_BOT;
        }

        if (this.isPrerenderBot(req)) {
            return USER_TYPE_PRERENDER_BOT;
        }

        return undefined;
    }

    _getAmrValues({ headers = {}, body: { accesstoken = {} } = {} } = {}) {
        const forwarderAmr = headers[FORWARDER_AMR_HEADER_NAME] || accesstoken.amr;

        if (!forwarderAmr) {
            return [];
        }

        return forwarderAmr.replace(/\[|\]|"|'|\s/g, '').split(',');
    }
}

module.exports = new DetectUserTypeService();

const { ANONYMOUS_USER_AMR_KEY, IP_USER_AMR_KEY, USER_TYPE_IP, USER_TYPE_REGISTERED } = require('../config/appConfig').appConfig;
class DetectUserTypeService {
    isIPAnonymousUser(req) {
        const forwarderAmr = req.forwardedAmr;
        if (!forwarderAmr) {
            return false;
        }
        const forwardedAmrValues = forwarderAmr.replace(/\[|\]|"|'|\s/g, '').split(',');
        return forwardedAmrValues.includes(IP_USER_AMR_KEY) && forwardedAmrValues.includes(ANONYMOUS_USER_AMR_KEY);
    }
    getUserType(req) {
        return this.isIPAnonymousUser(req) ? `${USER_TYPE_REGISTERED} ${USER_TYPE_IP}` : USER_TYPE_REGISTERED;
    }
}
module.exports = new DetectUserTypeService();
//# sourceMappingURL=detectUserTypeService.js.map
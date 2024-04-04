const {
    FORWARDED_HOST_HEADER_NAME,
    FORWARDED_SUB_HEADER_NAME,
    FORWARDED_AUTHORIZATION_HEADER_NAME,
    FORWARDED_PROTO_HEADER_NAME,
    FORWARDED_FREEMIUM_HEADER_NAME,
    FORWARDER_AMR_HEADER_NAME,
    FORWARDED_AUTHORITY_HEADER_NAME,
    FORWARDED_SESSION_HEADER_NAME,
} = require('../config/appConfig');

module.exports = (req, res, next) => {
    req.forwardedProto = req.get(FORWARDED_PROTO_HEADER_NAME);
    req.forwardedHost = req.get(FORWARDED_HOST_HEADER_NAME);
    req.forwardedSub = req.get(FORWARDED_SUB_HEADER_NAME);
    req.forwardedAuthorization = req.get(FORWARDED_AUTHORIZATION_HEADER_NAME);
    req.forwardedFreemium = req.get(FORWARDED_FREEMIUM_HEADER_NAME);
    req.forwardedAuthority = req.get(FORWARDED_AUTHORITY_HEADER_NAME);
    req.forwardedAmr = req.get(FORWARDER_AMR_HEADER_NAME);
    req.forwardedSession = req.get(FORWARDED_SESSION_HEADER_NAME);
    next();
};

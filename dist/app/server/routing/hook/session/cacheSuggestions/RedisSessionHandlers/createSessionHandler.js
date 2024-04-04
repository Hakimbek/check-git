const RedisCacheService = require('../../../../../edge-services/services/cacheService/redisCacheService').default;
const {
    Suggestions,
    SEARCH_SUGGESTION_SERVICE_ID,
} = require('../../../../../edge-services/DataProviders/SearchSuggestions/SearchSuggestionsService');
const {
    LOGGING_LEVELS: { ERROR },
    LOGGING_MESSAGES: { REDIS_SET_ERROR },
} = require('../../../../../loggerConstants');
const logger = require('../../../../../services/loggerService');

module.exports = async (req, res, forceClean) => {
    try {
        const serviceId = SEARCH_SUGGESTION_SERVICE_ID;
        const userBossKey = req.body.accesstoken.sub;
        const sessionId = req.body.id;
        const permissionsConfigs = Suggestions.getPermissionsConfig();

        if (forceClean) {
            await RedisCacheService.cleanSessionCache({
                serviceId,
                userBossKey,
                sessionId,
            });
        }

        req.forwardedProto = req.protocol;
        req.forwardedHost = req.hostname;
        req.forwardedSub = userBossKey;
        req.forwardedAuthorization = `Bearer ${req.body.accesstoken_original}`;
        req.forwardedAuthority = req.body.accesstoken.authentication_authority;
        req.forwardedAmr = req.body.accesstoken.amr;

        const permissions = await Suggestions.getPermissionsForSuggestions(req, permissionsConfigs.moduleIds);

        RedisCacheService.setItem({
            serviceId,
            userBossKey,
            sessionId,
            cacheItemValue: permissions,
        });
    } catch (error) {
        logger.log(ERROR, REDIS_SET_ERROR);
    }
};

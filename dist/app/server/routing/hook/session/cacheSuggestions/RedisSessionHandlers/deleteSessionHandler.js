const RedisCacheService = require('../../../../../edge-services/services/cacheService/redisCacheService').default;
const {
    SEARCH_SUGGESTION_SERVICE_ID,
} = require('../../../../../edge-services/DataProviders/SearchSuggestions/SearchSuggestionsService');

const {
    LOGGING_LEVELS: { ERROR },
    LOGGING_MESSAGES: { REDIS_DELETE_ERROR },
} = require('../../../../../loggerConstants');
const logger = require('../../../../../services/loggerService');

module.exports = async req => {
    try {
        const serviceId = SEARCH_SUGGESTION_SERVICE_ID;
        const userBossKey = req.body.accesstoken.sub;
        const sessionId = req.body.id;

        await RedisCacheService.cleanSessionCache({
            serviceId,
            userBossKey,
            sessionId,
        });
    } catch (error) {
        logger.log(ERROR, REDIS_DELETE_ERROR);
    }
};

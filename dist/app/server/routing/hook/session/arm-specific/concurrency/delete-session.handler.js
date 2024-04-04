const { getARMMiddlewares } = require('../../../../../edge-services/DataProviders/arm-specific/arm.route');

const { LOGGING_LEVELS } = require('../../../../../loggerConstants');
const logger = require('../../../../../services/loggerService');

const armMiddlewares = getARMMiddlewares();

const concurrencyLogoutHandler = async req => {
    try {
        const userBossKey = req.body.accesstoken.sub;

        await armMiddlewares.services.concurrency.releaseSeat(userBossKey);
    } catch (error) {
        logger.log(LOGGING_LEVELS.ERROR, `Cannot release seat after logout: ${error.message}`);
    }
};

module.exports = {
    concurrencyLogoutHandler,
};

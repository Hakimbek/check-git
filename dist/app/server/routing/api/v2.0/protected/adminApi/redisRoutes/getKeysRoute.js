const RedisCacheService = require('../../../../../../edge-services/services/cacheService/redisCacheService').default;
const INTERNAL_ERROR_STATUS = 500;
const SUCCESS_STATUS = 200;

module.exports = function (router) {
    router.get('/getKeys', async (req, res) => {
        try {
            const { pattern } = req.query;
            const cachedKeys = await RedisCacheService.getKeys({
                keysPattern: pattern,
            });
            if (cachedKeys) {
                res.status(SUCCESS_STATUS).json({
                    message: 'Success: Keys request is successfully performed',
                    data: cachedKeys,
                });
            }
        } catch (error) {
            res.status(INTERNAL_ERROR_STATUS).json({
                message: `Failed: ${error.message}`,
            });
        }
    });
};

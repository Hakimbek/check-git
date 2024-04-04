const RedisCacheService = require('../../../../../../edge-services/services/cacheService/redisCacheService').default;
const INTERNAL_ERROR_STATUS = 500;
const SUCCESS_STATUS = 200;

module.exports = function (router) {
    router.get('/getValue', async (req, res) => {
        try {
            const { key } = req.query;
            const cacheItem = await RedisCacheService.getItem({
                cacheItemKey: key,
            });
            if (cacheItem) {
                res.status(SUCCESS_STATUS).json({
                    message: 'Success: Cache item has been found',
                    data: cacheItem,
                });
            }
        } catch (error) {
            res.status(INTERNAL_ERROR_STATUS).json({
                message: `Failed: ${error.message}`,
            });
        }
    });
};

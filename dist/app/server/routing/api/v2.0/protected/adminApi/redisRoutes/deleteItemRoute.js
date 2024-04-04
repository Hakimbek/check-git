const RedisCacheService = require('../../../../../../edge-services/services/cacheService/redisCacheService').default;
const INTERNAL_ERROR_STATUS = 500;
const SUCCESS_STATUS = 200;

module.exports = function (router) {
    router.get('/deleteKey', async (req, res) => {
        try {
            const { key } = req.query;

            await RedisCacheService.deleteItem(key);

            res.status(SUCCESS_STATUS).json({
                message: 'Success: Item has been removed',
            });
        } catch (error) {
            res.status(INTERNAL_ERROR_STATUS).json({
                message: `Failed: ${error.message}`,
            });
        }
    });
};

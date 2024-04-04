module.exports = (_req, res, next) => {
    res.set({
        'Cache-Control': 'public, max-age=604800',
    });
    next();
};
//# sourceMappingURL=enableCacheMiddleware.js.map
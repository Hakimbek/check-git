"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disableCache = void 0;
const disableCache = (_req, res, next) => {
    res.set({
        'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
        'Expires': 0,
        'Pragma': 'no-cache',
    });
    next();
};
exports.disableCache = disableCache;
//# sourceMappingURL=disableCacheMiddleware.js.map
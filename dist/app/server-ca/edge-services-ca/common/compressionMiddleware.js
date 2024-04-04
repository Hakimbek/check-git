const compression = require('compression');
function filter(req) {
    return req.acceptsEncodings('gzip');
}
module.exports = compression({ filter, level: 9 });
//# sourceMappingURL=compressionMiddleware.js.map
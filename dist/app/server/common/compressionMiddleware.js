const compression = require('compression');

function filter(req) {
    return req.acceptsEncodings('gzip');
}

module.exports = compression({ filter });

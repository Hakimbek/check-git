const apicache = require('apicache');
const envUtils = require('../services/utils/env.util');

const wkVars = require('../services/utils/vars.util').wkVars;

const STATUS_CODE_NOT_FOUND = 404;
const STATUS_CODE_INTERNAL_SERVER_ERROR = 500;
const MEMORY_CACHE_DEFAULT_CONFIG = {
    /*
        As there is only gzip compression supported by the app,
        there are 2 versions of the responses that should be cached: gzip and non-compressed.
        The versions will be served according to the client's accept-encoding header.
    */
    appendKey: req => {
        const requestEncoding = req.acceptsEncodings('gzip') === 'gzip' ? 'gzipped' : 'raw';
        const requestBody = req.rawBody || '';

        return requestEncoding + requestBody;
    },
    enabled: wkVars.vars('assetsCacheEnabled') && !envUtils.isDevMode(),
    defaultDuration: wkVars.vars('assetsCacheTTL'),
    statusCodes: { exclude: [STATUS_CODE_NOT_FOUND, STATUS_CODE_INTERNAL_SERVER_ERROR] },
};

apicache.options(MEMORY_CACHE_DEFAULT_CONFIG);

module.exports = apicache.middleware;

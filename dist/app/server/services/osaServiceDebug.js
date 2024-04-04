// This code from page: https://confluence.wolterskluwer.io/display/OSA/Use+Fiddler+to+capture+OSA+messages
// It is needed only for debugging osa calls in fiddler
const osa = require('@wk/osa');
const ProxyAgent = require('https-proxy-agent');
const nodeFetch = require('node-fetch');
const tough = require('tough-cookie');
const logger = require('./loggerService');
const {
    LOGGING_LEVELS: { ERROR },
    FUNCTION_NAMES: { OSA_SERVICE_DEBUG },
    LOGGING_MESSAGES: { GETTING_COOKIE_FROM_HEADER_FAIL, SETTING_COOKIE_TO_RES_FAIL },
} = require('../loggerConstants');

// dev fiddler config
process.env.https_proxy = 'http://127.0.0.1:8888';
process.env.http_proxy = 'http://127.0.0.1:8888';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
// osaConfig.headers.proxy = 'http://127.0.0.1:8888';

const jar = new tough.CookieJar();
jar.rejectPublicSuffixes = false;

osa.fetch = function (url, options) {
    let cookie;
    try {
        cookie = jar.getCookieStringSync(url);
    } catch (error) {
        logger.log(ERROR, {
            message: GETTING_COOKIE_FROM_HEADER_FAIL,
            function: OSA_SERVICE_DEBUG,
            url,
            statusCode: error.status,
            stacktrace: error.stack,
        });
    }
    if (cookie) {
        (options.headers || (options.headers = {})).Cookie = cookie;
    }

    options.agent = new ProxyAgent('http://127.0.0.1:8888');

    return nodeFetch(url, options).then(function (response) {
        if (response && response.headers && response.headers.getAll) {
            let setCookie = response.headers.getAll('Set-Cookie');
            let setCookieRegexp = /(domain)=(.+):(\d+)/i;
            for (let _i = 0, setCookie1 = setCookie; _i < setCookie1.length; _i++) {
                let cookie1 = setCookie1[_i];
                if (setCookieRegexp.test(cookie1)) {
                    cookie1 = cookie1.replace(setCookieRegexp, '$1=$2');
                }
                try {
                    jar.setCookieSync(cookie1, response.url || url);
                } catch (error) {
                    logger.log(ERROR, {
                        message: SETTING_COOKIE_TO_RES_FAIL,
                        function: OSA_SERVICE_DEBUG,
                        url: response.url || url,
                        statusCode: error.status,
                        stacktrace: error.stack,
                    });
                }
            }
        }

        return response;
    });
};

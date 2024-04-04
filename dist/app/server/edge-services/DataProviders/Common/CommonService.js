"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToolUrl = void 0;
const constants_1 = require("../constants");
const Common_constants_1 = require("./Common.constants");
function getToolUrl(templateUrl, protocol, isFreemium) {
    const resolveToolsUrl = isFreemium ? constants_1.RESOLVE_TOOLS_FREEMIUM_URL : constants_1.RESOLVE_TOOLS_REGISTERED_URL;
    let url = templateUrl;
    if (templateUrl === '') {
        return '';
    }
    if (templateUrl.match(Common_constants_1.FTP_PROTOCOL_REGEXP) || !templateUrl.startsWith(Common_constants_1.START_OF_TOOL_LINK)) {
        return templateUrl;
    }
    // Workaround for non-working content from backend.
    url = url.replace(/(docCode=){2}/, 'docCode=');
    url = url.replace(/amp;/g, '');
    // provide the protocol in the url to proxies rewrite
    url =
        resolveToolsUrl +
            '?tool=' +
            encodeURIComponent(ensureUrlContainsParams(url, constants_1.TOOL_RESOLVING_ADDITIONAL_PARAMS)) +
            '&currentProtocol=' +
            encodeURIComponent(protocol);
    return url;
}
exports.getToolUrl = getToolUrl;
function ensureUrlContainsParams(url, params) {
    if (!url) {
        return url;
    }
    if (params) {
        Object.keys(params).forEach(function (paramsKey) {
            const value = params[paramsKey];
            if (!url.match(new RegExp('[?&]' + paramsKey + '=', 'i'))) {
                url = url
                    .concat(url.match(/\?/) ? '&' : '?')
                    .concat(paramsKey + '=')
                    .concat(value);
            }
        });
    }
    return url;
}
//# sourceMappingURL=CommonService.js.map
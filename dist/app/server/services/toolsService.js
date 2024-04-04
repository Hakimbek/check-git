const urlModule = require('url');
const personalitem = require('@wk/osa-personalitem');
const osaService = require('./osaService');
const wkVars = require('./utils/vars.util').wkVars;
const defaultParamsForAllTools = require('../config/toolUrlsDefaultParams');
const encodedCpidParam = `${encodeURIComponent('?')}cpid=${defaultParamsForAllTools.cpid}`;
const docPathReplaceStatement = `$1${encodedCpidParam}&`;

const { PERSONALITEM_DOMAIN_NAME } = require('../config/appConfig');

class ToolsService {
    ensureHttps(request, url) {
        let reqProto = request.query.currentProtocol || request.headers['x-forwarded-proto'] || request.protocol;
        //cleanup proto
        reqProto = reqProto.replace(':', '');
        if (reqProto === 'https') {
            let parsedUrl = urlModule.parse(url);
            let nonHTTPsDomains = wkVars.vars('nonHttpsSites') || [];

            if (nonHTTPsDomains.indexOf(parsedUrl.hostname) < 0) {
                parsedUrl.protocol = 'https';

                return urlModule.format(parsedUrl);
            }
        }

        //leave the url as-is if the protocol is http
        return url;
    }

    getToolUrl(req) {
        const cpid = wkVars.vars('velvet-cpid');
        let toolLink =
            req.query.tool && req.query.tool.indexOf('cpid') === -1 ? req.query.tool + '&cpid=' + cpid : req.query.tool;

        // GA-14231 CSN-8876 Fix double question mark in URLs
        // Ex.: ...DocFinder.asp?DocPath=TPP/Form1040/1040_Wkst_53.xls?...
        // encodedCpidParam is required in docPath for some users according to ACUS-654 and ACUS-984
        toolLink = toolLink.replace(/(DocFinder\.asp\?DocPath=[^&?]+)[?&]/, docPathReplaceStatement);

        const getToolUrlParam = new personalitem.GetToolUrl({ toolLink });

        return osaService
            .createDomainServiceInstance(PERSONALITEM_DOMAIN_NAME, req)
            .getToolUrl(getToolUrlParam)
            .then(url => {
                const elevateToHttps = wkVars.vars('elevateToHttps');
                if (elevateToHttps) {
                    return this.ensureHttps(req, url);
                }

                return url;
            });
    }
}

module.exports = new ToolsService();

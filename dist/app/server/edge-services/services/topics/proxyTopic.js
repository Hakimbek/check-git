"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio = __importStar(require("cheerio"));
const lodash_1 = require("lodash");
const teaserer_1 = __importDefault(require("./teaserer"));
const wrapper = {
    intro: '<div class="section-content">',
    outro: '</div>',
};
class ProxyTopic {
    getProxyTopic(topicsSearchResult) {
        let $;
        let isSummaryTextAvailable = false;
        const summarySection = topicsSearchResult.d.Section.results.find(item => item.Title === 'Summary');
        const analyticalCommentary = topicsSearchResult.d.Section.results.find(item => item.Title === `'Analytical Commentary' template`);
        if (summarySection) {
            const summarySectionBody = lodash_1.get(summarySection, 'ContentItems.results[0].Body');
            $ = cheerio.load(summarySectionBody);
            isSummaryTextAvailable = /\w/.test($.text());
            // CSN-15478: summary section is not wrapped into "<div class="section-content"></div>"
            if (isSummaryTextAvailable) {
                const wrappedSummarySectionBody = cheerio
                    .load(wrapper.intro + summarySectionBody + wrapper.outro)
                    .html();
                summarySection.ContentItems.results[0].Body = wrappedSummarySectionBody;
            }
        }
        if (!isSummaryTextAvailable) {
            topicsSearchResult.d.Section.results = lodash_1.remove(topicsSearchResult.d.Section.results, (section) => section.Title !== 'Summary');
        }
        if (analyticalCommentary) {
            const commentary = analyticalCommentary.ChildSection.results[0];
            if (commentary) {
                commentary.ContentItems.results[0].Body = teaserer_1.default.makeTeaser(commentary.ContentItems.results[0].Body, summarySection && isSummaryTextAvailable);
            }
        }
        return JSON.stringify(topicsSearchResult);
    }
    middleware(req, res, next) {
        next();
    }
}
exports.default = new ProxyTopic();
//# sourceMappingURL=proxyTopic.js.map
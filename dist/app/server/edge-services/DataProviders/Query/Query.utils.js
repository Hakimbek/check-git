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
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareHTML = exports.makeHTMLAnswer = exports.getClassThatShouldBeRendered = exports.FREEMIUM_ANSWER_HTML = void 0;
const cheerio = __importStar(require("cheerio"));
const qna_shared_data_1 = require("../../client-server/qna-shared-data");
const { SILVER_FED_TOPICS_DES_BASED_PUB, SILVER_FED_TOPICS_DA_BASED_PUB, SILVER_STATE_TOPICS, GOLD_FED_TOPICS_DA_BASED_PUB, GOLD_FED_TOPICS_DES_BASED_PUB, GOLD_STATE_TOPICS, FEDERAL_TAX, EXPLANATIONS, } = qna_shared_data_1.Q_N_A_PERMISSIONS;
exports.FREEMIUM_ANSWER_HTML = '<h4 class="qa-text" data-e2e-element-type="title">\n' +
    '                    Subscribers see more\n' +
    '                </h4>\n' +
    '                <p class="qa-text" data-e2e-element-type="text" data-e2e-element-id="subscribeToSeeMore">\n' +
    '                    CCH AnswerConnect subscribers get immediate, accurate answers to complex tax questions.\n' +
    '                </p>\n' +
    '                <div class="qa-text">\n' +
    '                    <a data-e2e-element-type="link" data-e2e-element-id="login" href="/api/2.0/public/identity/login">\n' +
    '                        Log in\n' +
    '                    </a>\n' +
    '                    <span class="qa-links-separator">or</span>\n' +
    '                    <a data-e2e-element-type="link" data-e2e-element-id="register" href="/register/form">\n' +
    '                        Register for a preview\n' +
    '                    </a>\n' +
    '                </div>';
const getClassThatShouldBeRendered = permissions => {
    const topicPermissions = {
        silver: permissions[SILVER_STATE_TOPICS] ||
            permissions[SILVER_FED_TOPICS_DA_BASED_PUB] ||
            permissions[SILVER_FED_TOPICS_DES_BASED_PUB],
        gold: permissions[GOLD_STATE_TOPICS] ||
            permissions[GOLD_FED_TOPICS_DA_BASED_PUB] ||
            permissions[GOLD_FED_TOPICS_DES_BASED_PUB],
    };
    const csnPermissions = {
        silver: permissions[FEDERAL_TAX] && !permissions[EXPLANATIONS],
        gold: permissions[FEDERAL_TAX] && permissions[EXPLANATIONS],
    };
    if (csnPermissions.gold) {
        return topicPermissions.gold ? 'subscription-gold-ac' : 'subscription-gold-cc';
    }
    if (csnPermissions.silver) {
        return topicPermissions.silver || topicPermissions.gold ? 'subscription-silver-ac' : 'subscription-silver-cc';
    }
    return null;
};
exports.getClassThatShouldBeRendered = getClassThatShouldBeRendered;
const makeHTMLAnswer = ($, CLASS_OF_RIGHT_LINK) => {
    const SELECTOR_OF_LINKS_SHOULD_BE_REMOVED = `[class^="subscription-"]:not(.${CLASS_OF_RIGHT_LINK})`;
    const TEXT_SELECTOR = '.qa-text';
    const DOC_ID_ATTR_NAME = 'docid';
    const DOC_ANCHOR_ATTR_NAME = 'docanchor';
    $(SELECTOR_OF_LINKS_SHOULD_BE_REMOVED).remove();
    if (CLASS_OF_RIGHT_LINK) {
        const SELECTOR_OF_LINK = `.${CLASS_OF_RIGHT_LINK} .qa-link`;
        // wrap links into appropriate A tags
        const DOC_ID = $(SELECTOR_OF_LINK).attr(DOC_ID_ATTR_NAME);
        const DOC_ANCHOR = $(SELECTOR_OF_LINK).attr(DOC_ANCHOR_ATTR_NAME);
        const documentLink = `/resolve/document/${DOC_ID}?${!DOC_ANCHOR ? '' : `&anchor=${DOC_ANCHOR}`}`;
        const ANCHOR_NODE = `<a href="${documentLink}" docid="${DOC_ID}" data-e2e-element-id="documentLink" data-e2e-element-type="link"></a>`;
        $(SELECTOR_OF_LINK).wrap(ANCHOR_NODE);
    }
    $(TEXT_SELECTOR).first().attr('data-e2e-element-type', 'text').attr('data-e2e-element-id', 'answer');
    return $.html();
};
exports.makeHTMLAnswer = makeHTMLAnswer;
const prepareHTML = (html, permissions) => {
    const $ = cheerio.load(html);
    const LINKS_SELECTOR = '[class^="subscription-"]';
    const isResponseHasLinks = $(LINKS_SELECTOR).length > 0;
    const CLASS_OF_LINK_SHOULD_BE_RENDERED = isResponseHasLinks ? exports.getClassThatShouldBeRendered(permissions) : null;
    return exports.makeHTMLAnswer($, CLASS_OF_LINK_SHOULD_BE_RENDERED);
};
exports.prepareHTML = prepareHTML;
//# sourceMappingURL=Query.utils.js.map
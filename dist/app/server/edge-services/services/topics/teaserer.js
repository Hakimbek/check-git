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
const cheerio = __importStar(require("cheerio"));
const lodash_1 = require("lodash");
const externalDependencies_1 = require("../../externalDependencies");
const WRAPPER_CLASSNAME = '___content';
const MODIFIED_SECTION_CLASSNAME = 'freemium-truncated-content';
const WRAPPER_TEASERER = {
    className: WRAPPER_CLASSNAME,
    intro: `<div class="${WRAPPER_CLASSNAME}">`,
    outro: '</div>',
};
class Teaserer {
    constructor() {
        this.truncateSections = ($, nodes, isSummaryTextAvailable) => {
            if (!isSummaryTextAvailable) {
                let isFirstParagraphFound = false;
                const truncatedNodes = lodash_1.filter(nodes[0].children, (node) => {
                    if (!node) {
                        return false;
                    }
                    // CSN-15479: If there is a graphic above the paragraph, do not include the graphic. Only show the first paragraph.
                    const inlineImage = node.children && lodash_1.find(node.children, { type: 'tag', name: 'inline-image' });
                    if (!isFirstParagraphFound && !inlineImage) {
                        if (node.type === 'tag' && node.name === 'p') {
                            const text = $(node).text();
                            const isEndsWithPeriod = /[.]$/.test(text.trim());
                            if (isEndsWithPeriod) {
                                isFirstParagraphFound = true;
                            }
                        }
                        return node;
                    }
                    return false;
                });
                nodes[0].children = truncatedNodes;
            }
            else {
                nodes[0].children = [];
            }
        };
    }
    makeTeaser(document, isSummaryTextAvailable) {
        let $; // document wrapped and parsed with cheerio
        try {
            $ = cheerio.load(WRAPPER_TEASERER.intro + document + WRAPPER_TEASERER.outro);
        }
        catch (err) {
            externalDependencies_1.logService.error(`Failed to parse document with cheerio: ${err.message}`);
            return '';
        }
        const wrapper = $(`.${WRAPPER_TEASERER.className}`);
        const contents = wrapper.contents();
        this.truncateSections($, contents, isSummaryTextAvailable);
        // set "modified section" className to the truncated section
        const initialClassNames = lodash_1.get(contents[0], 'attribs.class') || '';
        lodash_1.set(contents[0], 'attribs.class', `${initialClassNames} ${MODIFIED_SECTION_CLASSNAME}`);
        return wrapper.html() + '<csn-freemium-content class="freemium-content-wrapper-border"/>';
    }
}
exports.default = new Teaserer();
//# sourceMappingURL=teaserer.js.map
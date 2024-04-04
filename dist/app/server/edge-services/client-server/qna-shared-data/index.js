"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeQuestionMark = exports.Q_N_A_PERMISSIONS = void 0;
exports.Q_N_A_PERMISSIONS = {
    PREMIUM_DICTIONARY: 'WKUS_TAL_19126',
    FEDERAL_TAX: 'WKUS_TAL_11715',
    EXPLANATIONS: 'WKUS_TAL_11713',
    GOLD_FED_TOPICS_DA_BASED_PUB: 'WKUS_TAL_11702',
    GOLD_FED_TOPICS_DES_BASED_PUB: 'WKUS_TAL_18510',
    GOLD_STATE_TOPICS: 'WKUS_TAL_11703',
    SILVER_FED_TOPICS_DA_BASED_PUB: 'WKUS_TAL_16454',
    SILVER_FED_TOPICS_DES_BASED_PUB: 'WKUS_TAL_18512',
    SILVER_STATE_TOPICS: 'WKUS_TAL_16457',
};
const removeQuestionMark = (string) => string === null || string === void 0 ? void 0 : string.replace(new RegExp('[?]$'), '');
exports.removeQuestionMark = removeQuestionMark;
//# sourceMappingURL=index.js.map
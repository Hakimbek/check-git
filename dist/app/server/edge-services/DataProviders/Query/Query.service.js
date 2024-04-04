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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDictionaries = exports.PREMIUM_DICTIONARY = void 0;
const DAO = __importStar(require("./Query.dao.osa2"));
const qna_shared_data_1 = require("../../client-server/qna-shared-data");
const externalDependencies_1 = require("../../externalDependencies");
const Query_types_1 = require("./Query.types");
const Query_utils_1 = require("./Query.utils");
exports.PREMIUM_DICTIONARY = qna_shared_data_1.Q_N_A_PERMISSIONS.PREMIUM_DICTIONARY;
const qaDictionaryConfig = externalDependencies_1.vars.get('qaDictionary');
const qaDictionaryPremiumConfig = externalDependencies_1.vars.get('qaDictionaryPremium');
const getDictionaries = (request, { query, permissions, isFreemium }) => __awaiter(void 0, void 0, void 0, function* () {
    const isPremiumDictionaryPermitted = permissions[exports.PREMIUM_DICTIONARY];
    const linksPermissions = Object.keys(permissions)
        .filter(permId => permId !== exports.PREMIUM_DICTIONARY)
        .reduce((acc, permId) => (Object.assign(Object.assign({}, acc), { [permId]: permissions[permId] })), {});
    const cleanQuery = qna_shared_data_1.removeQuestionMark(query);
    const premiumDictionaryParams = new Query_types_1.Dictionary(Object.assign(Object.assign({ query: cleanQuery }, qaDictionaryPremiumConfig), { searchMethod: Query_types_1.SEARCH_METHODS.INFIX }));
    const stockDictionaryParams = new Query_types_1.Dictionary(Object.assign(Object.assign({ query: cleanQuery }, qaDictionaryConfig), { searchMethod: Query_types_1.SEARCH_METHODS.INFIX }));
    const dictionariesRequests = [DAO.getAutocompletion(request, stockDictionaryParams)].concat(isPremiumDictionaryPermitted && !isFreemium && DAO.getAutocompletion(request, premiumDictionaryParams));
    try {
        const [stockDictionary, premiumDictionary] = yield Promise.all(dictionariesRequests);
        if (isFreemium && (stockDictionary === null || stockDictionary === void 0 ? void 0 : stockDictionary.length)) {
            return Object.assign(Object.assign({}, stockDictionary), { quickKey: Query_utils_1.FREEMIUM_ANSWER_HTML });
        }
        if (!(premiumDictionary === null || premiumDictionary === void 0 ? void 0 : premiumDictionary.length) && !(stockDictionary === null || stockDictionary === void 0 ? void 0 : stockDictionary.length)) {
            return {};
        }
        const response = []
            .concat((premiumDictionary === null || premiumDictionary === void 0 ? void 0 : premiumDictionary.length) && premiumDictionary, (stockDictionary === null || stockDictionary === void 0 ? void 0 : stockDictionary.length) && stockDictionary)
            .filter(Boolean)
            .shift();
        if (!response) {
            return {};
        }
        const preparedHTML = Query_utils_1.prepareHTML(response.quickKey, linksPermissions);
        return Object.assign(Object.assign({}, premiumDictionary), { quickKey: preparedHTML });
    }
    catch (error) {
        throw new Error(error);
    }
});
exports.getDictionaries = getDictionaries;
//# sourceMappingURL=Query.service.js.map
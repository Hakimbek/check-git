"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findConceptsInQuery = exports.getAutocompletion = void 0;
const osa_query_1 = require("@wk/osa-query");
const constants_1 = require("../../config/constants");
const osaService_1 = __importDefault(require("../../services/common/osaService"));
const autocompletionParamsFactory = (_a) => {
    var { query } = _a, dictionary = __rest(_a, ["query"]);
    const params = {
        query,
        dictionaryIds: [dictionary.dictionaryId],
        languages: [dictionary.language],
        searchMethod: osa_query_1.AutocompleteSearchMethod[dictionary.searchMethod],
        maxSuggestions: dictionary.maxSuggestions,
    };
    return new osa_query_1.Autocompletions(params);
};
function getAutocompletion(req, dictionary) {
    const queryService = osaService_1.default.createDomainServiceInstance(constants_1.QUERY_DOMAIN_NAME, req);
    const consistentArguments = autocompletionParamsFactory(Object.assign({}, dictionary));
    return queryService.autocompletions(consistentArguments);
}
exports.getAutocompletion = getAutocompletion;
function findConceptsInQuery(req, query, dictionaryIds, languages = ['en'], matchScope = osa_query_1.MatchMethod.PartialMatch) {
    const queryService = osaService_1.default.createDomainServiceInstance(constants_1.QUERY_DOMAIN_NAME, req);
    const findConceptsInQueryParams = new osa_query_1.FindConceptsInQuery({
        query,
        dictionaryIds,
        languages,
        matchScope,
    });
    return queryService.findConceptsInQuery(findConceptsInQueryParams);
}
exports.findConceptsInQuery = findConceptsInQuery;
//# sourceMappingURL=Query.dao.osa2.js.map
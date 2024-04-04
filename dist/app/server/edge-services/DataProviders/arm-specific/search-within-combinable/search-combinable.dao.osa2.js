"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSearchResultForDocumentIdsSearch = void 0;
const osa_research_1 = require("@wk/osa-research");
const constants_1 = require("../../../config/constants");
const osaService_1 = __importDefault(require("../../../services/common/osaService"));
function getSearchResultForDocumentIdsSearch(req, searchWithinDocumentParams) {
    const researchService = osaService_1.default.createDomainServiceInstance(constants_1.RESEARCH_DOMAIN_NAME, req);
    const executeSearchParams = new osa_research_1.ExecuteSearch({
        query: searchWithinDocumentParams.query,
        searchScope: new osa_research_1.SearchScopeParams({
            documentIds: searchWithinDocumentParams.documentIds,
        }),
    });
    return researchService.executeSearch(executeSearchParams, {
        $expand: 'Result/Items',
    });
}
exports.getSearchResultForDocumentIdsSearch = getSearchResultForDocumentIdsSearch;
//# sourceMappingURL=search-combinable.dao.osa2.js.map
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsDAO = void 0;
const pick_1 = __importDefault(require("lodash/pick"));
const edge_services_1 = require("@wk/acm-osa-service/edge-services");
const osa_research_1 = require("@wk/osa-research");
class NewsDAO {
    static getNews(req, searchParams, odataParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const researchService = edge_services_1.osaService.createDomainServiceInstance(osa_research_1.ResearchOsaService, osa_research_1.domain.name, req);
            const executeSearchParams = new osa_research_1.ExecuteSearch({
                query: '*',
                searchScope: new osa_research_1.SearchScopeParams({
                    includeArchivePubs: false,
                    includeModelDocuments: false,
                    contentTreeNodeIds: [...(searchParams.contentTreeNodeIds || [])],
                }),
                runtimeOptions: new osa_research_1.SearchRuntimeParams({
                    extendedMetadataParams: new osa_research_1.ExtendedMetadataParams({
                        extendedMetadataFields: [...(searchParams.metadataFields || [])],
                    }),
                    saveToHistory: false,
                    sorting: [
                        // @TODO make it configurable?
                        new osa_research_1.Sort({
                            order: osa_research_1.SortField.Custom,
                            direction: osa_research_1.SortDirection.Descending,
                            customSortField: 'wksortdate',
                        }),
                    ],
                }),
            });
            const results = yield (yield researchService.executeSearch(executeSearchParams, {
                $expand: 'Result/Items',
                $top: odataParams === null || odataParams === void 0 ? void 0 : odataParams.top,
                $skip: odataParams === null || odataParams === void 0 ? void 0 : odataParams.skip,
            })).getResult();
            return (yield results.getItems()).map(item => {
                var _a;
                const extractedItem = pick_1.default(item, ['title', 'summary', 'id']);
                if (NewsDAO.services.DocumentTransformation) {
                    extractedItem.title = NewsDAO.services.DocumentTransformation.getTitle(item);
                }
                extractedItem.id = (_a = extractedItem.id) === null || _a === void 0 ? void 0 : _a.split('!').pop();
                return extractedItem;
            });
        });
    }
}
exports.NewsDAO = NewsDAO;
NewsDAO.services = {};
//# sourceMappingURL=news.dao.osa2.js.map
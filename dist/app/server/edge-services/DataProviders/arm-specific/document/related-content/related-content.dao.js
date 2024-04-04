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
exports.RelatedContentDao = void 0;
const lodash_1 = require("lodash");
const osa_1 = require("@wk/osa");
const osa_research_1 = require("@wk/osa-research");
const constants_1 = require("../../../../config/constants");
const externalModules_1 = require("../../../../externalModules");
const osaService_1 = __importDefault(require("../../../../services/common/osaService"));
const related_content_constants_1 = require("./related-content.constants");
class RelatedContentDao {
    static getRelatedContent(req, documentId, includeArchivePubs = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const researchService = osaService_1.default.createDomainServiceInstance(constants_1.RESEARCH_DOMAIN_NAME, req);
            const searchParams = new osa_research_1.CitationSearch({
                searchSpecification: new osa_research_1.BackwardReferenceSpec({
                    documentId,
                }),
                searchScope: new osa_research_1.SearchScopeParams({
                    contentTreeNodeIds: [related_content_constants_1.ARM_CONTENT_NODE_ID],
                    includeArchivePubs,
                    includeModelDocuments: false,
                    excludedDocumentIds: [documentId],
                }),
                runtimeOptions: new osa_research_1.SearchRuntimeParams({
                    extendedMetadataParams: new osa_research_1.ExtendedMetadataParams({
                        extendedMetadataFields: related_content_constants_1.RELATED_CONTENT_REQUEST_EXTENDED_METADATA_FIELDS,
                    }),
                    saveToHistory: false,
                }),
            });
            const oDataParams = new osa_1.common.ODataParams({
                $expand: 'Result/Items',
            });
            const results = lodash_1.get(yield researchService.citationSearch(searchParams, oDataParams), 'result.items');
            return results.map(item => ({
                id: item.documentId,
                title: externalModules_1.DocumentTransformation.getExtractedTitle(item),
                book: externalModules_1.DocumentTransformation.getMetadata(item, related_content_constants_1.BOOK_METADATA_KEY, related_content_constants_1.BOOK_METADATA_ATTRIBUTE_KEY),
                daTitle: externalModules_1.DocumentTransformation.getMetadata(item, related_content_constants_1.DA_TITLE_METADATA_KEY),
            }));
        });
    }
}
exports.RelatedContentDao = RelatedContentDao;
//# sourceMappingURL=related-content.dao.js.map
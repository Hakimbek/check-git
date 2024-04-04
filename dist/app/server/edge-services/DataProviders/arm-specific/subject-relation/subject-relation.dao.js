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
exports.getSubjectRelationDAO = void 0;
const osa_1 = require("@wk/osa");
const osa_research_1 = require("@wk/osa-research");
const osa_resource_1 = require("@wk/osa-resource");
const constants_1 = require("../../../config/constants");
const osaService_1 = __importDefault(require("../../../services/common/osaService"));
const subject_relation_constants_1 = require("./subject-relation.constants");
function getSubjectRelationDAO() {
    function searchForUCMDocument(req, context, subject) {
        return __awaiter(this, void 0, void 0, function* () {
            const researchService = osaService_1.default.createDomainServiceInstance(constants_1.RESEARCH_DOMAIN_NAME, req);
            const searchParams = new osa_research_1.ExecuteSearch({
                query: '*',
                searchScope: new osa_research_1.SearchScopeParams({
                    includeArchivePubs: false,
                    includeModelDocuments: true,
                    contentTreeNodeIds: [subject_relation_constants_1.CONTENT_NODE_IDS[context]],
                    filterTextFields: [
                        new osa_research_1.FilterTextField({
                            filterId: 'wkdcsubject',
                            textValues: [subject],
                        }),
                    ],
                }),
                runtimeOptions: new osa_research_1.SearchRuntimeParams({
                    saveToHistory: false,
                }),
            });
            const oDataParams = new osa_1.common.ODataParams({
                $expand: 'Result/Items',
            });
            const searchResponse = yield researchService.executeSearch(searchParams, oDataParams);
            const searchResult = yield searchResponse.getResult();
            return (yield searchResult.getItems()).map((item) => {
                return {
                    modelDocumentId: item.modelDocumentId,
                };
            });
        });
    }
    function getDocumentNodeId(req, documentId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!documentId) {
                throw new Error('Document Id is required');
            }
            const resourceService = osaService_1.default.createDomainServiceInstance(constants_1.RESOURCE_DOMAIN_NAME, req);
            const request = new osa_resource_1.GetDocumentInContext({
                document: new osa_resource_1.DocumentId({ id: documentId }),
                extendedMetadataFields: [],
            });
            const document = yield resourceService.getDocumentInContext(request, { $expand: 'Paths/Nodes' });
            const pathsNodes = yield (yield document.getPaths())[0].getNodes();
            return pathsNodes[pathsNodes.length - 1].id;
        });
    }
    return {
        searchForUCMDocument,
        getDocumentNodeId,
    };
}
exports.getSubjectRelationDAO = getSubjectRelationDAO;
//# sourceMappingURL=subject-relation.dao.js.map
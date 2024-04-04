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
exports.RelationsDAO = void 0;
const lodash_1 = require("lodash");
const osa_1 = require("@wk/osa");
const osa_research_1 = require("@wk/osa-research");
const osa_resource_1 = require("@wk/osa-resource");
const constants_1 = require("../../../../config/constants");
const externalModules_1 = require("../../../../externalModules");
const osaService_1 = __importDefault(require("../../../../services/common/osaService"));
const relations_constants_1 = require("./relations.constants");
class RelationsDAO {
    static transformDocumentRelation(relation) {
        // const relationInfo = JSON.parse(relation.id);
        var _a;
        return {
            // linkId: relationInfo.linkId,
            // docId: relationInfo.docId,
            anchor: relation.anchor,
            id: relation.linkId,
            name: relation.name,
            children: (_a = relation['children']) === null || _a === void 0 ? void 0 : _a.map(el => this.transformDocumentRelation(el)),
        };
    }
    static getDocumentRelations(req, documentId, relationshipSetId) {
        return __awaiter(this, void 0, void 0, function* () {
            const resourceService = osaService_1.default.createDomainServiceInstance(constants_1.RESOURCE_DOMAIN_NAME, req);
            const relationshipsRequestParams = new osa_resource_1.GetRelationships({
                document: new osa_resource_1.DocumentId({ id: documentId }),
                relationshipSetId,
                includeModelDocs: true,
            });
            const relations = yield resourceService
                .getRelationships(relationshipsRequestParams, {
                $expand: 'Children/Children, Documents, Documents/Paths, Path/Nodes',
            })
                // @TODO add log
                .catch(() => []);
            return relations.map(relation => RelationsDAO.transformDocumentRelation(relation));
        });
    }
    static getDocumentsByRelation(req, documentId, relationshipId, relationshipSetID) {
        return __awaiter(this, void 0, void 0, function* () {
            const researchService = osaService_1.default.createDomainServiceInstance(constants_1.RESEARCH_DOMAIN_NAME, req);
            const searchParams = new osa_research_1.CitationSearch({
                searchSpecification: new osa_research_1.RelateForRelationshipSpec({
                    documentId,
                    relationshipId,
                    relationshipSetID,
                }),
                searchScope: new osa_research_1.SearchScopeParams({
                    contentTreeNodeIds: [...relations_constants_1.ARM_CONTENT_NODES],
                    includeArchivePubs: true,
                    includeModelDocuments: true,
                    excludedDocumentIds: [documentId],
                }),
                runtimeOptions: new osa_research_1.SearchRuntimeParams({
                    extendedMetadataParams: new osa_research_1.ExtendedMetadataParams({
                        extendedMetadataFields: relations_constants_1.RELATED_DOCUMENTS_EXTENDED_METADATA_FIELDS,
                    }),
                    saveToHistory: false,
                }),
            });
            const oDataParams = new osa_1.common.ODataParams({
                $expand: 'Result/Items',
            });
            const result = lodash_1.get(yield researchService.citationSearch(searchParams, oDataParams), 'result.items');
            return result.reduce((acc, item) => {
                var _a, _b;
                let anchors;
                const multivaluedAnchors = (_b = (_a = item.multivaluedMetadata) === null || _a === void 0 ? void 0 : _a.find(metadataItem => (metadataItem === null || metadataItem === void 0 ? void 0 : metadataItem.fieldName) === 'anchorList')) === null || _b === void 0 ? void 0 : _b.fieldValue;
                if (multivaluedAnchors === null || multivaluedAnchors === void 0 ? void 0 : multivaluedAnchors.length) {
                    anchors = multivaluedAnchors;
                }
                else {
                    anchors = item.searchMetadata.reduce((anchorsAcc, el) => {
                        if (el.key.startsWith('anchor')) {
                            anchorsAcc.push(el.value);
                        }
                        return anchorsAcc;
                    }, []);
                }
                const docId = (item === null || item === void 0 ? void 0 : item.documentId) || (item === null || item === void 0 ? void 0 : item.id);
                const documentData = {
                    id: docId.includes('!') ? docId.split('!')[2] : docId,
                    searchId: item.id,
                    title: externalModules_1.DocumentTransformation.getExtractedTitle(item),
                    extendedMetadata: item.extendedMetadata,
                    anchors,
                };
                if (item.url) {
                    documentData['url'] = item.url;
                }
                acc.push(documentData);
                return acc;
            }, []);
        });
    }
}
exports.RelationsDAO = RelationsDAO;
//# sourceMappingURL=relations.dao.js.map
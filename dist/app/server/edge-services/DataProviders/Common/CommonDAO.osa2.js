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
exports.getDocumentsExtendedMetadata = exports.getDocumentsWithExtendedMetadata = exports.expandNodesMetadata = void 0;
const lodash_1 = require("lodash");
const osa_resource_1 = require("@wk/osa-resource");
const constants_1 = require("../../config/constants");
const osaService_1 = __importDefault(require("../../services/common/osaService"));
function expandNodesMetadata(req, nodes, metadataFields = []) {
    return __awaiter(this, void 0, void 0, function* () {
        const contentTreeNodesIds = nodes.map(node => new osa_resource_1.ContentTreeNodeId({ id: node.id }));
        const metadataList = yield getNodesMetadataList(req, contentTreeNodesIds, metadataFields);
        nodes.forEach(node => {
            const extendedMetadata = metadataList.find(treeNodeMetadata => treeNodeMetadata.nodeId === node.id);
            node.extendedMetadata = lodash_1.head(extendedMetadata.metadata);
        });
        return nodes;
    });
}
exports.expandNodesMetadata = expandNodesMetadata;
function getNodesMetadataList(req, contentTreeNodeIds, metadataFieldsList) {
    return __awaiter(this, void 0, void 0, function* () {
        const osaResourceService = osaService_1.default.createDomainServiceInstance(constants_1.RESOURCE_DOMAIN_NAME, req);
        return osaResourceService.getTreeNodeExtendedMetadata(new osa_resource_1.GetTreeNodeExtendedMetadata({
            treeNodes: contentTreeNodeIds,
            extendedMetadataFields: metadataFieldsList,
        }));
    });
}
function getDocumentsWithExtendedMetadata(req, documentIds, metadataFields) {
    return __awaiter(this, void 0, void 0, function* () {
        const documentsExtendedMetadata = yield getDocumentsExtendedMetadata(req, documentIds, metadataFields);
        return documentIds.map(documentId => {
            const documentMetadata = documentsExtendedMetadata.find(documentMetadata => documentMetadata.documentId === documentId);
            return {
                id: documentId,
                extendedMetadata: documentMetadata.metadata[0],
            };
        });
    });
}
exports.getDocumentsWithExtendedMetadata = getDocumentsWithExtendedMetadata;
function getDocumentsExtendedMetadata(req, documentIds, metadataFields) {
    const osaResourceService = osaService_1.default.createDomainServiceInstance(constants_1.RESOURCE_DOMAIN_NAME, req);
    const extendedMetadataParams = new osa_resource_1.GetExtendedMetadata({
        documents: documentIds.map(documentId => new osa_resource_1.DocumentId({ id: documentId })),
        extendedMetadataFields: metadataFields,
    });
    return osaResourceService.getExtendedMetadata(extendedMetadataParams);
}
exports.getDocumentsExtendedMetadata = getDocumentsExtendedMetadata;
//# sourceMappingURL=CommonDAO.osa2.js.map
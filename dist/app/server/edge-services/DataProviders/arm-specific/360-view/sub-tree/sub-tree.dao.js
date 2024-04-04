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
exports.SubTreeDao = void 0;
const osa_1 = require("@wk/osa");
const osa_resource_1 = require("@wk/osa-resource");
const osaService_1 = __importDefault(require("../../../../services/common/osaService"));
const sub_tree_constants_1 = require("./sub-tree.constants");
class SubTreeDao {
    static getNodeSubTree(req, nodeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const resourceService = osaService_1.default.createDomainServiceInstance(osa_resource_1.domain.name, req);
            const oDataParams = new osa_1.common.ODataParams({
                $expand: sub_tree_constants_1.EXPAND_PARAMS,
            });
            const node = yield resourceService.contentTreeNodes.one(nodeId, oDataParams);
            const { subTreeNodesIds, subTreeDocumentsIds } = this.getSubTreeNodesAndDocumentsIds(node);
            const nodesMetadataPromise = yield resourceService.getTreeNodeExtendedMetadata(new osa_resource_1.GetTreeNodeExtendedMetadata({
                treeNodes: subTreeNodesIds.map(subTreeNodeId => new osa_resource_1.ContentTreeNodeId({ id: subTreeNodeId })),
                extendedMetadataFields: sub_tree_constants_1.METADATA_FIELDS,
            }));
            const documentsMetadataPromise = subTreeDocumentsIds.length
                ? yield resourceService.getExtendedMetadata(new osa_resource_1.GetExtendedMetadata({
                    documents: subTreeDocumentsIds.map(docId => new osa_resource_1.DocumentId({ id: docId })),
                    extendedMetadataFields: sub_tree_constants_1.METADATA_FIELDS,
                }))
                : Promise.resolve([]);
            const [nodesMetadata, documentsMetadata] = yield Promise.all([nodesMetadataPromise, documentsMetadataPromise]);
            return this.osaNodeToNodeDTO(node, nodesMetadata, documentsMetadata);
        });
    }
    static getSubTreeNodesAndDocumentsIds(node) {
        const nodesToEnrich = [node];
        const nodesIds = [node.id];
        const documentsIds = (node === null || node === void 0 ? void 0 : node.documentIdentifier) ? [node === null || node === void 0 ? void 0 : node.documentIdentifier] : [];
        while (nodesToEnrich.length) {
            const targetNode = nodesToEnrich.pop();
            // for the last expanded level we should not check children, but 'children' property exists there
            if (targetNode['children'] instanceof Array) {
                nodesToEnrich.push(...targetNode['children']);
                targetNode['children'].forEach(childNode => {
                    nodesIds.push(childNode.id);
                    if (childNode === null || childNode === void 0 ? void 0 : childNode.documentIdentifier) {
                        documentsIds.push(childNode.documentIdentifier);
                    }
                });
            }
        }
        return {
            subTreeNodesIds: nodesIds,
            subTreeDocumentsIds: documentsIds,
        };
    }
    static osaNodeToNodeDTO(node, nodesMetadata, documentsMetadata) {
        var _a, _b, _c, _d;
        const nodeMetadataObject = nodesMetadata.find(metadata => metadata.nodeId === node.id);
        const documentMetadataObject = (node === null || node === void 0 ? void 0 : node.documentIdentifier) ? documentsMetadata === null || documentsMetadata === void 0 ? void 0 : documentsMetadata.find(metadata => metadata.documentId === node.documentIdentifier) : null;
        const unitedMetadataOdject = [
            ...(((_b = (_a = nodeMetadataObject === null || nodeMetadataObject === void 0 ? void 0 : nodeMetadataObject.metadata) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.objects) || []),
            ...(((_d = (_c = documentMetadataObject === null || documentMetadataObject === void 0 ? void 0 : documentMetadataObject.metadata) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.objects) || []),
        ];
        const transformedNode = {
            id: node.id,
            title: node.title,
            documentId: node === null || node === void 0 ? void 0 : node.documentIdentifier,
            isLeaf: node.isLeaf,
            children: (node === null || node === void 0 ? void 0 : node['children']) instanceof Array
                ? node === null || node === void 0 ? void 0 : node['children'].map(child => this.osaNodeToNodeDTO(child, nodesMetadata, documentsMetadata)) : [],
            metadata: unitedMetadataOdject === null || unitedMetadataOdject === void 0 ? void 0 : unitedMetadataOdject.reduce((acc, metadataObject) => {
                var _a, _b;
                acc[metadataObject.name] = Object.assign(Object.assign({}, (acc[metadataObject.name] || { value: metadataObject.value, attributes: {} })), { value: metadataObject.value });
                if ((_a = metadataObject === null || metadataObject === void 0 ? void 0 : metadataObject.attributes) === null || _a === void 0 ? void 0 : _a.length) {
                    (_b = metadataObject === null || metadataObject === void 0 ? void 0 : metadataObject.attributes) === null || _b === void 0 ? void 0 : _b.forEach(metadataAttribute => {
                        var _a, _b;
                        if ((_b = (_a = acc[metadataObject.name]) === null || _a === void 0 ? void 0 : _a.attributes) === null || _b === void 0 ? void 0 : _b[metadataAttribute.key]) {
                            acc[metadataObject.name].attributes[metadataAttribute.key].push(metadataAttribute.value);
                        }
                        else {
                            acc[metadataObject.name].attributes[metadataAttribute.key] = [metadataAttribute.value];
                        }
                    });
                }
                return acc;
            }, {}),
        };
        return transformedNode;
    }
}
exports.SubTreeDao = SubTreeDao;
//# sourceMappingURL=sub-tree.dao.js.map
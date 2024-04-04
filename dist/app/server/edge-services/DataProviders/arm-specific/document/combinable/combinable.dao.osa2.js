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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCombinableDocumentDAO = void 0;
const edge_services_1 = require("@wk/acm-osa-service/edge-services");
const osa_resource_1 = require("@wk/osa-resource");
function getCombinableDocumentDAO() {
    function getDocumentsExtendedMetadata(req, documentIds, metadataFields) {
        const osaResourceService = edge_services_1.osaService.createDomainServiceInstance(osa_resource_1.ResourceOsaService, osa_resource_1.domain.name, req);
        const extendedMetadataParams = new osa_resource_1.GetExtendedMetadata({
            documents: documentIds.map(documentId => new osa_resource_1.DocumentId({ id: documentId })),
            extendedMetadataFields: metadataFields,
        });
        return osaResourceService.getExtendedMetadata(extendedMetadataParams);
    }
    function getDocumentsWithExtendedMetadata(req, documentIds, metadataFields) {
        return __awaiter(this, void 0, void 0, function* () {
            const documentsExtendedMetadata = yield getDocumentsExtendedMetadata(req, documentIds, metadataFields);
            return documentIds.map(documentId => {
                const relatedDocumentMetadata = documentsExtendedMetadata.find(documentMetadata => documentMetadata.documentId === documentId);
                return {
                    id: documentId,
                    extendedMetadata: relatedDocumentMetadata.metadata[0],
                };
            });
        });
    }
    return {
        getDocumentsWithExtendedMetadata,
    };
}
exports.getCombinableDocumentDAO = getCombinableDocumentDAO;
//# sourceMappingURL=combinable.dao.osa2.js.map
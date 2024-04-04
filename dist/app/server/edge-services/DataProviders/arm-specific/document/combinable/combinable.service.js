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
exports.getCombinableDocumentService = void 0;
const combinable_dao_osa2_1 = require("./combinable.dao.osa2");
function getCombinableDocumentService({ configs, services }) {
    const DAO = combinable_dao_osa2_1.getCombinableDocumentDAO();
    function splitMetadataRequests(req, documentsIds) {
        return __awaiter(this, void 0, void 0, function* () {
            // there is some undefined limit of requesting metadata
            // using Empirical length 100, might be lowered later.
            const chunksResultsPromises = [];
            const chunkSize = 100;
            for (let i = 0; i < Math.ceil(documentsIds.length / chunkSize); i++) {
                const nextChunk = documentsIds.slice(i * chunkSize, (i + 1) * chunkSize);
                const nextChunkMetadataPromise = DAO.getDocumentsWithExtendedMetadata(req, nextChunk, [
                    ...configs.metadataFields,
                ]);
                chunksResultsPromises.push(nextChunkMetadataPromise);
            }
            const results = yield Promise.all(chunksResultsPromises);
            return results.flat();
        });
    }
    function getDocumentsTitles(req, documentsIds) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (documentsIds.length < 1) {
                return [];
            }
            // let documentsWithMetadata = await DAO.getDocumentsWithExtendedMetadata(
            //     req,
            //     documentsIds,
            //     configs.metadataFields
            // );
            let documentsWithMetadata = yield splitMetadataRequests(req, documentsIds);
            // documentTransformation.getItemsWithExtractedTitles requires default title for the document
            // which is used in case of failed title extraction
            documentsWithMetadata = documentsWithMetadata.map(doc => (Object.assign({ title: '' }, doc)));
            const documentsWithExtractedTitles = (_a = services.documentTransformation) === null || _a === void 0 ? void 0 : _a.getItemsWithExtractedTitles(documentsWithMetadata);
            return documentsWithExtractedTitles.map(docWithTitle => ({
                documentId: docWithTitle.id,
                title: `${docWithTitle.title}`,
            }));
        });
    }
    return {
        getDocumentsTitles,
    };
}
exports.getCombinableDocumentService = getCombinableDocumentService;
//# sourceMappingURL=combinable.service.js.map
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
exports.getDocumentSetIdsBySearchId = void 0;
const constants_1 = require("../../../../config/constants");
const osaService_1 = __importDefault(require("../../../../services/common/osaService"));
function getDocumentSetIdsBySearchId(req, searchId) {
    return __awaiter(this, void 0, void 0, function* () {
        const researchService = osaService_1.default.createDomainServiceInstance(constants_1.RESEARCH_DOMAIN_NAME, req);
        const restoredSearch = yield researchService.searches.one(searchId);
        const documentSetIds = restoredSearch.metadata.scopeInfo.documentInfo.map(documentInfo => documentInfo.documentId);
        return documentSetIds;
    });
}
exports.getDocumentSetIdsBySearchId = getDocumentSetIdsBySearchId;
//# sourceMappingURL=favorites-document-sets.dao.osa2.js.map
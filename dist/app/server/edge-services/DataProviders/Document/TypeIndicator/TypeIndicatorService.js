"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.TypeIndicatorService = void 0;
const type_indicator_service_1 = require("../../arm-specific/document/type-indicator/type-indicator.service");
const CommonDAO = __importStar(require("../../Common/CommonDAO.osa2"));
const ARM_METADATA__BOOK_KEY = 'pcicore:isInPublication';
const ARM_METADATA__AUTHOR_KEY = 'pcicore:isIssuedBy';
const METADATA__PUBVOL = 'pubvol';
class TypeIndicatorService {
    // by document id
    getDocumentTypeIndicator(req, documentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const document = yield this.getDocumentAndExtendedMetadata(documentId, req);
            return new type_indicator_service_1.ARMDocumentTypeIndicatorService().getDocumentTypeIndicatorByDocument(document);
        });
    }
    getDocumentTypeIndicatorByDocument(document) {
        return new type_indicator_service_1.ARMDocumentTypeIndicatorService().getDocumentTypeIndicatorByDocument(document);
    }
    getDocumentAndExtendedMetadata(documentId, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const documents = yield CommonDAO.getDocumentsWithExtendedMetadata(req, [documentId], [ARM_METADATA__BOOK_KEY, ARM_METADATA__AUTHOR_KEY, 'primary-class', METADATA__PUBVOL]);
            return documents.find(doc => doc.id === documentId);
        });
    }
}
exports.TypeIndicatorService = TypeIndicatorService;
//# sourceMappingURL=TypeIndicatorService.js.map
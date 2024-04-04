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
exports.DocumentInfoService = void 0;
const lodash_1 = require("lodash");
const externalModules_1 = require("../../../externalModules");
const CommonDAO = __importStar(require("../../Common/CommonDAO.osa2"));
class DocumentInfoService {
    getDocumentWithExtendedMetadata(req, documentId, metadataFields) {
        return __awaiter(this, void 0, void 0, function* () {
            const documents = yield CommonDAO.getDocumentsWithExtendedMetadata(req, [documentId], metadataFields);
            return lodash_1.first(documents);
        });
    }
    getDocumentWkDocSource(req, documentId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const document = yield this.getDocumentWithExtendedMetadata(req, documentId, ['GA_WKDOCSOURCE']);
            if (!document) {
                return null;
            }
            return (_a = externalModules_1.DocumentTransformation.getMetadata(document, 'WKDOCSOURCE')) !== null && _a !== void 0 ? _a : null;
        });
    }
    getDocumentMetadataValue(req, documentId, metadataName, attributeKey, attributeValue) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const document = yield this.getDocumentWithExtendedMetadata(req, documentId, [metadataName]);
            if (!document) {
                return null;
            }
            return (_a = externalModules_1.DocumentTransformation.getMetadata(document, metadataName, attributeKey, attributeValue)) !== null && _a !== void 0 ? _a : null;
        });
    }
}
exports.DocumentInfoService = DocumentInfoService;
//# sourceMappingURL=Info.service.js.map
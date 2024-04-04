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
exports.getDocumentSetIdsBySearchId = exports.LOG_MESSAGE_GET_DOCUMENT_SET_IDS_BY_SEARCH_ID_REQUEST_FAIL = void 0;
const DAO = __importStar(require("./favorites-document-sets.dao.osa2"));
exports.LOG_MESSAGE_GET_DOCUMENT_SET_IDS_BY_SEARCH_ID_REQUEST_FAIL = 'Failed to get document set ids by searchId.';
class CombinedDocumentSetsServiceError extends Error {
    constructor(message, originalError) {
        super(message);
        this.originalError = null;
        this.originalError = originalError;
    }
}
function getDocumentSetIdsBySearchId(req, searchId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const docmentIds = yield DAO.getDocumentSetIdsBySearchId(req, searchId);
            return docmentIds;
        }
        catch (error) {
            throw new CombinedDocumentSetsServiceError(exports.LOG_MESSAGE_GET_DOCUMENT_SET_IDS_BY_SEARCH_ID_REQUEST_FAIL, error);
        }
    });
}
exports.getDocumentSetIdsBySearchId = getDocumentSetIdsBySearchId;
//# sourceMappingURL=favorites-document-sets.service.js.map
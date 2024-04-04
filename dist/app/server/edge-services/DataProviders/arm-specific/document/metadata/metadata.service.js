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
exports.MetadataService = void 0;
const metadata_dao_1 = require("./metadata.dao");
class MetadataService {
    getMetadata(req, documentId, extendedMetadataFields, includeSearchMetadata = false) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (!includeSearchMetadata) {
                return { extendedMetadata: yield metadata_dao_1.MetadataDao.getExtendedMetadata(req, documentId, extendedMetadataFields) };
            }
            const [extendedMetadata, searchMetadata] = yield Promise.allSettled([
                this.getExtendedMetadata(req, documentId, extendedMetadataFields),
                this.getSearchMetadata(req, documentId),
            ]);
            return {
                extendedMetadata: (_a = extendedMetadata === null || extendedMetadata === void 0 ? void 0 : extendedMetadata['value']) !== null && _a !== void 0 ? _a : extendedMetadata === null || extendedMetadata === void 0 ? void 0 : extendedMetadata['reason'],
                searchMetadata: (_b = searchMetadata === null || searchMetadata === void 0 ? void 0 : searchMetadata['value']) !== null && _b !== void 0 ? _b : searchMetadata === null || searchMetadata === void 0 ? void 0 : searchMetadata['reason'],
            };
        });
    }
    getExtendedMetadata(req, documentId, extendedMetadataFields) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield metadata_dao_1.MetadataDao.getExtendedMetadata(req, documentId, extendedMetadataFields);
        });
    }
    getSearchMetadata(req, documentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield metadata_dao_1.MetadataDao.getSearchMetadata(req, documentId);
        });
    }
}
exports.MetadataService = MetadataService;
//# sourceMappingURL=metadata.service.js.map
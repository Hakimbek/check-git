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
exports.MetadataDao = void 0;
const lodash_1 = require("lodash");
const osa_1 = require("@wk/osa");
const osa_research_1 = require("@wk/osa-research");
const osa_resource_1 = require("@wk/osa-resource");
const constants_1 = require("../../../../config/constants");
const osaService_1 = __importDefault(require("../../../../services/common/osaService"));
const metadata_constants_1 = require("./metadata.constants");
class MetadataDao {
    static getExtendedMetadata(req, documentId, extendedMetadataFields) {
        return __awaiter(this, void 0, void 0, function* () {
            const resourceService = osaService_1.default.createDomainServiceInstance(constants_1.RESOURCE_DOMAIN_NAME, req);
            const extendedMetadataRequest = new osa_resource_1.GetExtendedMetadata({
                documents: [new osa_resource_1.DocumentId({ id: documentId })],
                extendedMetadataFields: extendedMetadataFields,
            });
            return lodash_1.get(yield resourceService.getExtendedMetadata(extendedMetadataRequest), '[0].metadata[0]');
        });
    }
    static getSearchMetadata(req, documentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const researchService = osaService_1.default.createDomainServiceInstance(constants_1.RESEARCH_DOMAIN_NAME, req);
            const searchParams = new osa_research_1.ExecuteSearch({
                query: documentId,
                runtimeOptions: new osa_research_1.SearchRuntimeParams({
                    extendedMetadataFields: metadata_constants_1.SEARCH_METADATA_FIELDS,
                    saveToHistory: false,
                }),
                searchScope: new osa_research_1.SearchScopeParams({
                    includeArchivePubs: true,
                }),
            });
            const oDataParams = new osa_1.common.ODataParams({ $expand: 'Result/Items' });
            return lodash_1.get(yield researchService.executeSearch(searchParams, oDataParams), 'result.items[0].searchMetadata');
        });
    }
}
exports.MetadataDao = MetadataDao;
//# sourceMappingURL=metadata.dao.js.map
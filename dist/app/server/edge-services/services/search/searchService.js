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
const lodash_1 = require("lodash");
const osa_research_1 = require("@wk/osa-research");
const constants_1 = require("../../config/constants");
const osaService_1 = __importDefault(require("../common/osaService"));
// We can add more search options for this service later on an as-needed basis
class SearchService {
    executeSearch(requestData) {
        return __awaiter(this, void 0, void 0, function* () {
            const researchService = osaService_1.default.createDomainServiceInstance(constants_1.RESEARCH_DOMAIN_NAME, requestData);
            const requestSearchParams = requestData.body.searchParams;
            const requestODataParams = requestData.body.oDataParams;
            const searchParams = new osa_research_1.ExecuteSearch({
                query: requestData.body.searchParams.query,
                queryProcessingOptions: this.getQueryProcessingOptions(requestSearchParams.queryProcessingOptions),
                runtimeOptions: this.getRuntimeOptions(requestSearchParams.runtimeOptions),
                searchScope: new osa_research_1.SearchScopeParams(Object.assign({ subscriptionLevel: osa_research_1.SubscriptionLevel.All }, requestSearchParams.searchScope)),
            });
            const oDataParams = Object.assign({ $expand: 'Result/Items' }, requestODataParams);
            return lodash_1.get(yield researchService.executeSearch(searchParams, oDataParams), 'result.items');
        });
    }
    getQueryProcessingOptions(requestQueryProcessingOptions) {
        const querySearchOperators = lodash_1.get(requestQueryProcessingOptions, 'querySearchOperators', []);
        const queryProcessingOptions = new osa_research_1.QueryProcessingParams({
            querySearchOperators: querySearchOperators.map(operatorConfig => new osa_research_1.QuerySearchOperator(operatorConfig)),
        });
        return queryProcessingOptions;
    }
    getRuntimeOptions(requestRuntimeOptions) {
        const extendedMetadataFields = lodash_1.get(requestRuntimeOptions, 'extendedMetadataParams.extendedMetadataFields', []);
        const runtimeOptions = new osa_research_1.SearchRuntimeParams({
            saveToHistory: false,
            sorting: [
                new osa_research_1.Sort({
                    order: osa_research_1.SortField.Date,
                    direction: osa_research_1.SortDirection.Descending,
                }),
            ],
            extendedMetadataParams: new osa_research_1.ExtendedMetadataParams({
                extendedMetadataFields,
            }),
        });
        return runtimeOptions;
    }
}
exports.default = new SearchService();
//# sourceMappingURL=searchService.js.map
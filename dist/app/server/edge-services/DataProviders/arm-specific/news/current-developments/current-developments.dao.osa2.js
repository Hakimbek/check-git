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
exports.getCurrentDevelopmentsDAO = void 0;
const addMonths_1 = __importDefault(require("date-fns/addMonths"));
const pick_1 = __importDefault(require("lodash/pick"));
const osa_research_1 = require("@wk/osa-research");
const osaService_1 = __importDefault(require("../../../../services/common/osaService"));
const ATS_FILTER_TREE_ID__WNC = 'wnc-90-days-ats-filter';
const ATS_FILTER_TREE_ID = ATS_FILTER_TREE_ID__WNC;
function getCurrentDevelopmentsDAO() {
    function getWNCLastThreeMonthsItemsTree(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const researchService = osaService_1.default.createDomainServiceInstance(osa_research_1.domain.name, req);
            const filterTree = new osa_research_1.FilterTree({ id: ATS_FILTER_TREE_ID });
            const treeNodes = yield researchService.requestEntityProperty(filterTree, 'Nodes', {
                $expand: 'Children/Children/Children',
                $filter: 'EntitlementsChecked eq false',
            });
            const result = {
                id: filterTree.id,
                nodes: [],
            };
            function getChildrenNodesDTO(node, maxDepth, depth = 0) {
                return __awaiter(this, void 0, void 0, function* () {
                    const children = yield node.getChildren();
                    const childrenDTO = [];
                    for (const child of children) {
                        childrenDTO.push({
                            id: child.id,
                            title: child.title,
                            children: depth >= maxDepth ? [] : yield getChildrenNodesDTO(child, maxDepth, depth + 1),
                        });
                    }
                    return childrenDTO;
                });
            }
            // const treeNodes = await filterTree.getNodes();
            for (const node of treeNodes) {
                result.nodes.push({
                    id: node.id,
                    title: node.title,
                    children: yield getChildrenNodesDTO(node, 2),
                });
            }
            return result;
        });
    }
    function getWNCLastThreeMonthsItems(req, searchParams, odataParams, fnConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            const researchService = (fnConfig === null || fnConfig === void 0 ? void 0 : fnConfig.osaResearchService) ||
                osaService_1.default.createDomainServiceInstance(osa_research_1.domain.name, req);
            const ARMNewsNodeId = 'csh-da-filter!WKUS-TAL-DOCS-PHC-{3d7b94f0-a12d-309c-99d6-4300ae0a5611}';
            const ARMContentNodeId = 'csh-da-filter!WKUS-TAL-DOCS-PHC-{25c555fd-aa38-2235-cc99-68a30fc21a77}';
            const executeSearchParams = new osa_research_1.ExecuteSearch({
                query: '*',
                searchScope: new osa_research_1.SearchScopeParams({
                    includeArchivePubs: false,
                    includeModelDocuments: false,
                    filterByFieldValueIds: ['wkarmacnewdailydevelopment!armacThreeMonthItem'],
                    contentTreeNodeIds: [...(searchParams.contentTreeNodeIds || [ARMNewsNodeId, ARMContentNodeId])],
                    filterTreeNodeIds: [ATS_FILTER_TREE_ID + '!ATS_Technical_Tree_Node'],
                    filterDateFields: [
                        new osa_research_1.FilterDateField({
                            filterId: 'wkissuedate',
                            dateScope: new osa_research_1.common.DateTimeRestriction({
                                date1: addMonths_1.default(new Date(), -3),
                                dateOperator: osa_research_1.common.DateOperator.After,
                            }),
                        }),
                    ],
                }),
                runtimeOptions: new osa_research_1.SearchRuntimeParams({
                    extendedMetadataParams: new osa_research_1.ExtendedMetadataParams({
                        extendedMetadataFields: [
                            ...(searchParams.metadataFields || [
                                'GA_TOP_CLASS_Taxonomy',
                                'pubvol',
                                'pcicore:isInSection',
                                'title',
                            ]),
                        ],
                    }),
                    saveToHistory: false,
                    sorting: [
                        new osa_research_1.Sort({
                            order: osa_research_1.SortField.Custom,
                            direction: osa_research_1.SortDirection.Descending,
                            customSortField: 'wksortdate',
                        }),
                    ],
                }),
            });
            const results = yield (yield researchService.executeSearch(executeSearchParams, {
                $expand: 'Result/Items',
                $top: odataParams === null || odataParams === void 0 ? void 0 : odataParams.top,
                $skip: odataParams === null || odataParams === void 0 ? void 0 : odataParams.skip,
                headers: odataParams === null || odataParams === void 0 ? void 0 : odataParams.headers,
            })).getResult();
            return (yield results.getItems()).map((item) => {
                var _a, _b;
                const extractedItem = pick_1.default(item, ['title', 'summary', 'id']);
                const taxonomy = item.extendedMetadata.groups.find(groupMetadata => {
                    var _a, _b, _c, _d;
                    return groupMetadata.name === 'Taxonomy' &&
                        ((_b = (_a = groupMetadata.groups) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.name) === 'ATSFilter' &&
                        ((_d = (_c = groupMetadata.groups) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.id) === ATS_FILTER_TREE_ID;
                });
                const title = ((_b = (_a = item.extendedMetadata) === null || _a === void 0 ? void 0 : _a.objects.find(objMetadata => objMetadata.name === 'title' &&
                    !!objMetadata.attributes.find(attr => attr.key === 'type' && attr.value === 'standard'))) === null || _b === void 0 ? void 0 : _b.value) || extractedItem.title;
                extractedItem.title = title;
                extractedItem.taxonomy = taxonomy;
                extractedItem.id = item.documentId;
                return extractedItem;
            });
        });
    }
    function getWNCHiddenOsaResearchService(req) {
        const defaultOsaUrl = osaService_1.default.getOsaUrl();
        // this request uses special, hidden for client side, osa service
        osaService_1.default.setOsaUrl('/wnc/osa/@@OSA-DOMAIN-NAME@@');
        const osaResearchService = osaService_1.default.createDomainServiceInstance(osa_research_1.domain.name, req);
        osaService_1.default.setOsaUrl(defaultOsaUrl);
        return osaResearchService;
    }
    function getWNCLastThreeMonthsItemsOutsideSubscription(req, searchParams, odataParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const osaResearchService = getWNCHiddenOsaResearchService(req);
            const availableDocs = yield getWNCLastThreeMonthsItems(req, searchParams, Object.assign(Object.assign({}, odataParams), { headers: { Authorization: 'freemium wnc' } }), { osaResearchService });
            return [...availableDocs];
        });
    }
    return {
        getWNCLastThreeMonthsItemsTree,
        getWNCLastThreeMonthsItems,
        getWNCLastThreeMonthsItemsOutsideSubscription,
    };
}
exports.getCurrentDevelopmentsDAO = getCurrentDevelopmentsDAO;
//# sourceMappingURL=current-developments.dao.osa2.js.map
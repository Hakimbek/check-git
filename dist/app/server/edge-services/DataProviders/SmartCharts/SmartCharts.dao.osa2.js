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
exports.getAvailableTaxTypesIds = exports.getAvailableJurisdictions = exports.getInternationalJurisdictions = exports.getTopicTree = exports.searchForTopic = void 0;
const fill_1 = __importDefault(require("lodash/fill"));
const get_1 = __importDefault(require("lodash/get"));
const edge_services_1 = require("@wk/acm-osa-service/edge-services");
const permissions_service_1 = require("@wk/acm-permissions/shared/src/permissions/permissions.service");
const osa_1 = require("@wk/osa");
const osa_research_1 = require("@wk/osa-research");
const osa_resource_1 = require("@wk/osa-resource");
const SmartChartsTopic_1 = require("./SmartChartsTopic");
const constants_1 = require("../../config/constants");
const osaService_1 = __importDefault(require("../../services/common/osaService"));
const edgeServices_constants_1 = require("../../edgeServices.constants");
const SmartCharts_constants_1 = require("./SmartCharts.constants");
const expandForJurisdictionsTree = 'Result/Trees/Nodes/' + fill_1.default(new Array(SmartCharts_constants_1.JURISDICTIONS_ATS_TREE_CONFIG.filterTreeLevels), 'Children').join('/');
const expandForTopicTree = 'Result/Trees/Nodes/' + fill_1.default(new Array(SmartCharts_constants_1.SMART_CHARTS_TOPICS_ATS_TREE_CONFIG.filterTreeLevels), 'Children').join('/');
function searchForTopic(req, query, states) {
    return __awaiter(this, void 0, void 0, function* () {
        const jurisdictionFilter = createFilterFromStates(states);
        const searchParams = new osa_research_1.ExecuteSearch({
            query,
            runtimeOptions: new osa_research_1.SearchRuntimeParams({
                filterTrees: [
                    new osa_research_1.FilterTreeParams({
                        filterTreeId: SmartCharts_constants_1.SMART_CHARTS_TOPICS_ATS_TREE_CONFIG.filterTreeId,
                        filterTreeLevels: SmartCharts_constants_1.SMART_CHARTS_TOPICS_ATS_TREE_CONFIG.filterTreeLevels,
                    }),
                ],
                saveToHistory: false,
            }),
            searchScope: new osa_research_1.SearchScopeParams({
                contentTreeNodeIds: [SmartCharts_constants_1.SMART_CHARTS_AC_NODE_ID],
                filterTreeNodeIds: jurisdictionFilter,
                excludedContentTreeNodeIds: [SmartCharts_constants_1.ARM_NEWS_NODE_ID, SmartCharts_constants_1.ARM_CONTENT_NODE_ID],
            }),
            queryProcessingOptions: new osa_research_1.QueryProcessingParams({
                querySearchOperators: [
                    new osa_research_1.QuerySearchOperator({
                        operatorKeyword: 'dt',
                        filterFieldId: 'title',
                    }),
                ],
                useThesaurusDictionary: true,
            }),
        });
        const researchService = osaService_1.default.createDomainServiceInstance(constants_1.RESEARCH_DOMAIN_NAME, req);
        const executeSearch = yield researchService.executeSearch(searchParams, new osa_1.common.ODataParams({ $expand: expandForTopicTree }));
        const result = yield executeSearch.getResult();
        const tree = yield result.getTrees();
        const nodes = yield tree[0].getNodes();
        return constructTree(nodes[0] || tree[0]);
    });
}
exports.searchForTopic = searchForTopic;
function getTopicTree(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const researchService = osaService_1.default.createDomainServiceInstance(constants_1.RESEARCH_DOMAIN_NAME, req);
        const smartChartsATSTree = researchService.attachEntity(new osa_research_1.FilterTree(SmartCharts_constants_1.SMART_CHARTS_TOPICS_ATS_TREE_CONFIG.filterTreeId));
        const fullTree = yield smartChartsATSTree.requestNodes(new osa_1.common.ODataParams({
            $expand: new Array(SmartCharts_constants_1.SMART_CHARTS_TOPICS_ATS_TREE_CONFIG.filterTreeLevels).fill('Children').join('/'),
            $filter: 'EntitlementsChecked eq false',
        }));
        return constructTree(fullTree[0]);
    });
}
exports.getTopicTree = getTopicTree;
function getInternationalJurisdictions(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const searchParams = new osa_research_1.ExecuteSearch({
            query: '*',
            runtimeOptions: new osa_research_1.SearchRuntimeParams({
                filterTrees: [
                    new osa_research_1.FilterTreeParams({
                        filterTreeId: SmartCharts_constants_1.JURISDICTIONS_ATS_TREE_CONFIG.filterTreeId,
                        filterTreeLevels: SmartCharts_constants_1.JURISDICTIONS_ATS_TREE_CONFIG.filterTreeLevels,
                        startFilterTreeNodeId: SmartCharts_constants_1.JURISDICTION_STATE_ID,
                    }),
                ],
                saveToHistory: false,
            }),
            searchScope: new osa_research_1.SearchScopeParams({
                contentTreeNodeIds: [SmartCharts_constants_1.SMART_CHARTS_AC_NODE_ID],
                excludedContentTreeNodeIds: [SmartCharts_constants_1.ARM_NEWS_NODE_ID, SmartCharts_constants_1.ARM_CONTENT_NODE_ID],
            }),
        });
        if (req['isFreemium']) {
            searchParams.searchScope.subscriptionLevel = osa_research_1.SubscriptionLevel.All;
        }
        const researchService = osaService_1.default.createDomainServiceInstance(constants_1.RESEARCH_DOMAIN_NAME, req);
        const executeSearch = yield researchService.executeSearch(searchParams, new osa_1.common.ODataParams({ $expand: expandForJurisdictionsTree }));
        return get_1.default(executeSearch, SmartCharts_constants_1.INTERNATIONAL_JURISDICTIONS_PATH, []);
    });
}
exports.getInternationalJurisdictions = getInternationalJurisdictions;
function getAvailableJurisdictions(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const availableJurisdictions = [];
        const moduleIds = Object.values(SmartCharts_constants_1.SMART_CHARTS_STATES_RIGHTS).map((moduleId) => new osa_resource_1.ContentModuleId({ id: moduleId }));
        const resourceService = osaService_1.default.createDomainServiceInstance(constants_1.RESOURCE_DOMAIN_NAME, req);
        const { authorizedModuleIds } = yield resourceService.getContentAuthorization(new osa_resource_1.GetContentAuthorization({
            moduleIds,
            ModuleTypeValue: osa_resource_1.ModuleType.Searchable,
        }));
        authorizedModuleIds.forEach(({ id }) => {
            const permittedJurisdiction = Object.keys(SmartCharts_constants_1.SMART_CHARTS_STATES_RIGHTS).find((key) => SmartCharts_constants_1.SMART_CHARTS_STATES_RIGHTS[key] === id);
            if (permittedJurisdiction) {
                availableJurisdictions.push(permittedJurisdiction);
            }
        });
        return availableJurisdictions;
    });
}
exports.getAvailableJurisdictions = getAvailableJurisdictions;
function getAvailableTaxTypesIds(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const availableTaxTypesIds = [];
        const permissionsEdgeService = edge_services_1.edgeServiceFactory.createEdgeServiceInstance(req, permissions_service_1.PermissionsService);
        const { moduleIds } = yield permissionsEdgeService.getPermissions({
            moduleIds: Object.values(SmartCharts_constants_1.SMART_CHARTS_TAX_TYPE_RIGHT),
        });
        moduleIds.forEach(({ id }) => {
            const permittedTaxTypesId = SmartCharts_constants_1.SMART_CHARTS_DES_MODULE_TAX_TYPE_MAPPING[id];
            if (permittedTaxTypesId) {
                availableTaxTypesIds.push(permittedTaxTypesId);
            }
        });
        return availableTaxTypesIds;
    });
}
exports.getAvailableTaxTypesIds = getAvailableTaxTypesIds;
function constructTree(node) {
    const children = node['children'];
    const path = node['path'];
    const rootTopic = new SmartChartsTopic_1.SmartChartsTopic(node);
    rootTopic.path = path;
    rootTopic.pathTitles = rootTopic.getPathTitles();
    if (!children) {
        return rootTopic;
    }
    for (const child of children) {
        const topic = new SmartChartsTopic_1.SmartChartsTopic(child, rootTopic);
        const path = child['path'];
        rootTopic.children.push(topic);
        topic.path = path;
        topic.pathTitles = topic.getPathTitles();
        buildSubTree(topic, child);
    }
    function buildSubTree(topic, node) {
        const children = node['children'];
        for (const child of children) {
            const childTopic = new SmartChartsTopic_1.SmartChartsTopic(child, topic);
            const path = child['path'];
            topic.children.push(childTopic);
            topic.path = path;
            topic.pathTitles = topic.getPathTitles();
            if (child.children.length) {
                buildSubTree(childTopic, child);
            }
            else {
                childTopic.pathTitles = childTopic.getPathTitles();
            }
        }
    }
    return rootTopic;
}
function createFilterFromStates(states) {
    const query = [];
    let jurisdiction = '';
    states.forEach(state => {
        jurisdiction = '';
        if (edgeServices_constants_1.STATE_ALIASES[state.toUpperCase()]) {
            jurisdiction = state.toUpperCase();
        }
        else {
            jurisdiction = getLabel(state);
        }
        jurisdiction && query.push(SmartCharts_constants_1.JURISDICTION_SINGLE_STATE_FILTER_ID + jurisdiction);
    });
    return query;
}
function getLabel(state) {
    let label = null;
    if (state) {
        Object.entries(edgeServices_constants_1.STATE_ALIASES).forEach(([stateCode, stateName]) => {
            if (state.toLowerCase() === stateName.toLowerCase()) {
                label = stateCode;
            }
        });
    }
    return label;
}
//# sourceMappingURL=SmartCharts.dao.osa2.js.map
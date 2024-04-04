const research = require('@wk/osa-research');
const { compact } = require('lodash');
const ProtectedApiOperation = require('./../../../definitions/operations/ProtectedOperation');
const Endpoint = require('./../../../definitions/common/Endpoint');
const redirectUrlModifier = require('./../RedirectUrl');
const {
    wkVars,
    osa: osaService,
    appConfig: { SHORTIFY_DOMAIN_NAME, RESEARCH_DOMAIN_NAME },
} = require('../../../ApiModuleDependencies');

const ERROR_MESSAGE_NO_ACCESS = 'User doesnt have access to on-platform smartcharts';

const SMARTCHARTS_ERROR_TYPES = {
    SHORTIFY_KEY_ERROR: 1, // cannot parse shortify key
};

const offplatformSmartchartsUrl = wkVars.vars('offplatformSmartchartsLink');
const SINGLE_JURISDICTION_PRODUCT_CODE_PREFIX = 'SING';
const ALL_JURISDICTIONS_PRODUCT_CODE = 'MSALL';
const ALL_JURISDICTIONS_STATE_CODE = 'all';
const SMARTCHARTS_TOPICS_FILTERS_IDS = {
    business: ['msall_ATS_9', 'msall_ATS_10', 'msall_ATS_11', 'msall_ATS_12'],
    personal: ['msall_ATS_2'],
    property: ['msall_ATS_4', 'msall_ATS_5'],
    sales: ['msall_ATS_5', 'msall_ATS_8'],
    state: [
        'msall_ATS_2',
        'msall_ATS_4',
        'msall_ATS_5',
        'msall_ATS_6',
        'msall_ATS_8',
        'msall_ATS_9',
        'msall_ATS_10',
        'msall_ATS_11',
        'msall_ATS_12',
    ],
};

class ResolveSmartchartsError extends Error {
    constructor(message, redirectUrl) {
        super(message);

        this.redirectUrl = redirectUrl;
    }
}

const jurisdictionFilterTreeIdPrefix = wkVars.vars('jurisdictionSingleStateFilterId');
const smartchartsTopicsFilterTreeIdPrefix = wkVars.vars('smartchartsTopicsATSTreeConfig').filterTreeIdPrefix;
const smartchartsCSHNodeId = wkVars.vars('smartchartsAnswersContentNodeId');

class ResolveSmartchartsApiOperation extends ProtectedApiOperation {
    constructor() {
        super();
        this.endpoints.push(
            new Endpoint('get', '/resolveSmartcharts', ['topic', 'type', 'configKey'], { checkingMethod: 'OR' })
        );
    }

    async performTask(req, res) {
        await super.performTask(req, res);

        if (req.query.configKey && (req.query.type || req.query.topic)) {
            throw new Error('This operation supports only one of required parameters in the same time.');
        }

        if (req.query.configKey) {
            await this.processShortifyConfigKey(req, res);
        } else {
            // normal flow
            const redirectUrl = redirectUrlModifier.getRedirectUrlFromResponse(res);
            const jurisdiction =
                (req.query.jurisdiction || '').toLowerCase() === ALL_JURISDICTIONS_STATE_CODE
                    ? ALL_JURISDICTIONS_STATE_CODE
                    : (req.query.jurisdiction || '').toUpperCase() || ALL_JURISDICTIONS_STATE_CODE;
            // this pretty cool Zero (0) here because our UI-route needs the number here
            const topic = req.query.topic || '0';
            const smartchartType = (req.query.type || '').toLowerCase();

            redirectUrl.pathname = '/smartcharts';

            if (smartchartType) {
                redirectUrl.query = {
                    multistate: smartchartType,
                };
            }

            redirectUrl.query.states = jurisdiction;
            redirectUrl.query.topics = topic;

            redirectUrlModifier.setRedirectUrlToResponse(res, redirectUrl);
        }
    }

    async checkPermissions(req) {
        const jurisdictionCode =
            (req.query.jurisdiction || '').toLowerCase() === ALL_JURISDICTIONS_STATE_CODE
                ? ''
                : (req.query.jurisdiction || '').toUpperCase();
        const topicQuery = req.query.topic;
        const topicCode = topicQuery && topicQuery.split('.')[0];
        const smartchartType = (req.query.type || '').toLowerCase();
        const isTopicAvailable =
            !req.query.type ||
            (topicQuery && SMARTCHARTS_TOPICS_FILTERS_IDS[smartchartType].includes(`msall_ATS_${topicCode}`));
        const topicsIds = topicQuery
            ? [`msall_ATS_${topicQuery}`]
            : compact(SMARTCHARTS_TOPICS_FILTERS_IDS[smartchartType]);

        if (!smartchartType && !topicQuery) {
            // Do not make additional checking by Jurisdictions and Topcis in case of using configKey
            return !!req.query.configKey;
        }

        if (topicQuery && !isTopicAvailable) {
            throw new ResolveSmartchartsError(
                ERROR_MESSAGE_NO_ACCESS,
                this.getOffplatformSmartchartsUrl(jurisdictionCode)
            );
        }

        if (!topicsIds.length) {
            throw new ResolveSmartchartsError(
                ERROR_MESSAGE_NO_ACCESS,
                this.getOffplatformSmartchartsUrl(jurisdictionCode)
            );
        }

        let itemsCount = 0;

        try {
            itemsCount = await this.getSmartchartsTotalHits(req, compact([jurisdictionCode]), topicsIds);
        } catch (error) {
            throw new ResolveSmartchartsError(
                ERROR_MESSAGE_NO_ACCESS,
                this.getOffplatformSmartchartsUrl(jurisdictionCode)
            );
        }

        if (itemsCount === 0) {
            throw new ResolveSmartchartsError(
                ERROR_MESSAGE_NO_ACCESS,
                this.getOffplatformSmartchartsUrl(jurisdictionCode)
            );
        }

        return true;
    }

    // getting config from shortify key
    async processShortifyConfigKey(req, res) {
        let smartchartsType = 'state';
        let statesCodes;
        let topicsCodes;
        let errorType = 0;
        const redirectUrl = redirectUrlModifier.getRedirectUrlFromResponse(res);
        try {
            const resolvedConfigKey = await osaService
                .createDomainServiceInstance(SHORTIFY_DOMAIN_NAME, req)
                .resolve({ key: req.query.configKey });
            const { jurisdictions, topics: selectedTopics, type } = JSON.parse(resolvedConfigKey);
            smartchartsType = type;
            statesCodes = jurisdictions;
            topicsCodes = selectedTopics;
        } catch (error) {
            errorType = SMARTCHARTS_ERROR_TYPES.SHORTIFY_KEY_ERROR;
        }

        if (!(await this.areFiltersComplyWithATS(req, compact(statesCodes), compact(topicsCodes)))) {
            errorType = SMARTCHARTS_ERROR_TYPES.SHORTIFY_KEY_ERROR;

            if (!(await this.areSmartchartsAvailable(req))) {
                throw new ResolveSmartchartsError(ERROR_MESSAGE_NO_ACCESS, this.getOffplatformSmartchartsUrl());
            }
        } else {
            try {
                const totalHits = await this.getSmartchartsTotalHits(
                    req,
                    compact(statesCodes),
                    compact(topicsCodes).map(topicId => `msall_ATS_${topicId}`)
                );

                if (!totalHits) {
                    throw new Error('No items found');
                }
            } catch (error) {
                // preselect jurisdiction if only one state is in config
                const jurisdictionCode = statesCodes && statesCodes.length === 1 ? statesCodes[0] : undefined;

                throw new ResolveSmartchartsError(
                    ERROR_MESSAGE_NO_ACCESS,
                    this.getOffplatformSmartchartsUrl(jurisdictionCode)
                );
            }
        }

        redirectUrl.pathname = '/smartcharts';
        redirectUrl.query = {
            multistate: smartchartsType,
        };

        if (errorType) {
            redirectUrl.query.error = errorType;
        } else {
            redirectUrl.query.topics = topicsCodes;
            redirectUrl.query.states = statesCodes;
        }

        redirectUrlModifier.setRedirectUrlToResponse(res, redirectUrl);
    }

    async getSmartchartsTotalHits(req, jurisdictions, topics) {
        const jurisdictionsFilterTreeNodeIds = jurisdictions
            ? jurisdictions.map(jurisdictionCode => `${jurisdictionFilterTreeIdPrefix}${jurisdictionCode}`)
            : [];

        const topicsFilterTreeNodeIds = topics
            ? topics.map(topic => `${smartchartsTopicsFilterTreeIdPrefix}${topic}`)
            : [];

        const searchParams = new research.ExecuteSearch({
            query: '*',
            searchScope: new research.SearchScopeParams({
                contentTreeNodeIds: [smartchartsCSHNodeId],
                filterTreeNodeIds: compact([...jurisdictionsFilterTreeNodeIds, ...topicsFilterTreeNodeIds]),
            }),
            runtimeOptions: new research.SearchRuntimeParams({
                saveToHistory: false,
            }),
        });

        const researchService = osaService.createDomainServiceInstance(RESEARCH_DOMAIN_NAME, req);

        return (await (await researchService.executeSearch(searchParams, { $expand: 'Result' })).getResult()).totalHits;
    }

    getOffplatformSmartchartsUrl(jurisdictionCode) {
        const productCode = jurisdictionCode
            ? `${SINGLE_JURISDICTION_PRODUCT_CODE_PREFIX}${jurisdictionCode}`
            : ALL_JURISDICTIONS_PRODUCT_CODE;

        return `${offplatformSmartchartsUrl}?Product=${productCode}`;
    }

    async areSmartchartsAvailable(req) {
        return (await this.getSmartchartsTotalHits(req)) > 0;
    }

    async areFiltersComplyWithATS(req, statesCodes, topicsCodes) {
        // request to get Filter trees for States and Topics
        const topicsFilterTree = new research.FilterTree({ id: 'ac-smtopics-ats-filter' });
        const statesFilterTree = new research.FilterTree({ id: 'ac-jurisdictions-ats-filter' });
        // filterToGetAllNodes allows to get nodes regardless subscription
        const filterToGetAllNodes = 'EntitlementsChecked eq false';
        const ATS_FILTER_TREE_NODE_ID__STATES = 'ac-jurisdictions-ats-filter!ATS_US-STATES';

        const researchService = osaService.createDomainServiceInstance(RESEARCH_DOMAIN_NAME, req);

        const topicsTreePromise = researchService.requestEntityProperty(topicsFilterTree, 'Nodes', {
            $expand: 'Children/Children/Children/Children/Children',
            $filter: filterToGetAllNodes,
        });

        const statesTreePromise = researchService.requestEntityProperty(statesFilterTree, 'Nodes', {
            $expand: 'Children/Children',
            $filter: filterToGetAllNodes,
        });

        const trees = await Promise.all([topicsTreePromise, statesTreePromise]);

        // traverse trees to check that ALL statesCodes and topicsCodes exist
        // in Filter trees (ATS)
        const [[topicsTreeNode], [jurisdictionsTreeNode]] = trees;

        const findInTree = (subRootNode, itemId) => {
            if (!subRootNode) {
                return null;
            }

            if (subRootNode.id === itemId) {
                return subRootNode;
            }

            if (subRootNode.children.length > 0) {
                return subRootNode.children.reduce(function (targetNode, node) {
                    if (targetNode) {
                        return targetNode;
                    }

                    return findInTree(node, itemId);
                }, null);
            }

            return null;
        };

        // reduce size of tree to traverse, choosing only states
        const statesTreeNode = jurisdictionsTreeNode.children.find(node => node.id === ATS_FILTER_TREE_NODE_ID__STATES);

        const areStatesConsistent = statesCodes.every(stateCode =>
            findInTree(statesTreeNode, `${jurisdictionFilterTreeIdPrefix}${stateCode}`)
        );

        if (!areStatesConsistent) {
            return false;
        }

        const areTopicsConsistent = topicsCodes.every(topicCode =>
            findInTree(topicsTreeNode, `${smartchartsTopicsFilterTreeIdPrefix}msall_ATS_${topicCode}`)
        );

        return areTopicsConsistent;
    }
}

module.exports = ResolveSmartchartsApiOperation;

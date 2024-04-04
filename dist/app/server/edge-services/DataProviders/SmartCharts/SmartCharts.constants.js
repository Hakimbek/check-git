"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALL_SMART_CHART_STATES = exports.SMART_CHARTS_TYPES = exports.SMART_CHARTS_DES_MODULE_TAX_TYPE_MAPPING = exports.SMART_CHARTS_TAX_TYPE_RIGHT = exports.SMART_CHARTS_STATES_RIGHTS = exports.SMART_CHARTS_HIDDEN_STATE_IDS = exports.ARM_CONTENT_NODE_ID = exports.ARM_NEWS_NODE_ID = exports.SMART_CHARTS_AC_NODE_ID = exports.JURISDICTION_STATE_ID = exports.JURISDICTION_SINGLE_STATE_FILTER_ID = exports.INTERNATIONAL_JURISDICTIONS_PATH = exports.JURISDICTIONS_ATS_TREE_CONFIG = exports.SMART_CHARTS_TOPICS_ATS_TREE_CONFIG = exports.SMART_CHARTS_STATE_MAPPING = exports.SMART_CHARTS_DICTIONARIES = void 0;
exports.SMART_CHARTS_DICTIONARIES = {
    statesId: 'WKUS-TAA-AC-SC-Jurisdictions-URI',
    topicsId: 'WKUS-TAA-AC-SmartCharts-Concepts',
    matchMethod: 'PartialMatch',
    language: 'en',
};
exports.SMART_CHARTS_STATE_MAPPING = {
    code: {
        NYC: 'NY',
    },
    name: {
        'New York City': 'New York',
    },
};
exports.SMART_CHARTS_TOPICS_ATS_TREE_CONFIG = {
    filterTreeIdPrefix: 'ac-smtopics-ats-filter!ATS_',
    filterTreeId: 'ac-smtopics-ats-filter',
    filterTreeLevels: 6,
};
exports.JURISDICTIONS_ATS_TREE_CONFIG = {
    filterTreeId: 'ac-jurisdictions-ats-filter',
    filterTreeLevels: 3,
};
exports.INTERNATIONAL_JURISDICTIONS_PATH = 'result.trees[0].nodes[0].children';
exports.JURISDICTION_SINGLE_STATE_FILTER_ID = 'ac-jurisdictions-ats-filter!ATS_US-';
exports.JURISDICTION_STATE_ID = 'ac-jurisdictions-ats-filter!ATS_US-STATES';
exports.SMART_CHARTS_AC_NODE_ID = 'csh-da-filter!WKUS-TAL-DOCS-PHC-{46432fe7-f14e-3663-97b9-fb9cfb918985}';
exports.ARM_NEWS_NODE_ID = 'csh-da-filter!WKUS-TAL-DOCS-PHC-{3d7b94f0-a12d-309c-99d6-4300ae0a5611}';
exports.ARM_CONTENT_NODE_ID = 'csh-da-filter!WKUS-TAL-DOCS-PHC-{25c555fd-aa38-2235-cc99-68a30fc21a77}';
exports.SMART_CHARTS_HIDDEN_STATE_IDS = ['MULTISTATE', 'AS', 'GU', 'MU', 'PR', 'NYC', 'VI'];
exports.SMART_CHARTS_STATES_RIGHTS = {
    'Alabama': 'WKUS_TAL_16582',
    'Alaska': 'WKUS_TAL_16583',
    'Arizona': 'WKUS_TAL_16584',
    'Arkansas': 'WKUS_TAL_16585',
    'California': 'WKUS_TAL_16586',
    'Colorado': 'WKUS_TAL_16587',
    'Connecticut': 'WKUS_TAL_16588',
    'Delaware': 'WKUS_TAL_16589',
    'District of Columbia': 'WKUS_TAL_16590',
    'Florida': 'WKUS_TAL_16591',
    'Georgia': 'WKUS_TAL_16592',
    'Hawaii': 'WKUS_TAL_16593',
    'Idaho': 'WKUS_TAL_16594',
    'Illinois': 'WKUS_TAL_16595',
    'Indiana': 'WKUS_TAL_16596',
    'Iowa': 'WKUS_TAL_16597',
    'Kansas': 'WKUS_TAL_16598',
    'Kentucky': 'WKUS_TAL_16599',
    'Louisiana': 'WKUS_TAL_16600',
    'Maine': 'WKUS_TAL_16601',
    'Maryland': 'WKUS_TAL_16602',
    'Massachusetts': 'WKUS_TAL_16603',
    'Michigan': 'WKUS_TAL_16604',
    'Minnesota': 'WKUS_TAL_16605',
    'Mississippi': 'WKUS_TAL_16606',
    'Missouri': 'WKUS_TAL_16607',
    'Montana': 'WKUS_TAL_16608',
    'Nebraska': 'WKUS_TAL_16609',
    'Nevada': 'WKUS_TAL_16610',
    'New Hampshire': 'WKUS_TAL_16611',
    'New Jersey': 'WKUS_TAL_16612',
    'New Mexico': 'WKUS_TAL_16613',
    'New York': 'WKUS_TAL_16614',
    'North Carolina': 'WKUS_TAL_16615',
    'North Dakota': 'WKUS_TAL_16616',
    'Ohio': 'WKUS_TAL_16617',
    'Oklahoma': 'WKUS_TAL_16618',
    'Oregon': 'WKUS_TAL_16619',
    'Pennsylvania': 'WKUS_TAL_16620',
    'Rhode Island': 'WKUS_TAL_16621',
    'South Carolina': 'WKUS_TAL_16622',
    'South Dakota': 'WKUS_TAL_16623',
    'Tennessee': 'WKUS_TAL_16624',
    'Texas': 'WKUS_TAL_16625',
    'Utah': 'WKUS_TAL_16626',
    'Vermont': 'WKUS_TAL_16627',
    'Virginia': 'WKUS_TAL_16628',
    'Washington': 'WKUS_TAL_16629',
    'West Virginia': 'WKUS_TAL_16630',
    'Wisconsin': 'WKUS_TAL_16631',
    'Wyoming': 'WKUS_TAL_16632',
};
exports.SMART_CHARTS_TAX_TYPE_RIGHT = {
    'Business Income Tax': 'WKUS_TAL_16633',
    'Franchise Tax': 'WKUS_TAL_16634',
    'Income Tax E-Filing': 'WKUS_TAL_16635',
    'Income Tax Electronic Funds Transfer (EFT)': 'WKUS_TAL_16636',
    'Other Taxes': 'WKUS_TAL_16637',
    'Personal Income Tax': 'WKUS_TAL_16638',
    'Property Tax': 'WKUS_TAL_16639',
    'Sales and Use Taxes': 'WKUS_TAL_16640',
    'Unclaimed Property': 'WKUS_TAL_16641',
};
exports.SMART_CHARTS_DES_MODULE_TAX_TYPE_MAPPING = {
    WKUS_TAL_16633: 'msall_ATS_9',
    WKUS_TAL_16634: 'msall_ATS_12',
    WKUS_TAL_16635: 'msall_ATS_11',
    WKUS_TAL_16636: 'msall_ATS_10',
    WKUS_TAL_16637: 'msall_ATS_6',
    WKUS_TAL_16638: 'msall_ATS_2',
    WKUS_TAL_16639: 'msall_ATS_4',
    WKUS_TAL_16640: 'msall_ATS_8',
    WKUS_TAL_16641: 'msall_ATS_5',
};
exports.SMART_CHARTS_TYPES = {
    sales: {
        title: 'CCH® Multistate Sales Tax SmartCharts',
        name: 'Sales Tax',
        topLevelTaxTypes: ['msall_ATS_8', 'msall_ATS_5'],
        multistate: true,
    },
    business: {
        title: 'CCH® Multistate Business Income Tax SmartCharts',
        name: 'Business Income Tax',
        topLevelTaxTypes: ['msall_ATS_9', 'msall_ATS_12', 'msall_ATS_11', 'msall_ATS_10'],
        multistate: true,
    },
    personal: {
        title: 'CCH® Multistate Personal Income Tax SmartCharts',
        name: 'Personal Income Tax',
        topLevelTaxTypes: ['msall_ATS_2'],
        multistate: true,
    },
    property: {
        title: 'CCH® Multistate Property Tax SmartCharts',
        name: 'Property Tax',
        topLevelTaxTypes: ['msall_ATS_4', 'msall_ATS_5'],
        multistate: true,
    },
    state: {
        title: 'CCH® State Tax SmartCharts',
        name: 'State Tax',
        topLevelTaxTypes: [],
        multistate: false,
    },
};
exports.ALL_SMART_CHART_STATES = [
    {
        code: 'AL',
        name: 'Alabama',
        id: `${exports.JURISDICTION_SINGLE_STATE_FILTER_ID}AL`,
    },
    {
        code: 'AK',
        name: 'Alaska',
        id: `${exports.JURISDICTION_SINGLE_STATE_FILTER_ID}AK`,
    },
    {
        code: 'AZ',
        name: 'Arizona',
        id: `${exports.JURISDICTION_SINGLE_STATE_FILTER_ID}AZ`,
    },
    {
        code: 'AR',
        name: 'Arkansas',
        id: `${exports.JURISDICTION_SINGLE_STATE_FILTER_ID}AR`,
    },
    {
        code: 'CA',
        name: 'California',
        id: `${exports.JURISDICTION_SINGLE_STATE_FILTER_ID}CA`,
    },
    {
        code: 'CO',
        name: 'Colorado',
        id: `${exports.JURISDICTION_SINGLE_STATE_FILTER_ID}CO`,
    },
    {
        code: 'CT',
        name: 'Connecticut',
        id: `${exports.JURISDICTION_SINGLE_STATE_FILTER_ID}CT`,
    },
    {
        code: 'DE',
        name: 'Delaware',
        id: `${exports.JURISDICTION_SINGLE_STATE_FILTER_ID}DE`,
    },
    {
        code: 'DC',
        name: 'District of Columbia',
        id: `${exports.JURISDICTION_SINGLE_STATE_FILTER_ID}DC`,
    },
    {
        code: 'FL',
        name: 'Florida',
        id: `${exports.JURISDICTION_SINGLE_STATE_FILTER_ID}FL`,
    },
    {
        code: 'GA',
        name: 'Georgia',
        id: `${exports.JURISDICTION_SINGLE_STATE_FILTER_ID}GA`,
    },
    {
        code: 'HI',
        name: 'Hawaii',
        id: `${exports.JURISDICTION_SINGLE_STATE_FILTER_ID}HI`,
    },
    {
        code: 'ID',
        name: 'Idaho',
        id: `${exports.JURISDICTION_SINGLE_STATE_FILTER_ID}ID`,
    },
    {
        code: 'IL',
        name: 'Illinois',
        id: `${exports.JURISDICTION_SINGLE_STATE_FILTER_ID}IL`,
    },
    {
        code: 'IN',
        name: 'Indiana',
        id: `${exports.JURISDICTION_SINGLE_STATE_FILTER_ID}IN`,
    },
    {
        code: 'IA',
        name: 'Iowa',
        id: `${exports.JURISDICTION_SINGLE_STATE_FILTER_ID}IA`,
    },
    {
        code: 'KS',
        name: 'Kansas',
        id: `${exports.JURISDICTION_SINGLE_STATE_FILTER_ID}KS`,
    },
    {
        code: 'KY',
        name: 'Kentucky',
        id: `${exports.JURISDICTION_SINGLE_STATE_FILTER_ID}KY`,
    },
    {
        code: 'LA',
        name: 'Louisiana',
        id: `${exports.JURISDICTION_SINGLE_STATE_FILTER_ID}LA`,
    },
    {
        code: 'ME',
        name: 'Maine',
        id: `${exports.JURISDICTION_SINGLE_STATE_FILTER_ID}ME`,
    },
    {
        code: 'MD',
        name: 'Maryland',
        id: `${exports.JURISDICTION_SINGLE_STATE_FILTER_ID}MD`,
    },
    {
        code: 'MA',
        name: 'Massachusetts',
        id: `${exports.JURISDICTION_SINGLE_STATE_FILTER_ID}MA`,
    },
    {
        code: 'MI',
        name: 'Michigan',
        id: `${exports.JURISDICTION_SINGLE_STATE_FILTER_ID}MI`,
    },
    {
        code: 'MN',
        name: 'Minnesota',
        id: `${exports.JURISDICTION_SINGLE_STATE_FILTER_ID}MN`,
    },
    {
        code: 'MS',
        name: 'Mississippi',
        id: `${exports.JURISDICTION_SINGLE_STATE_FILTER_ID}MS`,
    },
    {
        code: 'MO',
        name: 'Missouri',
        id: `${exports.JURISDICTION_SINGLE_STATE_FILTER_ID}MO`,
    },
    {
        code: 'MT',
        name: 'Montana',
        id: `${exports.JURISDICTION_SINGLE_STATE_FILTER_ID}MT`,
    },
    {
        code: 'NE',
        name: 'Nebraska',
        id: `${exports.JURISDICTION_SINGLE_STATE_FILTER_ID}NE`,
    },
    {
        code: 'NV',
        name: 'Nevada',
        id: `${exports.JURISDICTION_SINGLE_STATE_FILTER_ID}NV`,
    },
    {
        code: 'NH',
        name: 'New Hampshire',
        id: `${exports.JURISDICTION_SINGLE_STATE_FILTER_ID}NH`,
    },
    {
        code: 'NJ',
        name: 'New Jersey',
        id: `${exports.JURISDICTION_SINGLE_STATE_FILTER_ID}NJ`,
    },
    {
        code: 'NM',
        name: 'New Mexico',
        id: `${exports.JURISDICTION_SINGLE_STATE_FILTER_ID}NM`,
    },
    {
        code: 'NY',
        name: 'New York',
        id: `${exports.JURISDICTION_SINGLE_STATE_FILTER_ID}NY`,
    },
    {
        code: 'NC',
        name: 'North Carolina',
        id: `${exports.JURISDICTION_SINGLE_STATE_FILTER_ID}NC`,
    },
    {
        code: 'ND',
        name: 'North Dakota',
        id: `${exports.JURISDICTION_SINGLE_STATE_FILTER_ID}ND`,
    },
    {
        code: 'OH',
        name: 'Ohio',
        id: `${exports.JURISDICTION_SINGLE_STATE_FILTER_ID}OH`,
    },
    {
        code: 'OK',
        name: 'Oklahoma',
        id: `${exports.JURISDICTION_SINGLE_STATE_FILTER_ID}OK`,
    },
    {
        code: 'OR',
        name: 'Oregon',
        id: `${exports.JURISDICTION_SINGLE_STATE_FILTER_ID}OR`,
    },
    {
        code: 'PA',
        name: 'Pennsylvania',
        id: `${exports.JURISDICTION_SINGLE_STATE_FILTER_ID}PA`,
    },
    {
        code: 'RI',
        name: 'Rhode Island',
        id: `${exports.JURISDICTION_SINGLE_STATE_FILTER_ID}RI`,
    },
    {
        code: 'SC',
        name: 'South Carolina',
        id: `${exports.JURISDICTION_SINGLE_STATE_FILTER_ID}SC`,
    },
    {
        code: 'SD',
        name: 'South Dakota',
        id: `${exports.JURISDICTION_SINGLE_STATE_FILTER_ID}SD`,
    },
    {
        code: 'TN',
        name: 'Tennessee',
        id: `${exports.JURISDICTION_SINGLE_STATE_FILTER_ID}TN`,
    },
    {
        code: 'TX',
        name: 'Texas',
        id: `${exports.JURISDICTION_SINGLE_STATE_FILTER_ID}TX`,
    },
    {
        code: 'UT',
        name: 'Utah',
        id: `${exports.JURISDICTION_SINGLE_STATE_FILTER_ID}UT`,
    },
    {
        code: 'VT',
        name: 'Vermont',
        id: `${exports.JURISDICTION_SINGLE_STATE_FILTER_ID}VT`,
    },
    {
        code: 'VA',
        name: 'Virginia',
        id: `${exports.JURISDICTION_SINGLE_STATE_FILTER_ID}VA`,
    },
    {
        code: 'WA',
        name: 'Washington',
        id: `${exports.JURISDICTION_SINGLE_STATE_FILTER_ID}WA`,
    },
    {
        code: 'WV',
        name: 'West Virginia',
        id: `${exports.JURISDICTION_SINGLE_STATE_FILTER_ID}WV`,
    },
    {
        code: 'WI',
        name: 'Wisconsin',
        id: `${exports.JURISDICTION_SINGLE_STATE_FILTER_ID}WI`,
    },
    {
        code: 'WY',
        name: 'Wyoming',
        id: `${exports.JURISDICTION_SINGLE_STATE_FILTER_ID}WY`,
    },
];
//# sourceMappingURL=SmartCharts.constants.js.map
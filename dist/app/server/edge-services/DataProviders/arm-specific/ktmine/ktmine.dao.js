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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKtMineDAO = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const externalDependencies_1 = require("../../../externalDependencies");
const KTMINE_URL = (_a = externalDependencies_1.vars.get('arm')) === null || _a === void 0 ? void 0 : _a.ktmine_host;
const KTMINE_KEY = process.env.ARMAC_KTMINE_KEY;
const DEFAULT_SEARCH_COUNT = 10;
const DEFAULT_BLURB_WORD_COUNT = 100;
function getKtMineDAO() {
    const prepareSearchTermForRequest = (searchTerm) => {
        if (!searchTerm) {
            return searchTerm;
        }
        // RegExp taken from ARM2.0 app/server/ktmine/src/proxy.js
        return searchTerm.replace(/'/gi, '"').replace(/(\band|or|AND|OR\b)(?=(?:[^"|]|"[^"]*")*$)/gi, '');
    };
    function search({ keyword, synonyms, count = DEFAULT_SEARCH_COUNT, start = 0, cik, company, tradingSymbol, formType, coreIndustries, dateRange, filingStatus, formGroup, sic, page, startDate, endDate, sortDirection, sortField, exchange, filingMonth, filingDay, secFileNumber, city, state, incorporationStateCodes, country, zipCode, tenkSection, xbrlCategory, limitSectionScope, }) {
        return __awaiter(this, void 0, void 0, function* () {
            // /api/v1/sec/tenkpost
            const apiUrl = `${KTMINE_URL}/api/v1/sec/tenkpost`;
            const response = yield node_fetch_1.default(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    key: KTMINE_KEY,
                    count,
                    start,
                    keyword,
                    synonyms,
                    cik: cik.replace(/\s/g, '').replace(/^0+/, ''),
                    companyName: company,
                    tradingSymbol,
                    formType,
                    coreIndustries,
                    dateRange,
                    filingStatus,
                    formGroup,
                    sic,
                    page,
                    startDate,
                    endDate,
                    sortDirection,
                    sortField,
                    exchange,
                    filingMonth,
                    filingDay,
                    secFileNumber,
                    city,
                    state,
                    incorporationStateCodes,
                    country,
                    zipCode,
                    tenkSection,
                    xbrlCategory,
                    limitSectionScope,
                }),
            });
            return response.json();
        });
    }
    function getTermCounts(submissionId, searchTerm) {
        return __awaiter(this, void 0, void 0, function* () {
            // /api/v1/sec/termCountPost
            const apiUrl = `${KTMINE_URL}/api/v1/sec/termCountPost`;
            const response = yield node_fetch_1.default(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    key: KTMINE_KEY,
                    submissionId,
                    wordcount: DEFAULT_BLURB_WORD_COUNT.toString(),
                    searchTerm: prepareSearchTermForRequest(searchTerm),
                }),
            });
            return response.json();
        });
    }
    function getXbrlTermCounts(submissionId, searchTerm) {
        return __awaiter(this, void 0, void 0, function* () {
            // /api/v1/sec/xbrlTermCountPost
            const apiUrl = `${KTMINE_URL}/api/v1/sec/xbrlTermCountPost`;
            const response = yield node_fetch_1.default(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    key: KTMINE_KEY,
                    submissionId,
                    wordcount: DEFAULT_BLURB_WORD_COUNT.toString(),
                    searchTerm: prepareSearchTermForRequest(searchTerm),
                    categoryName: 'notes',
                }),
            });
            return response.json();
        });
    }
    function getFilingBlurbs(submissionId, searchTerm, wordcount = DEFAULT_BLURB_WORD_COUNT) {
        return __awaiter(this, void 0, void 0, function* () {
            // /api/v1/sec/blurbsPost
            const apiUrl = `${KTMINE_URL}/api/v1/sec/blurbsPost`;
            const response = yield node_fetch_1.default(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    key: KTMINE_KEY,
                    submissionId,
                    wordcount: wordcount.toString(),
                    searchTerm: searchTerm ? prepareSearchTermForRequest(searchTerm) : '',
                }),
            });
            return response.json();
        });
    }
    function getXbrlFilingBlurbs(submissionId, searchTerm, wordcount = DEFAULT_BLURB_WORD_COUNT) {
        return __awaiter(this, void 0, void 0, function* () {
            // /api/v1/sec/xbrlBlurbsPost
            const apiUrl = `${KTMINE_URL}/api/v1/sec/xbrlBlurbsPost`;
            const response = yield node_fetch_1.default(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    key: KTMINE_KEY,
                    start: '0',
                    count: '100',
                    submissionId,
                    wordcount: wordcount.toString(),
                    searchTerm: searchTerm ? prepareSearchTermForRequest(searchTerm) : '',
                    categoryName: 'notes',
                }),
            });
            return response.json();
        });
    }
    function getCompanies(value) {
        return __awaiter(this, void 0, void 0, function* () {
            // /api/v1/sec/companylookup
            const apiUrl = `${KTMINE_URL}/api/v1/sec/companylookup`;
            const params = `companyName=${value}&count=7&sortField=filerName&key=${KTMINE_KEY}`;
            const response = yield node_fetch_1.default(`${apiUrl}?${params}`);
            return response.json();
        });
    }
    function getFormTypeFilters() {
        return __awaiter(this, void 0, void 0, function* () {
            // /api/v1/sec/formtypelookup
            const apiUrl = `${KTMINE_URL}/api/v1/sec/formtypelookup`;
            const params = `key=${KTMINE_KEY}`;
            const response = yield node_fetch_1.default(`${apiUrl}?${params}`);
            return response.json();
        });
    }
    function getFormGroupFilters() {
        return __awaiter(this, void 0, void 0, function* () {
            // /api/v1/sec/formgrouplookup
            const apiUrl = `${KTMINE_URL}/api/v1/sec/formgrouplookup`;
            const params = `key=${KTMINE_KEY}`;
            const response = yield node_fetch_1.default(`${apiUrl}?${params}`);
            return response.json();
        });
    }
    function getSICFilters() {
        return __awaiter(this, void 0, void 0, function* () {
            // /api/v1/sec/siclookup
            const apiUrl = `${KTMINE_URL}/api/v1/sec/siclookup`;
            const params = `key=${KTMINE_KEY}`;
            const response = yield node_fetch_1.default(`${apiUrl}?${params}`);
            return response.json();
        });
    }
    function getFilingOutline(submissionId) {
        return __awaiter(this, void 0, void 0, function* () {
            // /api/v1/sec/submission
            const apiUrl = `${KTMINE_URL}/api/v1/sec/submission`;
            const params = `submissionId=${submissionId}&key=${KTMINE_KEY}`;
            const response = yield node_fetch_1.default(`${apiUrl}?${params}`);
            return response.json();
        });
    }
    function getFilingSections(submissionId) {
        return __awaiter(this, void 0, void 0, function* () {
            // /api/v1/sec/sections
            const apiUrl = `${KTMINE_URL}/api/v1/sec/sections`;
            const params = `submissionId=${submissionId}&key=${KTMINE_KEY}`;
            const response = yield node_fetch_1.default(`${apiUrl}?${params}`);
            return response.json();
        });
    }
    function getFiling(submissionId, contentDispositionValue, searchTerm) {
        return __awaiter(this, void 0, void 0, function* () {
            // /api/v1/sec/filing
            const apiUrl = `${KTMINE_URL}/api/v1/sec/filing`;
            const params = {
                submissionId,
                contentDispositionValue,
                key: KTMINE_KEY,
            };
            if (searchTerm) {
                params['searchTerm'] = prepareSearchTermForRequest(searchTerm);
            }
            const response = yield node_fetch_1.default(`${apiUrl}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params),
            });
            return response.text();
        });
    }
    function getDocument(submissionDocumentId) {
        return __awaiter(this, void 0, void 0, function* () {
            // /api/v1/sec/document
            const apiUrl = `${KTMINE_URL}/api/v1/sec/document`;
            const params = `submissionDocumentId=${submissionDocumentId}&key=${KTMINE_KEY}`;
            const response = yield node_fetch_1.default(`${apiUrl}?${params}`);
            return response.json();
        });
    }
    function getFilingBinary({ submissionId, type, full = true, filename = 'file', }) {
        return __awaiter(this, void 0, void 0, function* () {
            // /api/v1/sec/pdf
            // /api/v1/sec/rtf
            const apiUrl = type === 'pdf' ? `${KTMINE_URL}/api/v1/sec/pdf` : `${KTMINE_URL}/api/v1/sec/rtf`;
            const params = `id=${submissionId}&full=${full}&filename=${filename}&key=${KTMINE_KEY}`;
            const response = yield node_fetch_1.default(`${apiUrl}?${params}`);
            return response.blob();
        });
    }
    function getFilingSpreadsheet(submissionId, filename = 'file.xlsx') {
        return __awaiter(this, void 0, void 0, function* () {
            // /api/v1/sec/xls
            const apiUrl = `${KTMINE_URL}/api/v1/sec/xls`;
            const params = `submissionDocumentId=${submissionId}&filename=${filename}&key=${KTMINE_KEY}`;
            const response = yield node_fetch_1.default(`${apiUrl}?${params}`);
            return response.blob();
        });
    }
    function getDocumentPage({ submissionDocumentId, pageIndex, searchTerm }) {
        return __awaiter(this, void 0, void 0, function* () {
            // /api/v1/sec/page
            const apiUrl = `${KTMINE_URL}/api/v1/sec/pagePost`;
            const params = {
                submissionDocumentId,
                pageIndex: pageIndex === null || pageIndex === void 0 ? void 0 : pageIndex.toString(),
                key: KTMINE_KEY,
            };
            if (searchTerm) {
                params['searchTerm'] = prepareSearchTermForRequest(searchTerm);
            }
            const response = yield node_fetch_1.default(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params),
            });
            return response.json();
        });
    }
    function getXbrlDocumentPage({ submissionDocumentId, searchTerm }) {
        return __awaiter(this, void 0, void 0, function* () {
            // /api/v1/sec/xbrlPost
            const apiUrl = `${KTMINE_URL}/api/v1/sec/xbrlPost`;
            const response = yield node_fetch_1.default(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    key: KTMINE_KEY,
                    submissionDocumentId,
                    searchTerm: searchTerm ? prepareSearchTermForRequest(searchTerm) : '',
                }),
            });
            return response.json();
        });
    }
    function getDocumentPart(submissionDocumentId, partNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            // /api/v1/sec/part
            const apiUrl = `${KTMINE_URL}/api/v1/sec/part`;
            const params = `submissionDocumentId=${submissionDocumentId}&partNumber=${partNumber}&key=${KTMINE_KEY}`;
            const response = yield node_fetch_1.default(`${apiUrl}?${params}`);
            return response.json();
        });
    }
    function getDocumentItem(submissionDocumentSectionId) {
        return __awaiter(this, void 0, void 0, function* () {
            // /api/v1/sec/item
            const apiUrl = `${KTMINE_URL}/api/v1/sec/item`;
            const params = `submissionDocumentSectionId=${submissionDocumentSectionId}&key=${KTMINE_KEY}`;
            const response = yield node_fetch_1.default(`${apiUrl}?${params}`);
            return response.json();
        });
    }
    function getXBRLDocumentsList(submissionId) {
        return __awaiter(this, void 0, void 0, function* () {
            // /api/v1/sec/submissionxml
            const apiUrl = `${KTMINE_URL}/api/v1/sec/submissionxml`;
            const params = `submissionId=${submissionId}&key=${KTMINE_KEY}`;
            const response = yield node_fetch_1.default(`${apiUrl}?${params}`);
            return response.json();
        });
    }
    function getPDF(submissionId, documentType) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiUrl = `${KTMINE_URL}/api/v1/sec/getpdf`;
            const params = `submissionId=${submissionId}&documentType=${documentType}&key=${KTMINE_KEY}`;
            const response = yield node_fetch_1.default(`${apiUrl}?${params}`);
            const contentDisposition = response.headers.get('Content-Disposition');
            return {
                contentDisposition,
                blob: yield response.blob(),
            };
        });
    }
    return {
        search,
        getTermCounts,
        getXbrlTermCounts,
        getCompanies,
        getFormTypeFilters,
        getFormGroupFilters,
        getFilingOutline,
        getFilingSections,
        getSICFilters,
        getFiling,
        getDocument,
        getDocumentPage,
        getXbrlDocumentPage,
        getDocumentPart,
        getDocumentItem,
        getXBRLDocumentsList,
        getFilingBinary,
        getFilingSpreadsheet,
        getFilingBlurbs,
        getXbrlFilingBlurbs,
        getPDF,
    };
}
exports.getKtMineDAO = getKtMineDAO;
//# sourceMappingURL=ktmine.dao.js.map
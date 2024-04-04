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
exports.getKTMineProcessor = void 0;
const editorial_cards_dao_osa2_1 = require("@wk/acm-editorials/edge-services/src/editorial-cards/editorial-cards.dao.osa2");
const search_response_data_entities_1 = require("@wk/acm-search/edge-services/src/search-model/search-response-data-entities");
const search_model_entities_1 = require("@wk/acm-search/shared/src/search-model/search-model-entities");
const ktmine_dao_1 = require("./ktmine.dao");
const ktmine_filters_service_1 = require("./ktmine.filters.service");
const ktmine_1 = require("../../../client-server/ktmine");
const persistent_storage_1 = require("../persistent-storage");
const SORT_DIRECTIN_TO_KTMINE_SORT_DIRECTIN_MAP = {
    [search_model_entities_1.SortDirectionEnum.ASCENDING]: 'asc',
    [search_model_entities_1.SortDirectionEnum.DESCENDING]: 'desc',
};
const SORT_ORDER_TO_KTMINE_SORT_ORDER_MAP = {
    [search_model_entities_1.SortFieldEnum.DATE]: 'filingdate',
    [search_model_entities_1.SortFieldEnum.RELEVANCE]: 'score',
};
function getKTMineProcessor() {
    const DAO = ktmine_dao_1.getKtMineDAO();
    const browseDAO = editorial_cards_dao_osa2_1.getEditorialCardsDAO();
    const persistentStorageDAO = persistent_storage_1.getPersistentStorageDAO();
    const apiIdToPromiseMap = {
        ['default']: {
            getTermCounts: DAO.getTermCounts,
            getFilingBlurbs: DAO.getFilingBlurbs,
            getDocumentPage: DAO.getDocumentPage,
        },
        ['xbrl']: {
            getTermCounts: DAO.getXbrlTermCounts,
            getFilingBlurbs: DAO.getXbrlFilingBlurbs,
            getDocumentPage: DAO.getDocumentPage,
        },
    };
    const prepareKTMineSearchParams = (req, searchData, isRequestItems = false) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const { model } = searchData;
        const filterForRequest = ktmine_filters_service_1.getSearchParamsFromFilterRefs(model.dynamicSearchScope.searchInsideNodes);
        // Please, when adding new fields to the searchParams, don't forget to add it in runSearch method as well
        // TODO: move searchParams logic to a generic place
        const searchParams = {
            keyword: '',
            synonyms: model.advancedSearchParams.synonyms || '',
            count: model.pageSize,
            start: (model.currentPage - 1) * model.pageSize,
            page: model.currentPage,
            company: model.advancedSearchParams.company || '',
            tradingSymbol: model.advancedSearchParams.tradingSymbol || '',
            cik: model.advancedSearchParams.cik || '',
            formType: filterForRequest.formType || '',
            formGroup: filterForRequest.formGroup || '',
            coreIndustries: filterForRequest.coreIndustries || '',
            sic: filterForRequest.sic || '',
            dateRange: filterForRequest.dateRange || '',
            city: model.advancedSearchParams.city || '',
            state: filterForRequest.state || '',
            incorporationStateCodes: filterForRequest.incorporationStateCodes || '',
            country: filterForRequest.country || '',
            zipCode: model.advancedSearchParams.zipCode || '',
            filingStatus: filterForRequest.filingStatus || '',
            startDate: model.advancedSearchParams.startDate || '',
            endDate: model.advancedSearchParams.endDate || '',
            sortField: SORT_ORDER_TO_KTMINE_SORT_ORDER_MAP[model.sort.order],
            sortDirection: SORT_DIRECTIN_TO_KTMINE_SORT_DIRECTIN_MAP[model.sort.direction],
            limitSectionScope: model.advancedSearchParams.limitSectionScope,
            xbrlCategory: model.advancedSearchParams.xbrlCategory,
            exchange: model.advancedSearchParams.exchange,
            filingMonth: model.advancedSearchParams.filingMonth,
            filingDay: model.advancedSearchParams.filingDay,
            secFileNumber: model.advancedSearchParams.secFileNumber,
            tenkSection: filterForRequest.tenkSection || '',
        };
        let apiId = (_a = model.provider.split('_')) === null || _a === void 0 ? void 0 : _a[1];
        // TODO: move business logic to separate place
        if (model.query) {
            searchParams.keyword = isRequestItems ? model.advancedSearchParams.keyword : model.query;
        }
        if (model.name === 'esgTool' && searchParams.formType === '') {
            // search through all available form types, if the user hasn't selected any of them
            const availableFilters = yield getAvailableFilters(req, searchData);
            const esgFormTypeFilters = (_b = availableFilters.find(filter => filter.filterType === 'formType')) === null || _b === void 0 ? void 0 : _b.filterNodes;
            if (esgFormTypeFilters) {
                const { formType: baseESGFormType } = ktmine_filters_service_1.getSearchParamsFromFilterRefs(esgFormTypeFilters);
                searchParams.formType = baseESGFormType;
            }
        }
        // TODO: move business logic to separate place
        if (!searchParams.keyword) {
            searchParams.tenkSection = '';
        }
        // TODO: move business logic to separate place
        if (searchParams.formType.includes('UPLOAD;CORRESP')) {
            searchParams.limitSectionScope = '';
            searchParams.xbrlCategory = '';
            apiId = apiId === 'xbrl' ? 'default' : apiId;
        }
        // TODO: move business logic to separate place
        // set keyword and synonyms
        if (filterForRequest[ktmine_1.KTMineFilterTypeEnum.SYNONYMS]) {
            let keyword = '';
            let synonyms = '';
            const synonymsFilters = model.dynamicSearchScope.searchInsideNodes.reduce((acc, node) => {
                if (node.filterType === ktmine_1.KTMineFilterTypeEnum.SYNONYMS) {
                    const filter = acc.find(item => item.filterId === node.filterId);
                    if (filter) {
                        filter.terms = [...filter.terms, { termId: node.filterNodeId }];
                    }
                    else {
                        acc.push({ filterId: node.filterId, terms: [{ termId: node.filterNodeId }] });
                    }
                }
                return acc;
            }, []);
            const adminSynonymsFilters = yield Promise.all(synonymsFilters.map(synonymsFilter => getSynonymsFilter(req, { filterId: synonymsFilter.filterId })));
            const userSynonymsFilters = yield Promise.all(synonymsFilters.map(synonymsFilter => getUserSynonymsFilter(req, { filterId: synonymsFilter.filterId })));
            // fill synonymsFilters
            synonymsFilters.forEach((filter, i) => {
                filter.terms.forEach(term => {
                    var _a, _b, _c, _d, _e, _f;
                    const sectionId = term.termId.split('!')[0];
                    const adminTerm = (_b = (_a = adminSynonymsFilters[i][sectionId]) === null || _a === void 0 ? void 0 : _a.items) === null || _b === void 0 ? void 0 : _b.find(item => item.id === term.termId);
                    const termUserSynonyms = ((_d = (_c = userSynonymsFilters[i][sectionId]) === null || _c === void 0 ? void 0 : _c[term.termId]) === null || _d === void 0 ? void 0 : _d.userSynonyms) || [];
                    const uncheckedUserSynonyms = ((_f = (_e = userSynonymsFilters[i][sectionId]) === null || _e === void 0 ? void 0 : _e[term.termId]) === null || _f === void 0 ? void 0 : _f.uncheckedUserSynonyms) || [];
                    if (adminTerm) {
                        term['termTitle'] = adminTerm.title;
                        term['synonyms'] = [...adminTerm.value, ...termUserSynonyms].filter(item => !uncheckedUserSynonyms.includes(item));
                    }
                });
            });
            // fill keyword and synonyms
            const synonymsCondition = model.name === 'esgTool' ? 'OR' : 'AND';
            synonymsFilters.forEach(filter => {
                filter.terms.forEach(term => {
                    if (term.termTitle) {
                        synonyms = synonyms ? synonyms + ';' + term.termTitle : term.termTitle;
                    }
                    if (term.synonyms.length) {
                        const synonymsPart = term.synonyms.reduce((acc, item) => (acc ? `${acc} OR \"${item}\"` : `\"${item}\"`), '');
                        keyword = !!keyword ? `${keyword} ${synonymsCondition} (${synonymsPart})` : `(${synonymsPart})`;
                    }
                });
            });
            searchParams.keyword = keyword || searchParams.keyword;
            searchParams.synonyms = synonyms || searchParams.synonyms;
        }
        return [searchParams, apiId];
    });
    function runSearch(req, searchData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { model } = searchData;
            const responseModel = new search_response_data_entities_1.SearchResponseModel({});
            const [searchParams, apiId] = yield prepareKTMineSearchParams(req, searchData);
            // get filters from model.filtersToDisplay and items
            const [itemsResponce, ...filtersResponce] = yield Promise.all([
                search(searchParams, apiId),
                ...ktmine_filters_service_1.getFilterPromisesByFiltersToDisplay(model.filtersToDisplay, req),
            ]);
            // TypeScript doesn't support different types with destructuring in Promise.all
            const items = itemsResponce;
            const filters = filtersResponce;
            responseModel.sort = model.sort;
            responseModel.query = model.query;
            responseModel.resultItems.count = items.totalFound;
            responseModel.resultItems.items = ktmine_filters_service_1.prepareResultItems(items.items, model.requestMetadataKeys);
            responseModel.resultItems.matchedFilters = filters;
            responseModel.advancedSearchParams = Object.assign(Object.assign({}, model.advancedSearchParams), { keyword: searchParams.keyword, apiId });
            return responseModel;
        });
    }
    function runSearchBySearchId(_req, _searchData) {
        return __awaiter(this, void 0, void 0, function* () {
            // not implemented
            return new search_response_data_entities_1.SearchResponseModel({});
        });
    }
    function getAvailableFilters(req, searchData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { model } = searchData;
            return yield Promise.all(ktmine_filters_service_1.getFilterPromisesByFiltersToDisplay(model.filtersToDisplay, req));
        });
    }
    function getResultItems(req, searchData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { model } = searchData;
            const [searchParams, apiId] = yield prepareKTMineSearchParams(req, searchData, true);
            const itemsResponse = yield search(searchParams, apiId);
            return ktmine_filters_service_1.prepareResultItems(itemsResponse.items, model.requestMetadataKeys);
        });
    }
    function search(params, apiId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield DAO.search(params);
            const termCounts = yield Promise.all(response.response.items.map(item => {
                return apiIdToPromiseMap[apiId]
                    ? apiIdToPromiseMap[apiId].getTermCounts(item.secSubmissionId, params.keyword)
                    : apiIdToPromiseMap['default'].getTermCounts(item.secSubmissionId, params.keyword);
            }));
            const items = response.response.items.map((item, i) => {
                var _a;
                const author = item.filers.find(filer => ['reporting-owner', 'filed-by'].includes(filer.filerType));
                return {
                    id: item.secSubmissionId,
                    tradingSymbol: item.filerTradingSymbol,
                    author: (_a = author === null || author === void 0 ? void 0 : author.filerName) !== null && _a !== void 0 ? _a : '',
                    company: item.issuerFiler.filerName,
                    form: item.filingType,
                    date: item.filingDate,
                    termCount: termCounts[i].response.items[0].termCount,
                };
            });
            return {
                searchId: response.requestId,
                items,
                totalFound: response.response.totalFound,
            };
        });
    }
    function getCompanies(value) {
        return __awaiter(this, void 0, void 0, function* () {
            return DAO.getCompanies(value);
        });
    }
    function getFormTypeFilters() {
        return DAO.getFormTypeFilters();
    }
    function getFormGroupFilters() {
        return DAO.getFormGroupFilters();
    }
    function getFilingOutline(submissionId, type = 'page') {
        if (type === 'page') {
            return DAO.getFilingOutline(submissionId);
        }
        return DAO.getFilingSections(submissionId);
    }
    function getSICFilters() {
        return DAO.getSICFilters();
    }
    function getFiling(submissionId, contentDispositionValue, searchTerm) {
        return __awaiter(this, void 0, void 0, function* () {
            return DAO.getFiling(submissionId, contentDispositionValue, searchTerm);
        });
    }
    function getDocument(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if ('submissionDocumentSectionId' in params && params.submissionDocumentSectionId) {
                return DAO.getDocumentItem(params.submissionDocumentSectionId);
            }
            if ('submissionDocumentId' in params && params.submissionDocumentId) {
                if (params.pageIndex > -1) {
                    return apiIdToPromiseMap[params.apiId]
                        ? apiIdToPromiseMap[params.apiId].getDocumentPage(params)
                        : apiIdToPromiseMap['default'].getDocumentPage(params);
                }
                if (params.partNumber > -1) {
                    return DAO.getDocumentPart(params.submissionDocumentId, params.partNumber);
                }
                return DAO.getDocument(params.submissionDocumentId);
            }
            throw new Error('submissionDocumentId or submissionDocumentSectionId should be provided');
        });
    }
    function getXBRLDocumentsList(submissionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return DAO.getXBRLDocumentsList(submissionId);
        });
    }
    function getExportedFiling(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (params.type === 'xlsx') {
                return DAO.getFilingSpreadsheet(params.id, params.filename);
            }
            return DAO.getFilingBinary({
                submissionId: params.id,
                type: params.type,
                filename: params.filename,
                full: params.full,
            });
        });
    }
    function getFilingBlurbs(submissionId, searchTerm, wordcount, apiId) {
        return __awaiter(this, void 0, void 0, function* () {
            return apiIdToPromiseMap[apiId]
                ? apiIdToPromiseMap[apiId].getFilingBlurbs(submissionId, searchTerm, wordcount)
                : apiIdToPromiseMap['default'].getFilingBlurbs(submissionId, searchTerm, wordcount);
        });
    }
    function getTermSynonyms(req, { filterId, sectionId, termId }) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const cdlSynonymsFilterJSON = yield browseDAO.getEditorialMetadata(req, filterId, filterId);
            const cdlSynonymsFilter = cdlSynonymsFilterJSON ? JSON.parse(cdlSynonymsFilterJSON) : {};
            return ((_c = (_b = (_a = cdlSynonymsFilter === null || cdlSynonymsFilter === void 0 ? void 0 : cdlSynonymsFilter[sectionId]) === null || _a === void 0 ? void 0 : _a.items) === null || _b === void 0 ? void 0 : _b.find(item => item.id === termId)) === null || _c === void 0 ? void 0 : _c.value) || [];
        });
    }
    function getSynonymsFilter(req, { filterId }) {
        return __awaiter(this, void 0, void 0, function* () {
            const cdlSynonymsFilterJSON = yield browseDAO.getEditorialMetadata(req, filterId, filterId);
            const cdlSynonymsFilter = cdlSynonymsFilterJSON ? JSON.parse(cdlSynonymsFilterJSON) : {};
            return cdlSynonymsFilter;
        });
    }
    function updateSynonymsTerm(req, { filterId, sectionId, term: { termId, title, synonyms }, }) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const cdlSynonymsFilterJSON = yield browseDAO.getEditorialMetadata(req, filterId, filterId);
            const cdlSynonymsFilter = cdlSynonymsFilterJSON ? JSON.parse(cdlSynonymsFilterJSON) : {};
            let sectionTerms = (_a = cdlSynonymsFilter[sectionId]) === null || _a === void 0 ? void 0 : _a.items;
            if (sectionTerms.find(sectionTerm => sectionTerm.id === termId)) {
                sectionTerms = sectionTerms.map(sectionTerm => sectionTerm.id === termId ? Object.assign(Object.assign({}, sectionTerm), { title, value: synonyms }) : sectionTerm);
            }
            else {
                sectionTerms.unshift({ id: termId, title, value: synonyms });
            }
            cdlSynonymsFilter[sectionId].items = sectionTerms;
            browseDAO.updateNodeMetadata(req, filterId, browseDAO.packMetadata(filterId, JSON.stringify(cdlSynonymsFilter)));
        });
    }
    function deleteSynonymsTerm(req, { filterId, sectionId, termId }) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const cdlSynonymsFilterJSON = yield browseDAO.getEditorialMetadata(req, filterId, filterId);
            const cdlSynonymsFilter = cdlSynonymsFilterJSON ? JSON.parse(cdlSynonymsFilterJSON) : {};
            cdlSynonymsFilter[sectionId].items = (_b = (_a = cdlSynonymsFilter[sectionId]) === null || _a === void 0 ? void 0 : _a.items) === null || _b === void 0 ? void 0 : _b.filter(item => item.id !== termId);
            browseDAO.updateNodeMetadata(req, filterId, browseDAO.packMetadata(filterId, JSON.stringify(cdlSynonymsFilter)));
        });
    }
    function swapSynonymsTermPlace(req, { currentIndex, newIndex, filterId, sectionId, }) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const cdlSynonymsFilterJSON = yield browseDAO.getEditorialMetadata(req, filterId, filterId);
            const cdlSynonymsFilter = cdlSynonymsFilterJSON ? JSON.parse(cdlSynonymsFilterJSON) : {};
            const sectionTerms = (_a = cdlSynonymsFilter[sectionId]) === null || _a === void 0 ? void 0 : _a.items;
            const targetTerm = sectionTerms[currentIndex];
            sectionTerms[currentIndex] = sectionTerms[newIndex];
            sectionTerms[newIndex] = targetTerm;
            cdlSynonymsFilter[sectionId].items = sectionTerms;
            browseDAO.updateNodeMetadata(req, filterId, browseDAO.packMetadata(filterId, JSON.stringify(cdlSynonymsFilter)));
        });
    }
    function getUserSynonymsFilter(req, { filterId }) {
        return __awaiter(this, void 0, void 0, function* () {
            const allStorageItems = yield persistentStorageDAO.getAllItems(req);
            const userSynonymsFilter = allStorageItems === null || allStorageItems === void 0 ? void 0 : allStorageItems.reduce((acc, item) => {
                var _a, _b, _c;
                const [termFilterId, termSectionId] = (_b = (_a = item.info) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.split('!');
                if (termFilterId !== filterId) {
                    return acc;
                }
                const termId = (_c = item.info) === null || _c === void 0 ? void 0 : _c.value;
                const [userSynonyms, uncheckedUserSynonyms] = item.info.option.reduce(([userSyn, uncheckedUserSyn], optionItem) => {
                    if (optionItem.key === 'user') {
                        userSyn.push(optionItem.value);
                    }
                    if (optionItem.key === 'unchecked') {
                        uncheckedUserSyn.push(optionItem.value);
                    }
                    return [userSyn, uncheckedUserSyn];
                }, [[], []]);
                acc[termSectionId] = Object.assign(Object.assign({}, acc[termSectionId]), { [termId]: {
                        userSynonyms,
                        uncheckedUserSynonyms,
                    } });
                return acc;
            }, {});
            return userSynonymsFilter;
        });
    }
    function updateUserSynonymsTerm(req, { filterId, sectionId, term: { termId, userSynonyms, uncheckedUserSynonyms }, isResetAllUserSynonymsTermInFilter, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const allStorageItems = yield persistentStorageDAO.getAllItems(req);
            // find term info in storage
            const termFromStorage = allStorageItems.find(item => {
                var _a, _b;
                const [itemFilterId, itemSectionId] = (_b = (_a = item.info) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.split('!');
                const itemTermId = item.info.value;
                return itemFilterId === filterId && itemSectionId === sectionId && itemTermId === termId;
            });
            let option = [];
            let itemsForReset = [];
            if (isResetAllUserSynonymsTermInFilter) {
                // reset user synonyms and filter unchecked user synonyms in other terms
                itemsForReset = allStorageItems.reduce((acc, allStorageItem) => {
                    var _a, _b;
                    const [allStorageItemFilterId] = (_b = (_a = allStorageItem.info) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.split('!');
                    const allStorageItemTermId = allStorageItem.info.value;
                    if (allStorageItemFilterId !== filterId || allStorageItemTermId === termId) {
                        return acc;
                    }
                    const currentUserSynonyms = allStorageItem.info.option.filter(optionItem => optionItem.key === 'user');
                    acc.push({
                        id: allStorageItem.id,
                        info: Object.assign(Object.assign({}, allStorageItem.info), { option: allStorageItem.info.option.filter(optionItem => {
                                const isUserSynonym = optionItem.key === 'user';
                                const isUncheckedForReset = optionItem.key === 'unchecked' &&
                                    currentUserSynonyms.find(currentUserSynonym => currentUserSynonym.value === optionItem.value);
                                return !isUserSynonym && !isUncheckedForReset;
                            }) }),
                    });
                    return acc;
                }, []);
                // filter unchecked synonyms in current term and prepare new term synonyms
                const userSynonymsForCurrentTerm = termFromStorage.info.option.filter(optionItem => optionItem.key === 'user');
                option = [
                    ...userSynonyms.map(item => ({ key: 'user', value: item })),
                    ...uncheckedUserSynonyms.reduce((acc, uncheckedUserSynonym) => {
                        const isUncheckedForReset = userSynonymsForCurrentTerm.find(currentUserSynonym => currentUserSynonym.value === uncheckedUserSynonym);
                        if (!isUncheckedForReset) {
                            acc.push({ key: 'unchecked', value: uncheckedUserSynonym });
                        }
                        return acc;
                    }, []),
                ];
            }
            else {
                // prepare new term synonyms
                option = [
                    ...userSynonyms.map(item => ({ key: 'user', value: item })),
                    ...uncheckedUserSynonyms.map(item => ({ key: 'unchecked', value: item })),
                ];
            }
            // update if exist or add
            if (termFromStorage) {
                yield persistentStorageDAO.updateItems(req, [
                    // reset other term user synonyms in storage
                    ...itemsForReset,
                    {
                        id: termFromStorage.id,
                        info: {
                            name: termFromStorage.info.name,
                            value: termFromStorage.info.value,
                            option,
                        },
                    },
                ]);
            }
            else {
                yield persistentStorageDAO.addItem(req, {
                    info: {
                        name: `${filterId}!${sectionId}`,
                        value: termId,
                        option,
                    },
                });
                // reset other term user synonyms in storage
                if (isResetAllUserSynonymsTermInFilter && itemsForReset.length) {
                    yield persistentStorageDAO.updateItems(req, itemsForReset);
                }
            }
        });
    }
    function getPDF(submissionId, documentType) {
        return __awaiter(this, void 0, void 0, function* () {
            return DAO.getPDF(submissionId, documentType);
        });
    }
    function getDocumentIframeLink(params) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.getDocument(params);
            return (_b = (_a = response === null || response === void 0 ? void 0 : response.response) === null || _a === void 0 ? void 0 : _a.items[0]) === null || _b === void 0 ? void 0 : _b.rawHtmlUrl;
        });
    }
    return {
        search,
        getCompanies,
        getFormTypeFilters,
        getFormGroupFilters,
        getFilingOutline,
        getSICFilters,
        getFiling,
        runSearch,
        runSearchBySearchId,
        getAvailableFilters,
        getResultItems,
        getDocument,
        getXBRLDocumentsList,
        getExportedFiling,
        getFilingBlurbs,
        getTermSynonyms,
        getSynonymsFilter,
        updateSynonymsTerm,
        deleteSynonymsTerm,
        swapSynonymsTermPlace,
        getUserSynonymsFilter,
        updateUserSynonymsTerm,
        getPDF,
        getDocumentIframeLink,
    };
}
exports.getKTMineProcessor = getKTMineProcessor;
//# sourceMappingURL=ktmine.service.js.map
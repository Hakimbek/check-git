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
exports.getKTMineServiceMiddleware = exports.getKTMinePermissionsMiddleware = void 0;
const express_1 = require("express");
const ktmine_service_1 = require("./ktmine.service");
const externalDependencies_1 = require("../../../externalDependencies");
const arm_data_providers_constants_1 = require("../arm.data-providers.constants");
function getKTMinePermissionsMiddleware() {
    const router = express_1.Router();
    router.use('/', (req, resp, next) => {
        if (externalDependencies_1.userTypeService.isSubFreemium(req.forwardedSub)) {
            resp.cookie('previously_logged_in', true);
            resp.sendStatus(401);
        }
        else {
            next();
        }
    });
    return {
        router,
    };
}
exports.getKTMinePermissionsMiddleware = getKTMinePermissionsMiddleware;
function getKTMineServiceMiddleware() {
    const router = express_1.Router();
    const processor = ktmine_service_1.getKTMineProcessor();
    router.use('/ktmine', getKTMinePermissionsMiddleware().router);
    router.post('/ktmine/search', (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { keyword, count, start, company, tradingSymbol, cik, formType, sic, dateRange, filingStatus, formGroup, coreIndustries, page, } = req.body;
        const response = yield processor.search({
            count,
            keyword,
            start,
            company,
            tradingSymbol,
            cik,
            formType,
            sic,
            dateRange,
            filingStatus,
            formGroup,
            coreIndustries,
            page,
        });
        res.json(response);
    }));
    router.get('/ktmine/get-companies', (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { value } = req.query;
        const response = yield processor.getCompanies(encodeURIComponent(value));
        res.json(response);
    }));
    router.get('/ktmine/get-form-type-filters', (req, res) => __awaiter(this, void 0, void 0, function* () {
        const response = yield processor.getFormTypeFilters();
        res.json(response);
    }));
    router.get('/ktmine/get-form-group-filters', (req, res) => __awaiter(this, void 0, void 0, function* () {
        const response = yield processor.getFormGroupFilters();
        res.json(response);
    }));
    router.get('/ktmine/get-sic-filters', (req, res) => __awaiter(this, void 0, void 0, function* () {
        const response = yield processor.getSICFilters();
        res.json(response);
    }));
    router.get('/ktmine/get-filing-outline', (req, res) => __awaiter(this, void 0, void 0, function* () {
        const response = yield processor.getFilingOutline(req.query.submissionId, req.query.type);
        res.json(response);
    }));
    router.get('/ktmine/get-filing', (req, res) => __awaiter(this, void 0, void 0, function* () {
        const response = yield processor.getFiling(req.query.submissionId, req.query.contentDispositionValue, req.query.searchTerm);
        res.setHeader('Content-Type', 'text/html');
        res.send(response);
    }));
    router.post('/ktmine/get-filing', (req, res) => __awaiter(this, void 0, void 0, function* () {
        const response = yield processor.getFiling(req.body.submissionId, req.body.contentDispositionValue, req.body.searchTerm);
        res.setHeader('Content-Type', 'text/html');
        res.send(response);
    }));
    router.post('/ktmine/get-document', (req, res) => __awaiter(this, void 0, void 0, function* () {
        const response = yield processor.getDocument({
            submissionDocumentId: req.body.documentId,
            pageIndex: req.body.page,
            partNumber: req.body.part,
            submissionDocumentSectionId: req.body.sectionId,
            searchTerm: req.body.searchTerm,
            apiId: req.body.apiId,
        });
        res.json(response);
    }));
    router.get('/ktmine/get-xbrl-documents-list', (req, res) => __awaiter(this, void 0, void 0, function* () {
        const response = yield processor.getXBRLDocumentsList(req.query.submissionId);
        res.json(response);
    }));
    router.get('/ktmine/get-exported-filing', (req, res) => __awaiter(this, void 0, void 0, function* () {
        const response = yield processor.getExportedFiling({
            id: req.query.id,
            type: req.query.type,
            filename: req.query.filename,
            full: req.query.full === 'true',
        });
        res.setHeader('Content-Disposition', `attachment; filename="${req.query.filename}.${req.query.type}"`);
        res.type(response.type);
        // @TODO review the approach
        response.arrayBuffer().then(buf => {
            res.send(Buffer.from(buf));
        });
    }));
    router.get('/ktmine/get-filing-blurbs', (req, res) => __awaiter(this, void 0, void 0, function* () {
        const response = yield processor.getFilingBlurbs(req.query.submissionId, req.query.searchTerm, req.query.wordcount, req.query.apiId);
        res.json(response);
    }));
    router.get('/ktmine/get-term-synonyms', (req, res) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const response = yield processor.getTermSynonyms(req, req.query);
            res.json(response);
        }
        catch (error) {
            res.status((_a = error.status) !== null && _a !== void 0 ? _a : arm_data_providers_constants_1.RESPONSE_STATUSES.INTERNAL_SERVER_ERROR).send({ error: error.message });
        }
    }));
    router.get('/ktmine/get-synonyms-filter', (req, res) => __awaiter(this, void 0, void 0, function* () {
        var _b;
        try {
            const response = yield processor.getSynonymsFilter(req, req.query);
            res.json(response);
        }
        catch (error) {
            res.status((_b = error.status) !== null && _b !== void 0 ? _b : arm_data_providers_constants_1.RESPONSE_STATUSES.INTERNAL_SERVER_ERROR).send({ error: error.message });
        }
    }));
    router.post('/ktmine/update-synonyms-term', (req, res) => __awaiter(this, void 0, void 0, function* () {
        var _c;
        try {
            const { body } = req;
            const response = yield processor.updateSynonymsTerm(req, body);
            res.json(response);
        }
        catch (error) {
            res.status((_c = error.status) !== null && _c !== void 0 ? _c : arm_data_providers_constants_1.RESPONSE_STATUSES.INTERNAL_SERVER_ERROR).send({ error: error.message });
        }
    }));
    router.delete('/ktmine/delete-synonyms-term', (req, res) => __awaiter(this, void 0, void 0, function* () {
        var _d;
        try {
            const response = yield processor.deleteSynonymsTerm(req, req.query);
            res.json(response);
        }
        catch (error) {
            res.status((_d = error.status) !== null && _d !== void 0 ? _d : arm_data_providers_constants_1.RESPONSE_STATUSES.INTERNAL_SERVER_ERROR).send({ error: error.message });
        }
    }));
    router.post('/ktmine/swap-synonyms-term-place', (req, res) => __awaiter(this, void 0, void 0, function* () {
        var _e;
        try {
            const response = yield processor.swapSynonymsTermPlace(req, req.query);
            res.json(response);
        }
        catch (error) {
            res.status((_e = error.status) !== null && _e !== void 0 ? _e : arm_data_providers_constants_1.RESPONSE_STATUSES.INTERNAL_SERVER_ERROR).send({ error: error.message });
        }
    }));
    router.get('/ktmine/get-user-synonyms-filter', (req, res) => __awaiter(this, void 0, void 0, function* () {
        var _f;
        try {
            const response = yield processor.getUserSynonymsFilter(req, req.query);
            res.json(response);
        }
        catch (error) {
            res.status((_f = error.status) !== null && _f !== void 0 ? _f : arm_data_providers_constants_1.RESPONSE_STATUSES.INTERNAL_SERVER_ERROR).send({ error: error.message });
        }
    }));
    router.post('/ktmine/update-user-synonyms-term', (req, res) => __awaiter(this, void 0, void 0, function* () {
        var _g;
        try {
            const { body } = req;
            const response = yield processor.updateUserSynonymsTerm(req, body);
            res.json(response);
        }
        catch (error) {
            res.status((_g = error.status) !== null && _g !== void 0 ? _g : arm_data_providers_constants_1.RESPONSE_STATUSES.INTERNAL_SERVER_ERROR).send({ error: error.message });
        }
    }));
    router.get('/ktmine/get-pdf', (req, res) => __awaiter(this, void 0, void 0, function* () {
        var _h;
        try {
            const { submissionId, documentType } = req.query;
            const { contentDisposition, blob } = yield processor.getPDF(submissionId, documentType);
            res.setHeader('Content-Disposition', contentDisposition);
            res.type(blob.type);
            blob.arrayBuffer().then(buf => {
                res.send(Buffer.from(buf));
            });
        }
        catch (error) {
            res.status((_h = error.status) !== null && _h !== void 0 ? _h : arm_data_providers_constants_1.RESPONSE_STATUSES.INTERNAL_SERVER_ERROR).send({ error: error.message });
        }
    }));
    router.get('/ktmine/get-document-iframe-link', (req, res) => __awaiter(this, void 0, void 0, function* () {
        var _j;
        try {
            const { documentId, page, part, sectionId, searchTerm, apiId } = req.query;
            const response = yield processor.getDocumentIframeLink({
                submissionDocumentId: documentId,
                pageIndex: page,
                partNumber: part,
                submissionDocumentSectionId: sectionId,
                searchTerm: searchTerm,
                apiId: apiId,
            });
            res.redirect(response);
        }
        catch (error) {
            res.status((_j = error.status) !== null && _j !== void 0 ? _j : arm_data_providers_constants_1.RESPONSE_STATUSES.INTERNAL_SERVER_ERROR).send({ error: error.message });
        }
    }));
    return {
        router,
    };
}
exports.getKTMineServiceMiddleware = getKTMineServiceMiddleware;
//# sourceMappingURL=ktmine.route.js.map
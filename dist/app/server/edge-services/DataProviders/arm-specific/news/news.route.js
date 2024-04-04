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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNewsMiddleware = void 0;
const express_1 = require("express");
const url_1 = __importDefault(require("url"));
const log_base_1 = require("@wk/log-base");
const news_service_1 = require("./news.service");
const current_developments_route_1 = require("./current-developments/current-developments.route");
const registeredMiddleware_js_1 = __importDefault(require("../../../../../server/login/registeredMiddleware.js"));
const externalDependencies_1 = require("../../../externalDependencies");
const arm_data_providers_constants_1 = require("../arm.data-providers.constants");
const news_constants_1 = require("./news.constants");
function getNewsMiddleware() {
    const router = express_1.Router();
    const newsService = new news_service_1.NewsService();
    const currentDevelopmentsMiddleware = current_developments_route_1.getCurrentDevelopmentsMiddleware();
    router.use('/news', currentDevelopmentsMiddleware.router);
    router.get('/news', (req, resp) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { newsType, top, skip } = req.query;
            const news = yield newsService.getNews(req, { newsType, top, skip });
            resp.setHeader('Content-Type', 'application/json');
            resp.status(arm_data_providers_constants_1.RESPONSE_STATUSES.SUCCESS).send(news);
        }
        catch (error) {
            resp.status(arm_data_providers_constants_1.RESPONSE_STATUSES.INTERNAL_SERVER_ERROR).send(error);
        }
    }));
    router.get('/alerts-10k', (req, resp) => __awaiter(this, void 0, void 0, function* () {
        const getting10KAlertsOperationId = externalDependencies_1.logService.durationTracking.start();
        let getting10KAlertsOperationDuration;
        let logErrorData;
        try {
            const alerts10K = yield newsService.get10KAlerts(req);
            resp.setHeader('Content-Type', 'application/json');
            resp.status(arm_data_providers_constants_1.RESPONSE_STATUSES.SUCCESS).send(alerts10K);
        }
        catch (error) {
            logErrorData = error;
            resp.status(arm_data_providers_constants_1.RESPONSE_STATUSES.INTERNAL_SERVER_ERROR).send(error);
        }
        finally {
            getting10KAlertsOperationDuration = externalDependencies_1.logService.durationTracking.end(getting10KAlertsOperationId);
            externalDependencies_1.logService.logRequest(logErrorData ? log_base_1.LogLevel.Error : log_base_1.LogLevel.Info, req, {
                message: logErrorData
                    ? `${news_constants_1.LOG_MESSAGE_GETTING_10K_ALERTS_FAIL} Error: ${logErrorData.message}`
                    : news_constants_1.LOG_MESSAGE_GETTING_10K_ALERTS_SUCCESS,
                duration: getting10KAlertsOperationDuration,
                correlationId: req.correlationId,
            }, logErrorData);
        }
    }));
    router.delete('/alerts-10k', (req, resp) => __awaiter(this, void 0, void 0, function* () {
        const removing10KAlertOperationId = externalDependencies_1.logService.durationTracking.start();
        let removing10KAlertOperationDuration;
        let logErrorData;
        try {
            const { alertId } = req.query;
            yield newsService.remove10KAlert(req, alertId);
            resp.status(arm_data_providers_constants_1.RESPONSE_STATUSES.SUCCESS).send();
        }
        catch (error) {
            logErrorData = error;
            resp.status(arm_data_providers_constants_1.RESPONSE_STATUSES.INTERNAL_SERVER_ERROR).send(error);
        }
        finally {
            removing10KAlertOperationDuration = externalDependencies_1.logService.durationTracking.end(removing10KAlertOperationId);
            externalDependencies_1.logService.logRequest(logErrorData ? log_base_1.LogLevel.Error : log_base_1.LogLevel.Info, req, {
                message: logErrorData
                    ? `${news_constants_1.LOG_MESSAGE_REMOVING_10K_ALERT_FAIL} Error: ${logErrorData.message}`
                    : news_constants_1.LOG_MESSAGE_REMOVING_10K_ALERT_SUCCESS,
                duration: removing10KAlertOperationDuration,
                correlationId: req.correlationId,
            }, logErrorData);
        }
    }));
    router.put('/alerts-10k', (req, resp) => __awaiter(this, void 0, void 0, function* () {
        const updating10KAlertOperationId = externalDependencies_1.logService.durationTracking.start();
        let updating10KAlertOperationDuration;
        let logErrorData;
        try {
            const { alertConfig, alertId, context } = req.body;
            yield newsService.update10KAlert(req, alertConfig, alertId, context);
            resp.status(arm_data_providers_constants_1.RESPONSE_STATUSES.SUCCESS).send();
        }
        catch (error) {
            logErrorData = error;
            resp.status(arm_data_providers_constants_1.RESPONSE_STATUSES.INTERNAL_SERVER_ERROR).send(error);
        }
        finally {
            updating10KAlertOperationDuration = externalDependencies_1.logService.durationTracking.end(updating10KAlertOperationId);
            externalDependencies_1.logService.logRequest(logErrorData ? log_base_1.LogLevel.Error : log_base_1.LogLevel.Info, req, {
                message: logErrorData
                    ? `${news_constants_1.LOG_MESSAGE_UPDATING_10K_ALERT_FAIL} Error: ${logErrorData.message}`
                    : news_constants_1.LOG_MESSAGE_UPDATING_10K_ALERT_SUCCESS,
                duration: updating10KAlertOperationDuration,
                correlationId: req.correlationId,
            }, logErrorData);
        }
    }));
    router.post('/alerts-10k', (req, resp) => __awaiter(this, void 0, void 0, function* () {
        const creating10KAlertOperationId = externalDependencies_1.logService.durationTracking.start();
        let creating10KAlertOperationDuration;
        let logErrorData;
        try {
            const _a = req.body, { context } = _a, alertConfig = __rest(_a, ["context"]);
            const new10KAlert = yield newsService.create10KAlert(req, alertConfig, context);
            resp.setHeader('Content-Type', 'application/json');
            resp.status(arm_data_providers_constants_1.RESPONSE_STATUSES.SUCCESS).send(new10KAlert);
        }
        catch (error) {
            logErrorData = error;
            resp.status(arm_data_providers_constants_1.RESPONSE_STATUSES.INTERNAL_SERVER_ERROR).send(error);
        }
        finally {
            creating10KAlertOperationDuration = externalDependencies_1.logService.durationTracking.end(creating10KAlertOperationId);
            externalDependencies_1.logService.logRequest(logErrorData ? log_base_1.LogLevel.Error : log_base_1.LogLevel.Info, req, {
                message: logErrorData
                    ? `${news_constants_1.LOG_MESSAGE_CREATING_10K_ALERT_FAIL} Error: ${logErrorData.message}`
                    : news_constants_1.LOG_MESSAGE_CREATING_10K_ALERT_SUCCESS,
                duration: creating10KAlertOperationDuration,
                correlationId: req.correlationId,
            }, logErrorData);
        }
    }));
    router.get('/alerts-10k/email/unsubscribe', registeredMiddleware_js_1.default, (req, resp) => __awaiter(this, void 0, void 0, function* () {
        const { atid: alertId } = req.query;
        const alertSubContext = yield newsService.get10KAlertSubContext(req, alertId);
        const alertSearchPage = alertSubContext === 'ARM_10K_ESG' ? 'esg' : '10k-lookup';
        resp.redirect(url_1.default.format({ pathname: `/app/acr/${alertSearchPage}/my-alerts`, query: { removeAlert: alertId } }));
    }));
    router.get('/alerts-10k/email/open-search', registeredMiddleware_js_1.default, (req, resp) => __awaiter(this, void 0, void 0, function* () {
        const { atid: alertId } = req.query;
        const alertSubContext = yield newsService.get10KAlertSubContext(req, alertId);
        const alertSearchPage = alertSubContext === 'ARM_10K_ESG' ? 'esg' : '10k-lookup';
        resp.redirect(url_1.default.format({
            pathname: `/app/acr/${alertSearchPage}/search`,
            query: { restoreAlert: alertId, source: 'email' },
        }));
    }));
    router.get('/alerts-10k/email/open-form', registeredMiddleware_js_1.default, (req, resp) => __awaiter(this, void 0, void 0, function* () {
        const { documentId: formId, atid: alertId } = req.query;
        const alertSubContext = yield newsService.get10KAlertSubContext(req, alertId);
        const alertSearchPage = alertSubContext === 'ARM_10K_ESG' ? 'esg' : '10k-lookup';
        resp.redirect(url_1.default.format({
            pathname: `/app/acr/${alertSearchPage}/view`,
            query: { submissionId: formId, viewMode: 'page', source: 'email' },
        }));
    }));
    return {
        router,
        services: { newsService },
    };
}
exports.getNewsMiddleware = getNewsMiddleware;
//# sourceMappingURL=news.route.js.map
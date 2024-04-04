"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apicache_1 = require("apicache");
const body_parser_1 = require("body-parser");
const compression_1 = __importDefault(require("compression"));
const elastic_apm_node_1 = require("elastic-apm-node");
const express_1 = require("express");
const createTrialUserRoute_1 = require("./createTrialUserRoute");
const routes_1 = __importDefault(require("./reports/routes"));
const searchRoute_1 = __importDefault(require("./search/searchRoute"));
const DataProviders_1 = require("../DataProviders");
const externalDependencies_1 = require("../externalDependencies");
const claims_1 = __importDefault(require("../routes/freemium-user/claims"));
const claims_2 = __importDefault(require("../routes/gpd-user/claims"));
const topicsRoute_1 = __importDefault(require("../routes/topicsRoute"));
const proxySearchCacheTTL = externalDependencies_1.vars.get('edgeServiceSetting').cacheTTL.proxySearch;
const apmConfigVars = externalDependencies_1.vars.get('elasticApm');
class Routes {
    constructor() {
        this.router = express_1.Router();
        this.router.use(compression_1.default());
        this.initApmAgent();
        this.router.post('/proxySearch', body_parser_1.json({ verify: this.getRawRequestBody }), apicache_1.middleware(proxySearchCacheTTL), searchRoute_1.default.searchRequestHandler);
        this.router.post('/proxyTopic', topicsRoute_1.default.middleware, topicsRoute_1.default.topicRequestHandler);
        this.router.post('/createTrialUser', body_parser_1.json(), createTrialUserRoute_1.CreateTrialUserRoute.middleware, createTrialUserRoute_1.CreateTrialUserRoute.trialRegisterHandler);
        this.router.get('/proxyTopic/:id', topicsRoute_1.default.middleware, topicsRoute_1.default.topicRedirectHandler);
        this.router.get('/gpd-user/claims', claims_2.default.middleware, claims_2.default.handler);
        this.router.get('/freemium-user/claims', claims_1.default.middleware, claims_1.default.handler);
        this.router.use('/reports', routes_1.default);
        this.router.use('/services', DataProviders_1.servicesAPIRouter);
        this.router.use(this.routeNotFound);
    }
    initApmAgent() {
        elastic_apm_node_1.start({
            serverUrl: apmConfigVars === null || apmConfigVars === void 0 ? void 0 : apmConfigVars.elasticApmServerUrl,
            serviceName: apmConfigVars === null || apmConfigVars === void 0 ? void 0 : apmConfigVars.serviceName,
            environment: apmConfigVars === null || apmConfigVars === void 0 ? void 0 : apmConfigVars.elasticEnvironment,
            secretToken: process.env.ELASTIC_APM_SECRET_TOKEN,
        });
    }
    routeNotFound(req, res) {
        externalDependencies_1.logService.error(`Route "${req.url}" not found!`, { res });
    }
    getRawRequestBody(req, res, buf) {
        req.rawBody = buf.toString();
    }
}
exports.default = new Routes().router;
//# sourceMappingURL=routes.js.map
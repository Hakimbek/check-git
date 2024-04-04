"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getARMMiddlewares = void 0;
const express_1 = require("express");
const user_administration_1 = require("./user-administration");
const _360_view_route_1 = require("./360-view/360-view.route");
const concurrency_route_1 = require("./concurrency/concurrency.route");
const document_route_1 = require("./document/document.route");
const news_route_1 = require("./news/news.route");
function getARMMiddlewares({ configs, services } = {}) {
    const router = express_1.Router();
    const concurrencyMiddleware = concurrency_route_1.getConcurrencyCoreMiddleware();
    const newsMiddleware = news_route_1.getNewsMiddleware();
    const userAdministrationMiddleware = user_administration_1.getUserAdministrationMiddleware();
    const documentMiddlewares = document_route_1.getARMDocumentMiddleware({ configs, services });
    const view360Middlewares = _360_view_route_1.get360ViewMiddlewares();
    router.use('/arm', concurrencyMiddleware.router);
    router.use('/arm', newsMiddleware.router);
    router.use('/arm', userAdministrationMiddleware.router);
    router.use('/arm', documentMiddlewares.router);
    router.use('/arm', view360Middlewares.router);
    return {
        router,
        services: Object.assign(Object.assign(Object.assign(Object.assign({}, concurrencyMiddleware.services), newsMiddleware.services), documentMiddlewares.services), view360Middlewares.services),
    };
}
exports.getARMMiddlewares = getARMMiddlewares;
//# sourceMappingURL=arm.route.js.map
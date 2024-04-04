"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get360ViewMiddlewares = void 0;
const express_1 = require("express");
const relations_route_1 = require("./relations/relations.route");
const sub_tree_route_1 = require("./sub-tree/sub-tree.route");
const as_document_event_route_1 = require("./as-document-event/as-document-event.route");
function get360ViewMiddlewares() {
    const router = express_1.Router();
    const relationsMiddleware = relations_route_1.getRelationsMiddleware();
    const subTreeMiddleware = sub_tree_route_1.getSubTreeMiddleware();
    const asDocumentEventMiddleware = as_document_event_route_1.getASDocumentEventMiddleware();
    router.use('/360-view', relationsMiddleware.router, subTreeMiddleware.router, asDocumentEventMiddleware.router);
    return {
        router,
        services: Object.assign(Object.assign(Object.assign({}, relationsMiddleware.services), subTreeMiddleware.services), asDocumentEventMiddleware.services),
    };
}
exports.get360ViewMiddlewares = get360ViewMiddlewares;
//# sourceMappingURL=360-view.route.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getARMDocumentMiddleware = void 0;
const express_1 = require("express");
const annotations_route_1 = require("./annotations/annotations.route");
const combinable_route_1 = require("./combinable/combinable.route");
const metadata_route_1 = require("./metadata/metadata.route");
const related_content_route_1 = require("./related-content/related-content.route");
function getARMDocumentMiddleware({ configs, services, }) {
    const router = express_1.Router();
    const relatedContentMiddleware = related_content_route_1.getRelatedContentMiddleware();
    const metadataMiddleware = metadata_route_1.getMetadataMiddleware();
    const combinableMiddleware = combinable_route_1.getARMCombinableDocumentMiddleware({ configs, services });
    const annotationsMiddleware = annotations_route_1.getAnnotationsMiddleware();
    router.use('/document', relatedContentMiddleware.router);
    router.use('/document', metadataMiddleware.router);
    router.use('/document', combinableMiddleware.router);
    router.use('/document', annotationsMiddleware.router);
    return {
        router,
        services: Object.assign(Object.assign(Object.assign(Object.assign({}, relatedContentMiddleware.services), metadataMiddleware.services), combinableMiddleware.services), annotationsMiddleware.services),
    };
}
exports.getARMDocumentMiddleware = getARMDocumentMiddleware;
//# sourceMappingURL=document.route.js.map
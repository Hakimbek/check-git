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
exports.getRelatedContentMiddleware = void 0;
const express_1 = require("express");
const related_content_service_1 = require("./related-content.service");
const arm_data_providers_constants_1 = require("../../arm.data-providers.constants");
function getRelatedContentMiddleware() {
    const router = express_1.Router();
    const relatedContentService = new related_content_service_1.RelatedContentService();
    router.get('/get-related-content', (req, resp) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { documentId, includeArchivePubs } = req.query;
            // note that query params are strings
            const content = yield relatedContentService.getRelatedContent(req, documentId, includeArchivePubs === 'true');
            resp.setHeader('Content-Type', 'application/json');
            resp.status(arm_data_providers_constants_1.RESPONSE_STATUSES.SUCCESS).send(content);
        }
        catch (error) {
            resp.status(arm_data_providers_constants_1.RESPONSE_STATUSES.INTERNAL_SERVER_ERROR).send(error);
        }
    }));
    return {
        router,
        services: { relatedContent: relatedContentService },
    };
}
exports.getRelatedContentMiddleware = getRelatedContentMiddleware;
//# sourceMappingURL=related-content.route.js.map
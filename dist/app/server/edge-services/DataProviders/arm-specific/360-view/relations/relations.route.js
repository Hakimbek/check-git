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
exports.getRelationsMiddleware = void 0;
const express_1 = require("express");
const relations_service_1 = require("./relations.service");
const arm_data_providers_constants_1 = require("../../arm.data-providers.constants");
function getRelationsMiddleware() {
    const router = express_1.Router();
    const relationsService = new relations_service_1.RelationsService();
    router.get('/get-relations', (req, resp) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { documentId, relationshipSetId } = req.query;
            const relations = yield relationsService.getDocumentRelations(req, documentId, relationshipSetId);
            resp.setHeader('Content-Type', 'application/json');
            resp.status(arm_data_providers_constants_1.RESPONSE_STATUSES.SUCCESS).send(relations);
        }
        catch (error) {
            resp.status(arm_data_providers_constants_1.RESPONSE_STATUSES.INTERNAL_SERVER_ERROR).send(error);
        }
    }));
    router.get('/get-documents-by-relation', (req, resp) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { documentId, relationshipId, relationshipSetId } = req.query;
            const documents = yield relationsService.getDocumentsByRelation(req, documentId, relationshipId, relationshipSetId);
            resp.setHeader('Content-Type', 'application/json');
            resp.status(arm_data_providers_constants_1.RESPONSE_STATUSES.SUCCESS).send(documents);
        }
        catch (error) {
            resp.status(arm_data_providers_constants_1.RESPONSE_STATUSES.INTERNAL_SERVER_ERROR).send(error);
        }
    }));
    return {
        router,
        services: { relationsService: relationsService },
    };
}
exports.getRelationsMiddleware = getRelationsMiddleware;
//# sourceMappingURL=relations.route.js.map
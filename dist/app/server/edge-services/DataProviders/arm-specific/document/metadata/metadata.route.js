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
exports.getMetadataMiddleware = void 0;
const express_1 = require("express");
const metadata_service_1 = require("./metadata.service");
const arm_data_providers_constants_1 = require("../../arm.data-providers.constants");
function getMetadataMiddleware() {
    const router = express_1.Router();
    const metadataService = new metadata_service_1.MetadataService();
    router.post('/get-metadata', (req, resp) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { documentId } = req.query;
            const { extendedMetadataFields, includeSearchMetadata } = req.body;
            const metadata = yield metadataService.getMetadata(req, documentId, extendedMetadataFields, includeSearchMetadata);
            resp.setHeader('Content-Type', 'application/json');
            resp.status(arm_data_providers_constants_1.RESPONSE_STATUSES.SUCCESS).send(metadata);
        }
        catch (error) {
            resp.status(arm_data_providers_constants_1.RESPONSE_STATUSES.INTERNAL_SERVER_ERROR).send(error);
        }
    }));
    router.get('/get-search-metadata', (req, resp) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { documentId } = req.query;
            const metadata = yield metadataService.getSearchMetadata(req, documentId);
            resp.setHeader('Content-Type', 'application/json');
            resp.status(arm_data_providers_constants_1.RESPONSE_STATUSES.SUCCESS).send(metadata);
        }
        catch (error) {
            resp.status(arm_data_providers_constants_1.RESPONSE_STATUSES.INTERNAL_SERVER_ERROR).send(error);
        }
    }));
    return {
        router,
        services: { metadataService: metadataService },
    };
}
exports.getMetadataMiddleware = getMetadataMiddleware;
//# sourceMappingURL=metadata.route.js.map
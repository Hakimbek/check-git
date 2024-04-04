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
exports.getASDocumentEventMiddleware = void 0;
const express_1 = require("express");
const as_document_event_servise_1 = require("./as-document-event.servise");
const arm_data_providers_constants_1 = require("../../arm.data-providers.constants");
function getASDocumentEventMiddleware() {
    const router = express_1.Router();
    const asDocumentEvent = new as_document_event_servise_1.ASDocumentEventService();
    router.get('/get-as-document-events', (req, resp) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { context } = req.query;
            const history = yield asDocumentEvent.getASDocumentEvents(req, context);
            resp.setHeader('Content-Type', 'application/json');
            resp.status(arm_data_providers_constants_1.RESPONSE_STATUSES.SUCCESS).send(history);
        }
        catch (error) {
            resp.status(arm_data_providers_constants_1.RESPONSE_STATUSES.INTERNAL_SERVER_ERROR).send(error);
        }
    }));
    router.post('/send-as-document-event', (req, resp) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { title, documentId, nodeId, context } = req.body;
            yield asDocumentEvent.sendASDocumentEvent(req, { title, documentId, nodeId, context });
            resp.status(arm_data_providers_constants_1.RESPONSE_STATUSES.SUCCESS);
        }
        catch (error) {
            resp.status(arm_data_providers_constants_1.RESPONSE_STATUSES.INTERNAL_SERVER_ERROR).send(error);
        }
    }));
    return {
        router,
        services: { asDocumentEvent },
    };
}
exports.getASDocumentEventMiddleware = getASDocumentEventMiddleware;
//# sourceMappingURL=as-document-event.route.js.map
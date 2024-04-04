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
exports.getARMCombinableDocumentMiddleware = void 0;
const express_1 = require("express");
const combinable_service_1 = require("./combinable.service");
const arm_data_providers_constants_1 = require("../../arm.data-providers.constants");
function getARMCombinableDocumentMiddleware({ configs, services, }) {
    const router = express_1.Router();
    const combinableDocumentService = combinable_service_1.getCombinableDocumentService({ configs, services });
    router.post('/combinable/get-documents-titles', (req, resp) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { documentsIds } = req.body;
            const documentsTitles = yield combinableDocumentService.getDocumentsTitles(req, documentsIds);
            resp.setHeader('Content-Type', 'application/json');
            resp.status(arm_data_providers_constants_1.RESPONSE_STATUSES.SUCCESS).send(documentsTitles);
        }
        catch (error) {
            resp.status(arm_data_providers_constants_1.RESPONSE_STATUSES.INTERNAL_SERVER_ERROR).send(error);
        }
    }));
    return {
        router,
        services: {
            combinableDocument: combinableDocumentService,
        },
    };
}
exports.getARMCombinableDocumentMiddleware = getARMCombinableDocumentMiddleware;
//# sourceMappingURL=combinable.route.js.map
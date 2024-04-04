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
exports.getAnnotationsMiddleware = void 0;
const express_1 = require("express");
const lodash_1 = require("lodash");
const annotations_service_1 = require("./annotations.service");
const logger_1 = require("../../../../utils/logger");
const arm_data_providers_constants_1 = require("../../arm.data-providers.constants");
function getAnnotationsMiddleware() {
    const router = express_1.Router();
    const annotationsService = new annotations_service_1.AnnotationsService();
    router.post('/create-annotation', logger_1.withAsyncRequestLogging((req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { documentId } = req.query;
            const bodyParams = lodash_1.pick(req.body, [
                'startElementId',
                'endElementId',
                'startElementOffset',
                'endElementOffset',
                'selectedText',
                'annotationText',
            ]);
            const params = Object.assign({ documentId }, bodyParams);
            const createdAnnotation = yield annotationsService.createAnnotation(req, params);
            res.setHeader('Content-Type', 'application/json');
            res.status(arm_data_providers_constants_1.RESPONSE_STATUSES.SUCCESS).send(createdAnnotation);
        }
        catch (err) {
            res.status(arm_data_providers_constants_1.RESPONSE_STATUSES.INTERNAL_SERVER_ERROR).send(err);
        }
    }), {
        enableStdOutput: true,
        getErrorMessage: (error) => `Cannot create annotation: ${error.message}`,
        getSuccessMessage: () => `Annotation was added successfully`,
    }));
    router.get('/get-annotations', logger_1.withAsyncRequestLogging((req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { documentId } = req.query;
            const annotations = yield annotationsService.getAnnotations(req, documentId);
            res.setHeader('Content-Type', 'application/json');
            res.status(arm_data_providers_constants_1.RESPONSE_STATUSES.SUCCESS).send(annotations);
        }
        catch (err) {
            res.status(arm_data_providers_constants_1.RESPONSE_STATUSES.INTERNAL_SERVER_ERROR).send(err);
        }
    }), {
        enableStdOutput: true,
        getErrorMessage: (error) => `Cannot get annotations: ${error.message}`,
        getSuccessMessage: () => `Annotations was fetched successfully`,
    }));
    router.put('/update-note', logger_1.withAsyncRequestLogging((req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const params = req.body;
            const updateNote = yield annotationsService.updateNote(req, params);
            res.setHeader('Content-Type', 'application/json');
            res.status(arm_data_providers_constants_1.RESPONSE_STATUSES.SUCCESS).send(updateNote);
        }
        catch (err) {
            res.status(arm_data_providers_constants_1.RESPONSE_STATUSES.INTERNAL_SERVER_ERROR).send(err);
        }
    }), {
        enableStdOutput: true,
        getErrorMessage: (error) => `Cannot update annotation: ${error.message}`,
        getSuccessMessage: () => `Annotation was updated successfully`,
    }));
    router.delete('/remove-annotation', logger_1.withAsyncRequestLogging((req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.body;
            const removeAnnotation = yield annotationsService.removeAnnotation(req, id);
            res.setHeader('Content-Type', 'application/json');
            res.status(arm_data_providers_constants_1.RESPONSE_STATUSES.SUCCESS).send(removeAnnotation);
        }
        catch (err) {
            res.status(arm_data_providers_constants_1.RESPONSE_STATUSES.INTERNAL_SERVER_ERROR).send(err);
        }
    }), {
        enableStdOutput: true,
        getErrorMessage: (error) => `Cannot delete annotation: ${error.message}`,
        getSuccessMessage: () => `Annotation was deleted successfully`,
    }));
    return {
        router,
        services: { annotations: annotationsService },
    };
}
exports.getAnnotationsMiddleware = getAnnotationsMiddleware;
//# sourceMappingURL=annotations.route.js.map
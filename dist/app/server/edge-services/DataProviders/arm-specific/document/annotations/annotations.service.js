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
exports.AnnotationsService = void 0;
const lodash_1 = require("lodash");
const annotations_dao_1 = require("./annotations.dao");
const stripAnnotation = (annotation) => {
    return lodash_1.pick(annotation, [
        'id',
        'title',
        'annotationText',
        'baseAnchor',
        'editable',
        'precedingText',
        'succedingText',
        'resource',
    ]);
};
class AnnotationsService {
    createAnnotation(req, annotationInputParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const dto = yield annotations_dao_1.AnnotationsDao.createAnnotation(req, annotationInputParams);
            const createdAnnotation = stripAnnotation(dto);
            return createdAnnotation;
        });
    }
    getAnnotations(req, documentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const annotationsResponse = yield annotations_dao_1.AnnotationsDao.getAnnotations(req, documentId);
            const strippedAnnotations = annotationsResponse.map(stripAnnotation);
            return strippedAnnotations;
        });
    }
    updateNote(req, params) {
        return __awaiter(this, void 0, void 0, function* () {
            yield annotations_dao_1.AnnotationsDao.updateNote(req, params);
            return params;
        });
    }
    removeAnnotation(req, id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield annotations_dao_1.AnnotationsDao.removeAnnotation(req, id);
            return { id };
        });
    }
}
exports.AnnotationsService = AnnotationsService;
//# sourceMappingURL=annotations.service.js.map
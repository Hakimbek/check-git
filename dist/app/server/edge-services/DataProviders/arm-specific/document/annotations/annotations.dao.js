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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnotationsDao = void 0;
const osa_personalitem_1 = require("@wk/osa-personalitem");
const constants_1 = require("../../../../config/constants");
const osaService_1 = __importDefault(require("../../../../services/common/osaService"));
class AnnotationsDao {
    static createPersonalItemService(req) {
        const personalItemService = osaService_1.default.createDomainServiceInstance(constants_1.PERSONALITEM_DOMAIN_NAME, req);
        return personalItemService;
    }
    static createAnnotation(req, { documentId, startElementId, endElementId, startElementOffset, endElementOffset, selectedText, annotationText = '', }) {
        return __awaiter(this, void 0, void 0, function* () {
            const personalItemService = this.createPersonalItemService(req);
            const anchor = new osa_personalitem_1.BaseAnchor({
                text: selectedText,
                anchorType: osa_personalitem_1.AnchorType.HighlightedText,
                highlightedAnchor: new osa_personalitem_1.HighlightedAnchor({
                    color: osa_personalitem_1.Color.Yellow,
                    selectedAnchor: new osa_personalitem_1.SelectedAnchor({
                        startLocation: new osa_personalitem_1.TextLocation({
                            elementId: startElementId,
                            offset: startElementOffset,
                        }),
                        endLocation: new osa_personalitem_1.TextLocation({
                            elementId: endElementId,
                            offset: endElementOffset,
                        }),
                    }),
                }),
            });
            const annotationParams = new osa_personalitem_1.Annotation({
                resource: new osa_personalitem_1.AnnotatedResourceLocator({
                    itemId: documentId,
                    itemType: osa_personalitem_1.AnnotatedResourceType.Document,
                }),
                baseAnchor: anchor,
                annotationText,
            });
            return personalItemService.annotations.add(annotationParams);
        });
    }
    static getAnnotations(req, documentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const personalItemService = this.createPersonalItemService(req);
            const annotationsParams = new osa_personalitem_1.GetResourceAnnotations({
                resource: new osa_personalitem_1.AnnotatedResourceLocator({
                    itemId: documentId,
                    itemType: osa_personalitem_1.AnnotatedResourceType.Document,
                }),
            });
            const resourceAnnotations = yield personalItemService.getResourceAnnotations(annotationsParams, {
                $expand: 'Annotations',
            });
            return resourceAnnotations.getAnnotations();
        });
    }
    static updateNote(req, { id, annotationText }) {
        return __awaiter(this, void 0, void 0, function* () {
            const personalItemService = this.createPersonalItemService(req);
            return personalItemService.updateAnnotationText(new osa_personalitem_1.UpdateAnnotationText({
                annotation: new osa_personalitem_1.AnnotationId({ id }),
                newAnnotationText: annotationText,
            }));
        });
    }
    static removeAnnotation(req, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const personalItemService = this.createPersonalItemService(req);
            return personalItemService.annotations.remove(id);
        });
    }
}
exports.AnnotationsDao = AnnotationsDao;
//# sourceMappingURL=annotations.dao.js.map
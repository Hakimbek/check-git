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
exports.serviceSubjectRelationRouter = void 0;
const express_1 = require("express");
const constants_1 = require("../../../config/constants");
const subject_relation_service_1 = require("./subject-relation.service");
function getSubjectRelationAPIMiddleware() {
    const router = express_1.Router();
    const service = subject_relation_service_1.getSubjectRelationService();
    function getSubjectRelation(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { query: { context, subject }, } = req;
                res.send(yield service.getSubjectRelation(req, context, subject));
            }
            catch (error) {
                res.status((_a = error.status) !== null && _a !== void 0 ? _a : constants_1.RESPONSE_STATUSES.INTERNAL_SERVER_ERROR).send({ error: error.message });
            }
        });
    }
    // Full API url:
    // path '/': /service/edge/services/arm/get-subject-relation
    router.get('/arm/get-subject-relation', getSubjectRelation);
    return {
        router,
        services: { subjectRelationService: service },
    };
}
exports.serviceSubjectRelationRouter = getSubjectRelationAPIMiddleware().router;
//# sourceMappingURL=subject-relation.route.js.map
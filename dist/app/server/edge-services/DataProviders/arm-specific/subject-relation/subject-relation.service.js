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
exports.getSubjectRelationService = void 0;
const subject_relation_dao_1 = require("./subject-relation.dao");
function getSubjectRelationService() {
    const DAO = subject_relation_dao_1.getSubjectRelationDAO();
    function getSubjectRelation(req, context, subject) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const searchResultItems = yield DAO.searchForUCMDocument(req, context, subject);
            const documentNodeId = yield DAO.getDocumentNodeId(req, (_a = searchResultItems[0]) === null || _a === void 0 ? void 0 : _a.modelDocumentId);
            return documentNodeId;
        });
    }
    return {
        getSubjectRelation,
    };
}
exports.getSubjectRelationService = getSubjectRelationService;
//# sourceMappingURL=subject-relation.service.js.map
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
exports.serviceTaskflowRouter = void 0;
const express_1 = require("express");
const taskflow_service_1 = require("./taskflow.service");
const constants_1 = require("../../config/constants");
const taskflowService = taskflow_service_1.getTaskflowService();
function getChecklistGroups(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { showAll } = req.query;
            const checklistGroups = yield taskflowService.getChecklistGroups(req, showAll);
            res.send({ checklistGroups });
        }
        catch (error) {
            res.status((_a = error.status) !== null && _a !== void 0 ? _a : constants_1.RESPONSE_STATUSES.INTERNAL_SERVER_ERROR).send({ error: error.message });
        }
    });
}
function archiveChecklistGroup(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.query;
            yield taskflowService.archiveChecklistGroup(req, id);
            res.send();
        }
        catch (error) {
            res.status((_a = error.status) !== null && _a !== void 0 ? _a : constants_1.RESPONSE_STATUSES.INTERNAL_SERVER_ERROR).send({ error: error.message });
        }
    });
}
function unarchiveChecklistGroup(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.query;
            res.send(yield taskflowService.unarchiveChecklistGroup(req, id));
        }
        catch (error) {
            res.status((_a = error.status) !== null && _a !== void 0 ? _a : constants_1.RESPONSE_STATUSES.INTERNAL_SERVER_ERROR).send({ error: error.message });
        }
    });
}
function deleteChecklist(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.query;
            yield taskflowService.deleteChecklist(req, id);
            res.send();
        }
        catch (error) {
            res.status((_a = error.status) !== null && _a !== void 0 ? _a : constants_1.RESPONSE_STATUSES.INTERNAL_SERVER_ERROR).send({ error: error.message });
        }
    });
}
function deleteChecklistGroup(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.query;
            yield taskflowService.deleteChecklistGroup(req, id);
            res.send();
        }
        catch (error) {
            res.status((_a = error.status) !== null && _a !== void 0 ? _a : constants_1.RESPONSE_STATUSES.INTERNAL_SERVER_ERROR).send({ error: error.message });
        }
    });
}
// Full API url:
// /service/edge/services/taskflow
const router = express_1.Router();
router.get('/get-checklist-groups', getChecklistGroups);
router.get('/archive-checklist-group', archiveChecklistGroup);
router.get('/unarchive-checklist-group', unarchiveChecklistGroup);
router.delete('/delete-checklist', deleteChecklist);
router.delete('/delete-checklist-group', deleteChecklistGroup);
exports.serviceTaskflowRouter = router;
//# sourceMappingURL=taskflow.routes.js.map
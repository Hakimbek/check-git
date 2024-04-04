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
exports.getTaskflowService = void 0;
const taskflow_dao_1 = require("./taskflow.dao");
const taskflow_constants_1 = require("./taskflow.constants");
function getTaskflowService() {
    const DAO = taskflow_dao_1.getTaskflowDAO();
    function getChecklistGroups(req, showAll) {
        return __awaiter(this, void 0, void 0, function* () {
            const [checklistGroupsRes, checklistsGroupsComments] = yield Promise.all([
                DAO.getChecklistGroups(req, showAll),
                getChecklistGroupComments(req),
            ]).catch(err => {
                throw err;
            });
            return checklistGroupsRes.map(group => {
                var _a;
                const newChecklists = (_a = group.checklists) === null || _a === void 0 ? void 0 : _a.map(checklist => (Object.assign(Object.assign({}, checklist), { commentCount: (checklistsGroupsComments === null || checklistsGroupsComments === void 0 ? void 0 : checklistsGroupsComments[checklist.id]) || 0 })));
                return Object.assign(Object.assign({}, group), { status: taskflow_constants_1.TASKFLOW_STATUS_TO_CHECKLIST_GROUP_STATUS_MAP[group.status] ||
                        taskflow_constants_1.TASKFLOW_STATUS_TO_CHECKLIST_GROUP_STATUS_MAP.notStarted, isCreatedByCurrentUser: group.isCreatedByCurrentUser || false, checklists: newChecklists || [] });
            });
        });
    }
    function archiveChecklistGroup(req, id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield DAO.archiveChecklistGroup(req, id);
        });
    }
    function unarchiveChecklistGroup(req, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield DAO.unarchiveChecklistGroup(req, id);
            const newTaskflowStatus = res.newStatus;
            if (!taskflow_constants_1.TASKFLOW_STATUS_TO_CHECKLIST_GROUP_STATUS_MAP[newTaskflowStatus]) {
                throw Error('New status is unknown');
            }
            return {
                newStatus: taskflow_constants_1.TASKFLOW_STATUS_TO_CHECKLIST_GROUP_STATUS_MAP[newTaskflowStatus],
            };
        });
    }
    function deleteChecklist(req, id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield DAO.deleteChecklist(req, id);
        });
    }
    function deleteChecklistGroup(req, id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield DAO.deleteChecklistGroup(req, id);
        });
    }
    // private
    function getChecklistGroupComments(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const checklistGroupCommentsRes = yield DAO.getChecklistGroupComments(req);
            return checklistGroupCommentsRes;
        });
    }
    return {
        getChecklistGroups,
        archiveChecklistGroup,
        unarchiveChecklistGroup,
        deleteChecklist,
        deleteChecklistGroup,
    };
}
exports.getTaskflowService = getTaskflowService;
//# sourceMappingURL=taskflow.service.js.map
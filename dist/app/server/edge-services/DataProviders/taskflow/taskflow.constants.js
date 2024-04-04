"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TASKFLOW_STATUS_TO_CHECKLIST_GROUP_STATUS_MAP = exports.TackflowChecklistGroupStatusEnum = exports.URL_PATTERN_ID_SUB_STR = exports.DELETE_CHECKLIST_GROUP_BY_ID_TF_API_PATTERN = exports.DELETE_CHECKLIST_BY_ID_TF_API_PATTERN = exports.UNARCHIVE_CHECKLIST_GROUP_BY_ID_TF_API_PATTERN = exports.ARCHIVE_CHECKLIST_GROUP_BY_ID_TF_API_PATTERN = exports.GET_ALL_CHECKLISTS_COMMENTS_COUNT_TF_API = exports.GET_ALL_CHECKLISTS_GROUP_TF_API = exports.TASKFLOW_GATEWAY_PATH = void 0;
const taskflow_1 = require("../../client-server/taskflow");
exports.TASKFLOW_GATEWAY_PATH = '/taskflow/api';
exports.GET_ALL_CHECKLISTS_GROUP_TF_API = '/integrations/fdca/v1/checklists-groups';
exports.GET_ALL_CHECKLISTS_COMMENTS_COUNT_TF_API = '/integrations/fdca/v1/comments/countAll';
exports.ARCHIVE_CHECKLIST_GROUP_BY_ID_TF_API_PATTERN = '/integrations/fdca/v1/checklists-groups/archive/{id}';
exports.UNARCHIVE_CHECKLIST_GROUP_BY_ID_TF_API_PATTERN = '/integrations/fdca/v1/checklists-groups/unarchive/{id}';
exports.DELETE_CHECKLIST_BY_ID_TF_API_PATTERN = '/integrations/fdca/v1/checklists/{id}';
exports.DELETE_CHECKLIST_GROUP_BY_ID_TF_API_PATTERN = '/integrations/fdca/v1/checklists-groups/{id}';
exports.URL_PATTERN_ID_SUB_STR = '{id}';
var TackflowChecklistGroupStatusEnum;
(function (TackflowChecklistGroupStatusEnum) {
    TackflowChecklistGroupStatusEnum["NOT_STARTED"] = "notStarted";
    TackflowChecklistGroupStatusEnum["IN_PROGRESS"] = "inProgress";
    TackflowChecklistGroupStatusEnum["COMPLETED"] = "completed";
    TackflowChecklistGroupStatusEnum["ARCHIVED"] = "archived";
})(TackflowChecklistGroupStatusEnum = exports.TackflowChecklistGroupStatusEnum || (exports.TackflowChecklistGroupStatusEnum = {}));
exports.TASKFLOW_STATUS_TO_CHECKLIST_GROUP_STATUS_MAP = {
    [TackflowChecklistGroupStatusEnum.NOT_STARTED]: taskflow_1.ChecklistGroupStatusEnum.NOT_STARTED,
    [TackflowChecklistGroupStatusEnum.IN_PROGRESS]: taskflow_1.ChecklistGroupStatusEnum.IN_PROGRESS,
    [TackflowChecklistGroupStatusEnum.COMPLETED]: taskflow_1.ChecklistGroupStatusEnum.COMPLETED,
    [TackflowChecklistGroupStatusEnum.ARCHIVED]: taskflow_1.ChecklistGroupStatusEnum.ARCHIVED,
};
//# sourceMappingURL=taskflow.constants.js.map
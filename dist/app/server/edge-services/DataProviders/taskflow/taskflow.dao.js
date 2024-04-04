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
exports.getTaskflowDAO = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const constants_1 = require("../../config/constants");
const taskflow_constants_1 = require("./taskflow.constants");
function getTaskflowDAO() {
    function getChecklistGroups(req, showAll) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiUrl = `${req.forwardedProto}://${req.forwardedHost}${taskflow_constants_1.TASKFLOW_GATEWAY_PATH}${taskflow_constants_1.GET_ALL_CHECKLISTS_GROUP_TF_API}`;
            const params = `showAll=${showAll}`;
            const response = yield node_fetch_1.default(`${apiUrl}?${params}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': req.headers.authorization,
                },
            });
            if (response.status !== constants_1.RESPONSE_STATUSES.SUCCESS) {
                yield handleTaskflowError(response);
            }
            return response.json();
        });
    }
    function archiveChecklistGroup(req, id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id) {
                throw Error('Id is required');
            }
            const path = getPath(taskflow_constants_1.ARCHIVE_CHECKLIST_GROUP_BY_ID_TF_API_PATTERN, id);
            const apiUrl = `${req.forwardedProto}://${req.forwardedHost}${taskflow_constants_1.TASKFLOW_GATEWAY_PATH}${path}`;
            const response = yield node_fetch_1.default(`${apiUrl}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': req.headers.authorization,
                },
            });
            if (response.status !== constants_1.RESPONSE_STATUSES.SUCCESS) {
                yield handleTaskflowError(response);
            }
        });
    }
    function unarchiveChecklistGroup(req, id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id) {
                throw Error('Id is required');
            }
            const path = getPath(taskflow_constants_1.UNARCHIVE_CHECKLIST_GROUP_BY_ID_TF_API_PATTERN, id);
            const apiUrl = `${req.forwardedProto}://${req.forwardedHost}${taskflow_constants_1.TASKFLOW_GATEWAY_PATH}${path}`;
            const response = yield node_fetch_1.default(`${apiUrl}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': req.headers.authorization,
                },
            });
            if (response.status !== constants_1.RESPONSE_STATUSES.SUCCESS) {
                yield handleTaskflowError(response);
            }
            return response.json();
        });
    }
    function getChecklistGroupComments(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiUrl = `${req.forwardedProto}://${req.forwardedHost}${taskflow_constants_1.TASKFLOW_GATEWAY_PATH}${taskflow_constants_1.GET_ALL_CHECKLISTS_COMMENTS_COUNT_TF_API}`;
            const response = yield node_fetch_1.default(`${apiUrl}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': req.headers.authorization,
                },
            });
            if (response.status !== constants_1.RESPONSE_STATUSES.SUCCESS) {
                yield handleTaskflowError(response);
            }
            return response.json();
        });
    }
    function deleteChecklist(req, id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id) {
                throw Error('Id is required');
            }
            const path = getPath(taskflow_constants_1.DELETE_CHECKLIST_BY_ID_TF_API_PATTERN, id);
            const apiUrl = `${req.forwardedProto}://${req.forwardedHost}${taskflow_constants_1.TASKFLOW_GATEWAY_PATH}${path}`;
            const response = yield node_fetch_1.default(`${apiUrl}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': req.headers.authorization,
                },
            });
            if (response.status !== constants_1.RESPONSE_STATUSES.SUCCESS) {
                yield handleTaskflowError(response);
            }
        });
    }
    function deleteChecklistGroup(req, id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id) {
                throw Error('Id is required');
            }
            const path = getPath(taskflow_constants_1.DELETE_CHECKLIST_GROUP_BY_ID_TF_API_PATTERN, id);
            const apiUrl = `${req.forwardedProto}://${req.forwardedHost}${taskflow_constants_1.TASKFLOW_GATEWAY_PATH}${path}`;
            const response = yield node_fetch_1.default(`${apiUrl}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': req.headers.authorization,
                },
            });
            if (response.status !== constants_1.RESPONSE_STATUSES.SUCCESS) {
                yield handleTaskflowError(response);
            }
        });
    }
    // private
    function getPath(urlPattern, id) {
        return urlPattern === null || urlPattern === void 0 ? void 0 : urlPattern.replace(taskflow_constants_1.URL_PATTERN_ID_SUB_STR, id);
    }
    function handleTaskflowError(res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (res.status === constants_1.RESPONSE_STATUSES.BAD_REQUEST) {
                const error = {};
                const response = yield res.json();
                error.message = (response === null || response === void 0 ? void 0 : response.message) || 'Bad request';
                error.status = res.status === constants_1.RESPONSE_STATUSES.BAD_REQUEST ? res.status : null;
                throw error;
            }
            throw Error('Bad request');
        });
    }
    return {
        getChecklistGroups,
        archiveChecklistGroup,
        unarchiveChecklistGroup,
        getChecklistGroupComments,
        deleteChecklist,
        deleteChecklistGroup,
    };
}
exports.getTaskflowDAO = getTaskflowDAO;
//# sourceMappingURL=taskflow.dao.js.map
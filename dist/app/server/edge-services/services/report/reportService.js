"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
const v4_1 = __importDefault(require("uuid/v4"));
const constants_1 = require("../../config/constants");
const externalDependencies_1 = require("../../externalDependencies");
const queueService_1 = require("../common/queueService");
const emailService_1 = __importDefault(require("../email/emailService"));
const topicListService_1 = __importDefault(require("../topics/topicListService"));
// NOTE: Right now service should work for one generation job
class ReportService {
    constructor() {
        this.uiHost = externalDependencies_1.vars.get('ui-host');
        this.storeDir = path_1.resolve(__dirname, '../..', constants_1.REPORTS_STORE_DIR);
        this.reportQueue = new queueService_1.QueueService();
    }
    isGenerationQueueFull() {
        return !!this.reportQueue.getLength();
    }
    sendTopicListCSVReport(req) {
        const fileName = this.generateRandomName();
        const { body: { emailList, waf }, } = req;
        externalDependencies_1.logService.info(constants_1.TOPIC_LIST_REPORT_START_GENERATION_PROCESS, { fileName });
        const requestData = this.getRequestData(req);
        this.reportQueue.pushPromiseAction(() => topicListService_1.default
            .getTopicList(requestData)
            .then(({ d: { results: topicList = [] } = {} } = {}) => {
            const stream = this.createFile(fileName);
            stream.write(`${constants_1.UTF_BOM}${constants_1.TOPIC_LIST_HEADER}`);
            topicList.forEach(({ Id }) => {
                this.reportQueue.pushPromiseAction(() => topicListService_1.default
                    .getTopicItem(Id, requestData)
                    .then(({ d: { Id: fullId, Title, Section: { results: sectionList }, }, }) => {
                    const summarySection = sectionList.find(({ Title: title }) => title === 'Summary');
                    if (summarySection) {
                        const { ContentItems: { results: [{ Body }], }, } = summarySection;
                        const summary = this.normalizeTopicSectionBody(Body);
                        if (summary.length) {
                            const topicId = this.removeTopicSetIdPrefix(fullId);
                            const reportLine = `"${[
                                Title,
                                this.createUiUri(topicId, waf),
                                topicId,
                                summary,
                            ].join('","')}"\n`;
                            stream.write(reportLine);
                        }
                    }
                })
                    .catch(() => {
                    externalDependencies_1.logService.error(constants_1.TOPIC_LIST_REPORT_CANNOT_GET_TOPIC_BY_ID, { fileName });
                }));
            });
            this.reportQueue.pushAction(() => {
                stream.close();
                externalDependencies_1.logService.info(constants_1.TOPIC_LIST_REPORT_GENERATION_SUCCESS, { fileName });
            });
            this.reportQueue.pushAction(() => {
                emailService_1.default.sendReport(emailList, fileName, requestData);
            });
        })
            .catch(() => {
            externalDependencies_1.logService.error(constants_1.TOPIC_LIST_REPORT_GENERATION_FAILD, { fileName });
        }));
    }
    normalizeTopicSectionBody(body) {
        return body
            .replace(constants_1.REGEXP_TAG_PATTERN, '')
            .replace(constants_1.REGEXP_EXTRA_SPACE_PATTERN, ' ')
            .replace(constants_1.REGEXP_AMPERSAND_PATTERN, '&')
            .replace(constants_1.REGEXP_DOUBLE_COMMA_PATTERN, '""')
            .trim();
    }
    removeTopicSetIdPrefix(id) {
        const [, topicId] = id.split('!');
        return topicId;
    }
    createUiUri(id, waf) {
        let uri = `${this.uiHost}/${constants_1.PROTECTED_END_POINT}?documentId=${id}`;
        if (waf) {
            uri += `&WAF=${waf}`;
        }
        return uri;
    }
    createFile(fileName, format = 'csv') {
        return fs_1.default.createWriteStream(`${this.storeDir}/${fileName}.${format}`, { autoClose: false });
    }
    generateRandomName() {
        return v4_1.default();
    }
    getRequestData(requestData) {
        return Object.assign(Object.assign({}, requestData), { forwardedAuthorization: `freemium ${constants_1.FREE_USER_NAME}` });
    }
}
exports.default = new ReportService();
//# sourceMappingURL=reportService.js.map
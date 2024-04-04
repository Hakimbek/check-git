"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const fs = __importStar(require("fs"));
const path_1 = require("path");
const notification = __importStar(require("@wk/osa-notification"));
const constants_1 = require("../../config/constants");
const externalDependencies_1 = require("../../externalDependencies");
const externalDependencies_2 = require("../../externalDependencies");
const osaService_1 = __importDefault(require("../common/osaService"));
// This service is configured only for topic report sending goals
class EmailService {
    constructor() {
        this.infoEmail = `CCH AnswerConnect Support<${externalDependencies_1.vars.get('infoEmailAdress')}>`;
        this.storeDir = path_1.resolve(__dirname, '../..', constants_1.REPORTS_STORE_DIR);
    }
    sendReport(emailsArray, fileName, requestData) {
        this.osaNotificationService = osaService_1.default.createDomainServiceInstance(constants_1.NOTIFICATION_DOMAIN_NAME, requestData);
        this.filePath = `${this.storeDir}/${fileName}.csv`;
        this.generateAttachmentId()
            .then(() => this.sendPreparedAttachment())
            .then(() => {
            const emailParams = this.generateEmailParams(emailsArray);
            return this.osaNotificationService.sendEmail(emailParams);
        })
            .then(result => {
            externalDependencies_2.logService.info(`Email was sent with result ${result[0].status.message}`);
        })
            .catch(err => {
            externalDependencies_2.logService.error('Email sending failed', err);
        });
    }
    generateEmailParams(emailsArray) {
        const { body, subject } = constants_1.DEFAULT_EMAIL_CONFIG;
        return new notification.SendEmail({
            to: emailsArray,
            body,
            subject,
            from: this.infoEmail,
            attachments: [
                new notification.AttachmentId({
                    id: this.attachmentId,
                }),
            ],
        });
    }
    generateAttachmentId(fileFormat = 'csv') {
        const { attachmentName, contentType } = constants_1.DEFAULT_EMAIL_CONFIG;
        const attachment = new notification.Attachment({
            title: `${attachmentName}.${fileFormat}`,
            mimeType: contentType,
        });
        return this.osaNotificationService.attachments
            .add(attachment)
            .then(attachmentInfo => {
            this.attachmentId = attachmentInfo.id;
        })
            .catch(err => {
            externalDependencies_2.logService.error('Attachment id generation failed', err);
            return Promise.reject(err);
        });
    }
    sendPreparedAttachment() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const attachmentResponse = yield this.osaNotificationService.attachments.one(this.attachmentId);
                const reportStream = yield this.readReport();
                // HACK: Notification domain 1.1.2 always return urls with https protocol
                if (externalDependencies_1.envUtils.isDevMode()) {
                    attachmentResponse['$url'] = attachmentResponse['$url'].replace('https', 'http');
                }
                return yield attachmentResponse.putMedia(reportStream, 'application/octet-stream', {
                    rejectUnauthorized: false,
                });
            }
            catch (err) {
                externalDependencies_2.logService.error('Attachment file sending failed', err);
                return Promise.reject(err);
            }
        });
    }
    readReport() {
        return new Promise((res, rej) => {
            fs.readFile(this.filePath, (err, data) => {
                err ? rej(err) : res(data);
            });
        });
    }
}
exports.default = new EmailService();
//# sourceMappingURL=emailService.js.map
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
const request = __importStar(require("request-promise-native"));
const constants_1 = require("../../config/constants");
const requestHeaders_1 = __importDefault(require("../../config/requestHeaders"));
const osaService_1 = __importDefault(require("../common/osaService"));
class TopicListService {
    getTopicList(requestData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.requestActionDecorator(osaService_1.default.getTopicListUrl(requestData), requestData);
        });
    }
    getTopicItem(topicId, requestData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.requestActionDecorator(osaService_1.default.getTopicUrl(topicId, requestData), requestData);
        });
    }
    requestActionDecorator(uri, requestData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { forwardedAuthorization, forwardedHost } = requestData;
            return request(Object.assign(Object.assign({}, constants_1.DEFAULT_REQUEST_CONFIG), { uri, headers: Object.assign(Object.assign({}, requestHeaders_1.default.getClientInfo()), { [constants_1.FORWARDED_AUTHORIZATION_HEADER_NAME]: forwardedAuthorization, [constants_1.UI_HOST_HEADER_NAME]: forwardedHost }) }));
        });
    }
}
exports.default = new TopicListService();
//# sourceMappingURL=topicListService.js.map
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCombinedDocumentData = exports.getConfigKey = void 0;
const DAO = __importStar(require("./shortify.dao.osa2"));
function getConfigKey(req, documentData) {
    return __awaiter(this, void 0, void 0, function* () {
        const configKey = yield DAO.getShortifyConfigKey(req, documentData);
        return configKey;
    });
}
exports.getConfigKey = getConfigKey;
function getCombinedDocumentData(req, key) {
    return __awaiter(this, void 0, void 0, function* () {
        const resolvedCombinedDocumentData = yield DAO.resolveShortifyConfigKey(req, key);
        return resolvedCombinedDocumentData;
    });
}
exports.getCombinedDocumentData = getCombinedDocumentData;
//# sourceMappingURL=shortify.service.js.map
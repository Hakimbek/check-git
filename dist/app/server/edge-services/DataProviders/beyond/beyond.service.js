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
exports.getBeyondService = void 0;
const beyond_dao_1 = require("./beyond.dao");
const commonUtils_1 = require("../../utils/commonUtils");
function getBeyondService() {
    const DAO = beyond_dao_1.getBeyondDAO();
    function harvest(req, harvestData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield DAO.harvest(req, harvestData);
        });
    }
    function retrieveAnswers(req, answersParams) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DAO.retrieveAnswers(req, answersParams);
        });
    }
    function warmEntitlementsCache(req) {
        return __awaiter(this, void 0, void 0, function* () {
            yield DAO.warmEntitlementsCache(req);
        });
    }
    function retrieveSuggestions(req, query, dictionary, beyondSearchScope) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!query || !dictionary)
                return [];
            try {
                const beyondSuggestions = yield DAO.retrieveSuggestions(req, query, beyondSearchScope);
                return [
                    {
                        dictionaryId: dictionary === null || dictionary === void 0 ? void 0 : dictionary.id,
                        suggestions: beyondSuggestions.map(item => {
                            var _a;
                            return ({
                                dictionaryId: dictionary === null || dictionary === void 0 ? void 0 : dictionary.id,
                                id: `${(_a = item.label) === null || _a === void 0 ? void 0 : _a.replace(new RegExp(' ', 'gi'), '-')}-${dictionary === null || dictionary === void 0 ? void 0 : dictionary.id}`,
                                label: commonUtils_1.removeTags(item.label),
                                formattedLabel: item.label,
                                refInfo: null,
                            });
                        }),
                    },
                ];
            }
            catch (_a) {
                return [];
            }
        });
    }
    return {
        harvest,
        retrieveAnswers,
        warmEntitlementsCache,
        retrieveSuggestions,
    };
}
exports.getBeyondService = getBeyondService;
//# sourceMappingURL=beyond.service.js.map
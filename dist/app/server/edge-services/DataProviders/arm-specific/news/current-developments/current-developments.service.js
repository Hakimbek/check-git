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
exports.getCurrentDevelopmentsService = void 0;
const current_developments_dao_osa2_1 = require("./current-developments.dao.osa2");
function getCurrentDevelopmentsService() {
    const currentDevelopmentsDAO = current_developments_dao_osa2_1.getCurrentDevelopmentsDAO();
    function _getAuthorsTree(req) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const authors = [];
            const realTree = yield currentDevelopmentsDAO.getWNCLastThreeMonthsItemsTree(req);
            (_b = (_a = realTree.nodes[0]) === null || _a === void 0 ? void 0 : _a.children) === null || _b === void 0 ? void 0 : _b.forEach(authorNode => {
                var _a;
                authors.push({
                    name: authorNode.title,
                    books: (_a = authorNode.children) === null || _a === void 0 ? void 0 : _a.map(bookNode => {
                        return {
                            title: bookNode.title,
                            disabled: false,
                            documents: [],
                        };
                    }),
                });
            });
            return authors;
        });
    }
    function getWNCLastThreeMonthsItems(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = [];
            let authors;
            const authorsPromise = _getAuthorsTree(req).catch(error => {
                errors.push('Cannot get Authors Tree: ' + error.message);
                return [];
            });
            let documents = [];
            const documentsPromise = currentDevelopmentsDAO.getWNCLastThreeMonthsItems(req, {}).catch(error => {
                errors.push('Cannot get documents: ' + error.message);
                return [];
            });
            let documentsOutsideSubscription = [];
            const documentsOutsideSubscriptionPromise = currentDevelopmentsDAO
                .getWNCLastThreeMonthsItemsOutsideSubscription(req, {})
                .catch(error => {
                errors.push('Cannot get documents outside subscription: ' + error.message);
                return [];
            });
            yield Promise.all([authorsPromise, documentsPromise, documentsOutsideSubscriptionPromise]).then(responses => {
                authors = responses[0];
                documents = responses[1];
                documentsOutsideSubscription = responses[2];
            });
            return {
                // do not filter/combine documents and the tree, leave this computation to client side
                authors: authors,
                documents: documents,
                allDocuments: documentsOutsideSubscription,
                errors: errors,
            };
        });
    }
    return {
        getWNCLastThreeMonthsItems,
    };
}
exports.getCurrentDevelopmentsService = getCurrentDevelopmentsService;
//# sourceMappingURL=current-developments.service.js.map
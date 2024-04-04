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
exports.newsUnsubscribe = exports.DeliveryConfigTypeByTemplateId = void 0;
var DeliveryConfigTypeByTemplateId;
(function (DeliveryConfigTypeByTemplateId) {
    DeliveryConfigTypeByTemplateId["NEWS"] = "template_alerting_html_WKCA-TAA-AC";
    DeliveryConfigTypeByTemplateId["SEARCH"] = "template_alerting_search_html_WKCA-TAA-AC";
})(DeliveryConfigTypeByTemplateId = exports.DeliveryConfigTypeByTemplateId || (exports.DeliveryConfigTypeByTemplateId = {}));
var ModelNames;
(function (ModelNames) {
    ModelNames["NEWS"] = "news";
    ModelNames["SEARCH"] = "search";
})(ModelNames || (ModelNames = {}));
const DAO = __importStar(require("./AlertingDAO.osa2"));
function getModel(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const basicModel = yield DAO.getBasicAlertModel(req);
        let modelItemsToDelete = [];
        const modelItemsToUnlink = [];
        const modelItemsToLink = [];
        const model = {};
        const getModel = (backendModel, isMerge = false) => {
            // The first element is the primary element. The others are deleted or merged with the first one.
            const mainModel = backendModel.shift();
            if (!isMerge) {
                modelItemsToDelete = [...modelItemsToDelete, ...backendModel];
            }
            else {
                backendModel.forEach(modelToMerge => {
                    modelToMerge.alertDefinitions.forEach(alertDefinitionToMerge => {
                        if (!mainModel.alertDefinitions.some(mainModelAlertDefinition => mainModelAlertDefinition.id === alertDefinitionToMerge.id)) {
                            mainModel.alertDefinitions.push(alertDefinitionToMerge);
                            modelItemsToLink.push({
                                deliveryConfiguration: mainModel.deliveryConfiguration,
                                alertDefinition: alertDefinitionToMerge,
                            });
                        }
                        modelItemsToUnlink.push({
                            deliveryConfiguration: modelToMerge.deliveryConfiguration,
                            alertDefinition: alertDefinitionToMerge,
                        });
                    });
                    modelItemsToDelete = [
                        ...modelItemsToDelete,
                        {
                            deliveryConfiguration: modelToMerge.deliveryConfiguration,
                            alertDefinitions: [],
                        },
                    ];
                });
            }
            return mainModel;
        };
        Object.keys(basicModel).forEach(templateId => {
            switch (templateId) {
                case DeliveryConfigTypeByTemplateId.NEWS:
                    model[ModelNames.NEWS] = getModel(basicModel[templateId]);
                    break;
                case DeliveryConfigTypeByTemplateId.SEARCH:
                    model[ModelNames.SEARCH] = getModel(basicModel[templateId], true);
                    break;
                default:
                    modelItemsToDelete = [...modelItemsToDelete, ...basicModel[templateId]];
            }
        });
        Promise.all(modelItemsToUnlink.map(modelItemToUnlink => this.alertingDAO.unlinkAlertDefinitionAndDeliveryConfiguration(req, modelItemToUnlink.alertDefinition, modelItemToUnlink.deliveryConfiguration)))
            .then(() => Promise.all(modelItemsToDelete.map(modelItemToDelete => this.alertingDAO.removeDeliveryConfigurationWithAlertDefinitions(req, modelItemToDelete))))
            .then(() => Promise.all(modelItemsToLink.map(modelItemToLink => this.alertingDAO.linkAlertDefinitionToDeliveryConfiguration(req, modelItemToLink.alertDefinition, modelItemToLink.deliveryConfiguration))));
        return model;
    });
}
function getNewsModel(req) {
    return getModel(req).then(fullModel => fullModel[ModelNames.NEWS] || {
        deliveryConfiguration: null,
        alertDefinitions: [],
    });
}
function newsUnsubscribe(req) {
    return getNewsModel(req).then(newsModel => DAO.removeDeliveryConfigurationWithAlertDefinitions(req, newsModel));
}
exports.newsUnsubscribe = newsUnsubscribe;
//# sourceMappingURL=AlertingService.js.map
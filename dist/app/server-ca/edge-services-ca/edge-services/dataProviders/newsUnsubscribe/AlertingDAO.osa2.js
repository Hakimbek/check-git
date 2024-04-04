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
exports.getBasicAlertModel = exports.removeDeliveryConfigurationWithAlertDefinitions = exports.removeAlertDefinitionList = exports.removeAlertDefinition = exports.linkAlertDefinitionToDeliveryConfiguration = exports.unlinkAlertDefinitionAndDeliveryConfiguration = exports.getAllDeliveryConfigurations = exports.getAllAlertingDefinitions = void 0;
const osa_alerting_1 = require("@wk/osa-alerting");
const { osaService } = require('@wk/acm-osa-service/edge-services');
const DELIVERY_CONFIG = 'DeliveryConfigs';
const lodash_1 = require("lodash");
function getAllAlertingDefinitions(req) {
    const alertingDomain = osaService.createDomainServiceInstance(osa_alerting_1.AlertingOsaService, 'Alerting', req);
    return alertingDomain.researchAlertDefinitions
        .many({ $expand: 'DeliveryConfigs' })
        .catch(() => []);
}
exports.getAllAlertingDefinitions = getAllAlertingDefinitions;
function getAllDeliveryConfigurations(req) {
    const alertingDomain = osaService.createDomainServiceInstance(osa_alerting_1.AlertingOsaService, 'Alerting', req);
    return alertingDomain.deliveryConfigurations.many().catch(() => []);
}
exports.getAllDeliveryConfigurations = getAllDeliveryConfigurations;
function unlinkAlertDefinitionAndDeliveryConfiguration(req, alertDefinition, deliveryConfiguration) {
    const alertingDomain = osaService.createDomainServiceInstance(osa_alerting_1.AlertingOsaService, 'Alerting', req);
    return alertingDomain.removeEntityLink(alertDefinition, DELIVERY_CONFIG, deliveryConfiguration);
}
exports.unlinkAlertDefinitionAndDeliveryConfiguration = unlinkAlertDefinitionAndDeliveryConfiguration;
function linkAlertDefinitionToDeliveryConfiguration(req, alertDefinition, deliveryConfiguration) {
    const alertingDomain = osaService.createDomainServiceInstance(osa_alerting_1.AlertingOsaService, 'Alerting', req);
    return alertingDomain.addEntityLink(alertDefinition, DELIVERY_CONFIG, deliveryConfiguration);
}
exports.linkAlertDefinitionToDeliveryConfiguration = linkAlertDefinitionToDeliveryConfiguration;
function removeAlertDefinition(req, id) {
    const alertingDomain = osaService.createDomainServiceInstance(osa_alerting_1.AlertingOsaService, 'Alerting', req);
    return alertingDomain.researchAlertDefinitions.remove(id);
}
exports.removeAlertDefinition = removeAlertDefinition;
function removeAlertDefinitionList(req, alertDefinitionList) {
    return Promise.all(alertDefinitionList === null || alertDefinitionList === void 0 ? void 0 : alertDefinitionList.map(alertDefinition => removeAlertDefinition(req, alertDefinition.id)));
}
exports.removeAlertDefinitionList = removeAlertDefinitionList;
function removeDeliveryConfigurationWithAlertDefinitions(req, modelItem) {
    return __awaiter(this, void 0, void 0, function* () {
        const alertingDomain = osaService.createDomainServiceInstance(osa_alerting_1.AlertingOsaService, 'Alerting', req);
        yield removeAlertDefinitionList(req, modelItem.alertDefinitions);
        return (modelItem.deliveryConfiguration.id &&
            alertingDomain.deliveryConfigurations.remove(modelItem.deliveryConfiguration.id));
    });
}
exports.removeDeliveryConfigurationWithAlertDefinitions = removeDeliveryConfigurationWithAlertDefinitions;
function getBasicAlertModel(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const [alertDefinitions, deliveryConfigurations] = yield Promise.all([
            getAllAlertingDefinitions(req),
            getAllDeliveryConfigurations(req),
        ]);
        const alertDefinitionsToDelete = [];
        // Since $expand cannot be used with deliveryConfiguration, the reverse mapping is performed.
        alertDefinitions.forEach(alertDefinition => {
            const mappedDeliveryConfiguration = deliveryConfigurations.find(deliveryConfiguration => { var _a; return (_a = alertDefinition === null || alertDefinition === void 0 ? void 0 : alertDefinition.deliveryConfigs) === null || _a === void 0 ? void 0 : _a.some(deliveryConfigurationFromAlertDefinition => deliveryConfiguration.id === deliveryConfigurationFromAlertDefinition.id); });
            if (mappedDeliveryConfiguration) {
                mappedDeliveryConfiguration.researchAlertDefinitions
                    ? mappedDeliveryConfiguration.researchAlertDefinitions.push(alertDefinition)
                    : (mappedDeliveryConfiguration.researchAlertDefinitions = [alertDefinition]);
            }
            else {
                alertDefinitionsToDelete.push(alertDefinition);
            }
        });
        // Since the number of alertDefinitions is very limited, it is necessary to remove non-linked elements.
        // In case of unsuccessful deletion the model creation is not blocked.
        Promise.all(alertDefinitionsToDelete.map(alertDefinitionToDelete => removeAlertDefinition(req, alertDefinitionToDelete.id))).catch(err => console.warn(err)); // No blocker for model creation
        return lodash_1.groupBy(deliveryConfigurations.map(deliveryConfiguration => {
            var _a;
            return ({
                deliveryConfiguration: new osa_alerting_1.DeliveryConfiguration({
                    id: deliveryConfiguration.id,
                    groupByInstance: deliveryConfiguration.groupByInstance,
                    templateId: deliveryConfiguration.templateId,
                    displayOptions: deliveryConfiguration.displayOptions,
                    recipients: deliveryConfiguration.recipients,
                    disabled: deliveryConfiguration.disabled,
                    timeZoneId: deliveryConfiguration.timeZoneId,
                    frequency: deliveryConfiguration.frequency,
                    schedule: deliveryConfiguration.schedule,
                }),
                alertDefinitions: ((_a = deliveryConfiguration.researchAlertDefinitions) === null || _a === void 0 ? void 0 : _a.map(researchAlertDefinition => new osa_alerting_1.ResearchAlertDefinition({
                    id: researchAlertDefinition.id,
                    name: researchAlertDefinition.name,
                    disabled: researchAlertDefinition.disabled,
                    alertContext: researchAlertDefinition.alertContext,
                    attributes: researchAlertDefinition.attributes,
                    query: researchAlertDefinition.query,
                }))) || [],
            });
        }), 'deliveryConfiguration.templateId');
    });
}
exports.getBasicAlertModel = getBasicAlertModel;
//# sourceMappingURL=AlertingDAO.osa2.js.map
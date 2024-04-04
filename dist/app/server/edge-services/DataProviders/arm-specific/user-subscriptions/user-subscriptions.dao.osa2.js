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
exports.getUserSubscriptions = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const edge_services_1 = require("@wk/acm-osa-service/edge-services");
const osa_personalitem_1 = require("@wk/osa-personalitem");
const externalDependencies_1 = require("../../../externalDependencies");
const getUserSubscriptions = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const osaPersonalItemService = edge_services_1.osaService.createDomainServiceInstance(osa_personalitem_1.PersonalitemOsaService, osa_personalitem_1.domain.name, req);
    try {
        const subscriptionsUrl = yield osaPersonalItemService.getToolUrl(new osa_personalitem_1.GetToolUrl({
            toolLink: `${externalDependencies_1.vars.get('ICAdminUrl')}manageEndUserProfileArmEndUserAdministration.do?GUID=${req.forwardedSub}&AtlasTicket=[{cc|session.user.ticket}]&cpid=${externalDependencies_1.vars.get('velvet-cpid')}&parameter=displaySubscriptions`,
        }));
        const subscriptions = yield node_fetch_1.default(subscriptionsUrl).then(res => res.text());
        if (!subscriptions) {
            return '';
        }
        return subscriptions;
    }
    catch (error) {
        console.log(error);
        throw new Error(error);
    }
});
exports.getUserSubscriptions = getUserSubscriptions;
//# sourceMappingURL=user-subscriptions.dao.osa2.js.map
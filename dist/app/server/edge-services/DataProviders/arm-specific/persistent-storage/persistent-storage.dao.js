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
exports.getPersistentStorageDAO = void 0;
const pick_1 = __importDefault(require("lodash/pick"));
const edge_services_1 = require("@wk/acm-osa-service/edge-services");
const osa_persistentstorage_1 = require("@wk/osa-persistentstorage");
function getPersistentStorageDAO() {
    function addItem(req, requestData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const persistentStorageService = edge_services_1.osaService.createDomainServiceInstance(osa_persistentstorage_1.PersistentstorageOsaService, osa_persistentstorage_1.domain.name, req);
                yield persistentStorageService.configurationItems.add(new osa_persistentstorage_1.ConfigurationItem({
                    info: new osa_persistentstorage_1.ConfigurationItemInfo({
                        name: requestData.info.name,
                        value: requestData.info.value,
                        option: requestData.info.option.map(item => new osa_persistentstorage_1.common.KeyValuePair({ key: item.key, value: item.value })),
                    }),
                }));
            }
            catch (error) {
                throw error;
            }
        });
    }
    function getAllItems(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const persistentStorageService = edge_services_1.osaService.createDomainServiceInstance(osa_persistentstorage_1.PersistentstorageOsaService, osa_persistentstorage_1.domain.name, req);
                const result = yield persistentStorageService.configurationItems.many();
                return result.map(item => pick_1.default(item, ['id', 'info']));
            }
            catch (error) {
                throw error;
            }
        });
    }
    function updateItems(req, requestData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const persistentStorageService = edge_services_1.osaService.createDomainServiceInstance(osa_persistentstorage_1.PersistentstorageOsaService, osa_persistentstorage_1.domain.name, req);
                const items = requestData.map(item => new osa_persistentstorage_1.ConfigurationItem({
                    id: item.id,
                    info: new osa_persistentstorage_1.ConfigurationItemInfo({
                        name: item.info.name,
                        value: item.info.value,
                        option: item.info.option.map(optionItem => new osa_persistentstorage_1.common.KeyValuePair({ key: optionItem.key, value: optionItem.value })),
                    }),
                }));
                yield persistentStorageService.configurationItems.update(items);
            }
            catch (error) {
                throw error;
            }
        });
    }
    return {
        getAllItems,
        addItem,
        updateItems,
    };
}
exports.getPersistentStorageDAO = getPersistentStorageDAO;
//# sourceMappingURL=persistent-storage.dao.js.map
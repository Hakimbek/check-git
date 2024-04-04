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
exports.ASDocumentEventDao = void 0;
const osa_useractivityhistory_1 = require("@wk/osa-useractivityhistory");
const osaService_1 = __importDefault(require("../../../../services/common/osaService"));
const as_document_event_constants_1 = require("./as-document-event.constants");
class ASDocumentEventDao {
    static getASDocumentEvents(req, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const userActivityHistoryService = osaService_1.default.createDomainServiceInstance(osa_useractivityhistory_1.domain.name, req);
            const getEventsParams = new osa_useractivityhistory_1.GetEvents({
                searchParameters: new osa_useractivityhistory_1.SearchParameters({
                    filter: [
                        new osa_useractivityhistory_1.Filter({
                            fieldName: 'action',
                            fieldValue: as_document_event_constants_1.AS_DOCUMENT_ACTION,
                            fieldType: osa_useractivityhistory_1.FieldType.String,
                        }),
                    ],
                    sorting: new osa_useractivityhistory_1.Sorting({
                        fieldName: 'created',
                        direction: osa_useractivityhistory_1.SortDirection.Descending,
                    }),
                    lang: osa_useractivityhistory_1.Lang.en,
                }),
                paginationParameters: new osa_useractivityhistory_1.Pagination({
                    top: 100,
                    skip: 0,
                }),
            });
            const events = yield userActivityHistoryService.getEvents(getEventsParams, {
                headers: { tenant: 'WKUS-TAL' },
                $filter: `Source eq '${as_document_event_constants_1.DOCUMENT_SOURCE_MAP[context]}'`,
            });
            return this.osaEventToEventDTO(events);
        });
    }
    static sendASDocumentEvent(req, eventData) {
        return __awaiter(this, void 0, void 0, function* () {
            const userActivityHistoryService = osaService_1.default.createDomainServiceInstance(osa_useractivityhistory_1.domain.name, req);
            const dataItems = [
                new osa_useractivityhistory_1.DataItem({
                    dataItemName: 'title',
                    dataItemValue: eventData.title,
                }),
                new osa_useractivityhistory_1.DataItem({
                    dataItemName: 'documentId',
                    dataItemValue: eventData.documentId,
                }),
                new osa_useractivityhistory_1.DataItem({
                    dataItemName: 'nodeId',
                    dataItemValue: eventData.nodeId,
                }),
            ];
            const event = new osa_useractivityhistory_1.Event({
                eventName: as_document_event_constants_1.AS_DOCUMENT_EVENT_NAME,
                action: as_document_event_constants_1.AS_DOCUMENT_ACTION,
                source: as_document_event_constants_1.DOCUMENT_SOURCE_MAP[eventData.context],
                visibility: osa_useractivityhistory_1.Visibility.user,
                ttl: -1,
                searchable: true,
                dataItems,
            });
            yield userActivityHistoryService.events.add(event, { headers: { tenant: 'WKUS-TAL' } });
        });
    }
    static osaEventToEventDTO(events) {
        return events.map(event => {
            const titleDataItem = event.dataItems.find(dataItem => dataItem.dataItemName === 'title');
            const documentIdDataItem = event.dataItems.find(dataItem => dataItem.dataItemName === 'documentId');
            const nodeIdDataItem = event.dataItems.find(dataItem => dataItem.dataItemName === 'nodeId');
            return {
                title: titleDataItem === null || titleDataItem === void 0 ? void 0 : titleDataItem.dataItemValue,
                documentId: documentIdDataItem === null || documentIdDataItem === void 0 ? void 0 : documentIdDataItem.dataItemValue,
                nodeId: nodeIdDataItem === null || nodeIdDataItem === void 0 ? void 0 : nodeIdDataItem.dataItemValue,
            };
        });
    }
}
exports.ASDocumentEventDao = ASDocumentEventDao;
//# sourceMappingURL=as-document-event.dao.js.map
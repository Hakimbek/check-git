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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const node_fetch_1 = __importDefault(require("node-fetch"));
const resource = __importStar(require("@wk/osa-resource"));
const proxyTopic_1 = __importDefault(require("./proxyTopic"));
const constants_1 = require("../../config/constants");
const requestHeaders_1 = __importDefault(require("../../config/requestHeaders"));
const externalDependencies_1 = require("../../externalDependencies");
const osaService_1 = __importDefault(require("../common/osaService"));
class TopicService {
    isTopicDiscoverable(topicId, requestData) {
        const resourceServiceInstance = osaService_1.default.createDomainServiceInstance(constants_1.RESOURCE_DOMAIN_NAME, requestData);
        const extendedMetadataRequest = new resource.GetExtendedMetadata({
            documents: [new resource.DocumentId({ id: topicId })],
            extendedMetadataFields: ['Discoverable'],
        });
        return resourceServiceInstance
            .getExtendedMetadata(extendedMetadataRequest)
            .then(extendedMetadata => lodash_1.chain(extendedMetadata[0])
            .get('metadata[0].objects')
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            .find({ name: 'discoverable' })
            .get('attributes')
            .find({ key: 'value' })
            .get('value')
            .value() === 'yes')
            .catch(err => {
            externalDependencies_1.logService.error(`Failed to get metadata of the following topic: ${topicId}: ${err.message}`, {});
            return false;
        });
    }
    getRealTopicId(topicId) {
        return topicId.split('!')[1];
    }
    makeTopicsRequest(req, res) {
        let reqBody = '';
        req.on('data', chunk => {
            reqBody += chunk.toString('utf8');
        }).on('end', () => {
            const parsedReqBody = JSON.parse(reqBody);
            const topicUrl = osaService_1.default.getTopicUrl(parsedReqBody.topicId, req);
            const options = {
                headers: requestHeaders_1.default.getClientInfo(),
                method: 'GET',
            };
            node_fetch_1.default(topicUrl, options)
                .then(response => response.json())
                .then((dataResponse) => {
                let truncatedTopic = null;
                const topicId = this.getRealTopicId(parsedReqBody.topicId);
                this.isTopicDiscoverable(topicId, req).then((isDiscoverable) => {
                    if (!isDiscoverable) {
                        try {
                            truncatedTopic = proxyTopic_1.default.getProxyTopic(dataResponse);
                        }
                        catch (err) {
                            externalDependencies_1.logService.error(`Failed to parse topic with id ${parsedReqBody.topicId}: ${err.message}`, { res });
                        }
                    }
                    const topicEntityString = truncatedTopic || dataResponse;
                    res.set({
                        'Content-Type': 'application/json',
                    })
                        .status(constants_1.RESPONSE_STATUSES.SUCCESS)
                        .send(topicEntityString);
                });
            })
                .catch(err => externalDependencies_1.logService.error('Topic request failed!', err));
        });
    }
    redirectTopicRequest(req, res) {
        const topicId = req.params.id;
        const topicUrl = osaService_1.default.getTopicUrl(topicId, req);
        const options = {
            headers: requestHeaders_1.default.getClientInfo(),
            method: 'GET',
        };
        node_fetch_1.default(topicUrl, options)
            .then(response => response.json())
            .then((dataResponse) => {
            const truncatedTopic = null;
            this.isTopicDiscoverable(this.getRealTopicId(topicId), req).then((isDiscoverable) => {
                if (!isDiscoverable) {
                    try {
                        dataResponse = proxyTopic_1.default.getProxyTopic(dataResponse);
                    }
                    catch (err) {
                        externalDependencies_1.logService.error(`Failed to parse topic with id ${topicId}: ${err.message}`, { res });
                    }
                }
                const topicEntityString = truncatedTopic || dataResponse;
                res.set({
                    'Content-Type': 'application/json',
                })
                    .status(constants_1.RESPONSE_STATUSES.SUCCESS)
                    .send(topicEntityString);
            });
        })
            .catch(err => externalDependencies_1.logService.error('Topic request failed!', err));
    }
}
exports.default = new TopicService();
//# sourceMappingURL=topicService.js.map
const request = require('request-promise-native');
const resource = require('@wk/osa-resource');
const osaService = require('../services/osaService');
const { RESOURCE_DOMAIN_NAME } = require('../config/appConfig');

const { wkVars } = require('./utils/vars.util');

class SeoDataService {
    constructor() {
        const gpd = wkVars.vars('gpd');
        this.host = gpd.host;
        this.checkDoc = gpd.checkDoc;
        this.metadataFields = {
            document: ['title', 'pubvol', 'primary-class', 'region', 'codeSecValue', 'condor:documentType'],
            topic: ['title', 'region', 'contextualization', 'root'],
        };
    }

    async getIndexRule(documentId, requestData) {
        return request({
            url: this.host + this.checkDoc + documentId,
            method: 'GET',
            headers: {
                CorrelationId: requestData.correlationId,
            },
        }).then(body => {
            const indexation = body.indexOf('status="true"') < 0 ? 'noindex' : 'index';

            return `${indexation}, nofollow`;
        });
    }

    async getDocumentInContext(documentId, stateType = 'document', requestData) {
        return osaService.createDomainServiceInstance(RESOURCE_DOMAIN_NAME, requestData).getDocumentInContext({
            document: new resource.DocumentId({
                id: documentId,
            }),
            extendedMetadataFields: this.metadataFields[stateType],
        });
    }
}

module.exports = new SeoDataService();

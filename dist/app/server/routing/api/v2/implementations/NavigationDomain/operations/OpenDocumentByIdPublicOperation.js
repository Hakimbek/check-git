const PublicApiOperation = require('./../../../definitions/operations/PublicOperation');
const Endpoint = require('./../../../definitions/common/Endpoint');
const openDocumentById = require('./commonTasks/openDocumentById');

class OpenDocumentByIdApiPublicOperation extends PublicApiOperation {
    constructor() {
        super();
        this.endpoints.push(new Endpoint('get', '/openDocumentById', ['documentId']));
    }

    async performTask(req, res) {
        await super.performTask(req, res);

        openDocumentById(req, res);
    }
}

module.exports = OpenDocumentByIdApiPublicOperation;

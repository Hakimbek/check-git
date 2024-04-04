const ProtectedApiOperation = require('./../../../definitions/operations/ProtectedOperation');
const Endpoint = require('./../../../definitions/common/Endpoint');
const openDocumentById = require('./commonTasks/openDocumentById');

class OpenDocumentByIdApiOperation extends ProtectedApiOperation {
    constructor() {
        super();
        this.endpoints.push(new Endpoint('get', '/openDocumentById', ['documentId']));
    }

    async performTask(req, res) {
        await super.performTask(req, res);

        openDocumentById(req, res);
    }
}

module.exports = OpenDocumentByIdApiOperation;

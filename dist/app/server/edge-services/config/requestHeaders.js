"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const externalDependencies_1 = require("./../externalDependencies");
const { default: { headers }, } = externalDependencies_1.vars.get('osaProductConfig');
const clientInfoHeaders = Object.assign({ 'accept': 'application/json;odata=verbose', 'accept-encoding': 'gzip, deflate, br' }, headers);
class RequestHeaders {
    getClientInfo() {
        return clientInfoHeaders;
    }
}
exports.default = new RequestHeaders();
//# sourceMappingURL=requestHeaders.js.map
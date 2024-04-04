"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VarsService = void 0;
const lodash_1 = require("lodash");
const fs = require('fs');
const path = require('path');
class VarsService {
    static getEnvFromProcessArgs() {
        const envParameter = '--env=';
        const env = (process.argv.find(arg => arg.startsWith(envParameter)) || '').replace(envParameter, '');
        return process.env.NODE_ENVIRONMENT || env;
    }
    static init() {
        VarsService.vars = lodash_1.merge({}, JSON.parse(fs.readFileSync(path.resolve(__dirname, 'vars/vars.json'))), JSON.parse(fs.readFileSync(path.resolve(__dirname, `vars/${VarsService.getEnvFromProcessArgs()}-vars.json`))));
    }
    static get(key) {
        return VarsService.getAllVars()[key];
    }
    static getAllVars() {
        if (!VarsService.vars) {
            VarsService.init();
        }
        return VarsService.vars;
    }
}
exports.VarsService = VarsService;
//# sourceMappingURL=varsService.js.map
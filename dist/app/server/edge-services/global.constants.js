"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vars = void 0;
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const wkVars = require(path.resolve(process.cwd(), 'server/services/utils/vars.util.js')).wkVars;
exports.vars = {
    get(key) {
        return wkVars.vars(key);
    },
};
//# sourceMappingURL=global.constants.js.map
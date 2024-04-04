const { wkVars } = require('../services/utils/vars.util');

const defaultParamsForAllTools = {
    cpid: wkVars.vars('velvet-cpid'),
    brand: wkVars.vars('product'),
};

module.exports = defaultParamsForAllTools;

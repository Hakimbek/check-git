const path = require('path');
const md5 = require('md5');
const wkVars = require('@wk/vars').wkVars;
const { getRootDir, getVarsFolder } = require('./env.util');
const defaultServerConstants = require('./../../defaultServerConstants');
const defaultCommonVarsService = require(path.resolve(getRootDir(), 'defaultConstants')).AppConstantsService(wkVars);
defaultCommonVarsService.addConfigs(defaultServerConstants);

// The second argument of init function is required to run the application
// with product parameter (e.g. 'npm run start-dev -- --product AC').
const wkVarsRouter = wkVars.init(getVarsFolder(), () => {});

const wkVarsHash = md5(JSON.stringify(wkVars.clientVars()));

function customizeWkVars() {
    return {
        ...wkVars,
        vars: defaultCommonVarsService.get,
    };
}

module.exports = {
    wkVars: customizeWkVars(),
    wkVarsRouter,
    wkVarsHash,
};

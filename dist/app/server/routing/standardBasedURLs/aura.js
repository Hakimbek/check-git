const url = require('url');
const auraJson = require('@wk/aura-json');
const { wkVars } = require('./../../services/utils/vars.util');
const productInfo = require('./../../services/utils/getPackageInfo')();
const logger = require('./../../services/loggerService');
const {
    LOGGING_LEVELS: { ERROR },
    FUNCTION_NAMES: { AURA },
    LOGGING_MESSAGES: { SETTING_REP_PROCESS_FAIL },
} = require('../../loggerConstants');

module.exports = router => {
    let auraConfig = wkVars.vars('server_auraConfig');
    try {
        auraConfig.tests.forEach(test => {
            const repositoryUrl = url.parse(test.repositoryUrl);

            if (repositoryUrl.hash === '#$%7BversionTag%7D') {
                // Replace ${versionTag} in hash
                const versionSplit = productInfo.version.split('.');
                repositoryUrl.hash = 'v' + versionSplit[0] + '.' + versionSplit[1];
                test.repositoryUrl = url.format(repositoryUrl);
            }
        });

        router.use(
            auraJson(req => {
                // ACUSUI-1170: workaround to delete :port from '--url' and '--env.urls.base' fields in aura.json file (TA team requirement)
                if (req.header('x-forwarded-port')) {
                    delete req.headers['x-forwarded-port'];
                }

                return auraConfig;
            })
        );
    } catch (error) {
        logger.log(ERROR, {
            message: SETTING_REP_PROCESS_FAIL,
            function: AURA,
            statusCode: error.status,
            stacktrace: error.stack,
        });
    }
};

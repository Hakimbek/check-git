const CsnServer = require('../server/classes/csnServer');
const { isHub, getSharedServicesDir } = require('../server/services/utils/env.util');
const cookieParser = require('cookie-parser');

global.sharedServices = {};
const loggerService = require('../server/services/loggerService');
const {
    LOGGING_LEVELS: { ERROR },
} = require('../server/loggerConstants');

const serverInstance = new CsnServer();

const serverStartArguments = isHub() ? [] : [void 0, process.cwd()];

serverInstance.app.use(cookieParser());

loggerService.init(serverInstance.app);

process.on('unhandledRejection', error => {
    loggerService.log(ERROR, `Unhandled promise rejection: ${error.message}`);
});

const initMiddlewares = require('../server/initMiddlewaresAndRoutes');

// require shared services
const sharedServicesDir = getSharedServicesDir();
require(sharedServicesDir + '/taxPrepPartnerDictionary/src/taxPrepPartnerDictionary');
require(sharedServicesDir + '/headingMetadataConfig/src/headingMetadataConfig');
require(sharedServicesDir + '/metadataService/src/metadataService');
require(sharedServicesDir + '/explanationService/src/explanationService');
require(sharedServicesDir + '/csnUtils/src/csnUtils');
require(sharedServicesDir + '/headingOperatorsService/src/headingOperatorsService');
require(sharedServicesDir + '/documentHeadingMapping/src/documentHeadingMapping');
require(sharedServicesDir + '/searchHeadingMapping/src/searchHeadingMapping');
require(sharedServicesDir + '/topicHeadingMapping/src/topicHeadingMapping');
require(sharedServicesDir + '/docHeadingExtractor/src/docHeadingExtractor');
require(sharedServicesDir + '/semanticUrl/src/semanticUrl');

initMiddlewares(serverInstance);

serverInstance.start(...serverStartArguments);

serverInstance.app.locals.injectedCookies = {};

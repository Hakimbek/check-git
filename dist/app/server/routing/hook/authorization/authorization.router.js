const express = require('express');
const { wkVars } = require('../../../services/utils/vars.util');
const {
    PRODUCT_ID_HEADER_NAME,
    CPID_HEADER_NAME,
    UI_HOST_HEADER_NAME,
    FORWARDED_HOST_HEADER_NAME,
} = require('../../../config/appConfig');
const logger = require('../../../services/loggerService');
const {
    LOGGING_LEVELS: { INFO },
} = require('../../../loggerConstants');
const STATUS_CODE_OK = 204;
const UPDATED_HEADERS_HEADER_NAME = 'update-headers';
const AXCESS_INTEGRATOR_HEADER_NAME = 'IntegratorKey';
const { AXCESS_INTEGRATOR_KEY } = process.env; // put integrator key directly for local development

const router = express.Router();
const {
    default: {
        clientInfo,
        headers: { [CPID_HEADER_NAME]: productId },
    },
} = wkVars.vars('osaProductConfig');
const { workspaceId } = wkVars.vars('beyond');
const env = wkVars.vars('env');
const isProdEnv = env === 'prod' || env === 'prod-ohio';

const commonClientHeadersList = Object.entries(clientInfo).map(([key, value]) => ({ key: `clientinfo.${key}`, value }));
const commonNamesOfUpdatedHeaders = `${commonClientHeadersList
    .map(item => item.key)
    .join('&')}&${PRODUCT_ID_HEADER_NAME}`;
const updatedHeadersVelvetHeader = {
    key: UPDATED_HEADERS_HEADER_NAME,
    value: commonNamesOfUpdatedHeaders,
};
const updatedHeadersOsaHeader = {
    key: UPDATED_HEADERS_HEADER_NAME,
    value: `${commonNamesOfUpdatedHeaders}&${FORWARDED_HOST_HEADER_NAME}`,
};

router.post('/axcess-integrator', (req, res) => {
    logger.logRequest(INFO, req, {
        message: `Test Axcess integrator key = ${AXCESS_INTEGRATOR_KEY}`,
        function: 'axcess-integrator hook',
        url: '/axcess-integrator',
        correlationId: req.correlationId,
    });
    res.set(UPDATED_HEADERS_HEADER_NAME, AXCESS_INTEGRATOR_HEADER_NAME);
    res.set(AXCESS_INTEGRATOR_HEADER_NAME, AXCESS_INTEGRATOR_KEY);
    res.sendStatus(STATUS_CODE_OK);
});

router.post('/product-headers', (req, res) => {
    const clientHeadersList = [...commonClientHeadersList];

    if (req.headers.resource.startsWith('/osa') || req.headers.resource.startsWith('/private-osa')) {
        res.set(FORWARDED_HOST_HEADER_NAME, req.get(UI_HOST_HEADER_NAME));
        clientHeadersList.push(updatedHeadersOsaHeader);
    } else {
        clientHeadersList.push(updatedHeadersVelvetHeader);
    }

    clientHeadersList.forEach(({ key, value }) => res.set(key, value));
    res.set(PRODUCT_ID_HEADER_NAME, req.get(CPID_HEADER_NAME) || productId);
    res.sendStatus(STATUS_CODE_OK);
});

router.all('/beyond', (_req, res) => {
    // this hook is only for Beyond requests from the UI
    // in case changing please add changes in beyond.dao.ts for requests from Node js too

    const localApiKey = isProdEnv ? process.env.BEYOND_API_KEY_PROD : process.env.BEYOND_API_KEY_NON_PROD;
    const awsApiKey = process.env.AWS_BEYOND_API_KEY || localApiKey;

    res.set('update-headers', 'x-workspace-id&x-authentication');
    res.set('x-workspace-id', workspaceId);
    res.set('x-authentication', `API-key ${awsApiKey}`);

    res.sendStatus(STATUS_CODE_OK);
});

module.exports = router;

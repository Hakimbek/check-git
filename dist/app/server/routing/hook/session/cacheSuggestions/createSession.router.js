const express = require('express');
const url = require('url');
const redisCreateSessionHandler = require('./RedisSessionHandlers/createSessionHandler');
const router = express.Router();
const nodeFetch = require('node-fetch');
const detectUserTypeService = require('../../../../services/detectUserTypeService');
const NO_CONTENT_OK_STATUS = 200;

router.post('/create_session', (req, res) => {
    // Don't use 'await' here, because we have to send response immediately
    res.sendStatus(NO_CONTENT_OK_STATUS);

    const loginEventAttributes = {
        userType: 'subscribed',
        eventType: 'AppEvent',
        action: 'login',
    };

    if (detectUserTypeService.isReferrerUser(req)) {
        loginEventAttributes.referrer = url.parse(req.body.targetUrl || '', true).query.referer;
    }

    // Don't use analyticsService as req object has not enough forwarded headers
    nodeFetch(`http://${req.headers.host}/service/edge/services/modular/kasandra/send-event`, {
        body: JSON.stringify({
            eventData: {
                code: 'login',
                attributes: loginEventAttributes,
            },
        }),
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
    }).catch(error => console.warn('Failed to send analytics event: ', error));

    redisCreateSessionHandler(req, res);
});

module.exports = router;

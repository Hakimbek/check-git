const express = require('express');
const router = express.Router();
const redisDeleteSessionHandler = require('./RedisSessionHandlers/deleteSessionHandler');
const armHooks = require('../arm-specific');
const NO_CONTENT_OK_STATUS = 200;

router.post('/delete_session', async (req, res) => {
    // Don't use 'await' here, because we have to send response immediately
    res.sendStatus(NO_CONTENT_OK_STATUS);
    redisDeleteSessionHandler(req, res);
    armHooks.concurrencyHooks.concurrencyLogoutHandler(req);
});

module.exports = router;

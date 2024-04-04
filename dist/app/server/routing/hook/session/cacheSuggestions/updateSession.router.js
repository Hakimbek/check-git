const express = require('express');
const router = express.Router();
const redisUpdateSessionHandler = require('./RedisSessionHandlers/createSessionHandler');
const NO_CONTENT_OK_STATUS = 200;

router.post('/update_session', async (req, res) => {
    // sending status has a top priority for hooks
    res.sendStatus(NO_CONTENT_OK_STATUS);
    redisUpdateSessionHandler(req, res, true);
});

module.exports = router;

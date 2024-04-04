const express = require('express');
const router = express.Router();

const createSession = require('./createSession.router');
const updateSession = require('./updateSession.router');
const deleteSession = require('./deleteSession.router');

router.use('/cache-suggestions', createSession);
router.use('/cache-suggestions', updateSession);
router.use('/cache-suggestions', deleteSession);

module.exports = router;

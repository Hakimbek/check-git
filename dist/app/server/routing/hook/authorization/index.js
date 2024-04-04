const express = require('express');
const router = express.Router();

const authorizationRouter = require('./authorization.router');

router.use('/authorization', authorizationRouter);

module.exports = router;

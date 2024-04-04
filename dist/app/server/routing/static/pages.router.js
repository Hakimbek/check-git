const express = require('express');
const router = express.Router();

const staticPagesMiddleware = require('./staticPagesMiddleware');

const urls = ['/license-agreement', '/welcome', '/logout', '/login/axcess'];

router.get(urls, staticPagesMiddleware);

module.exports = router;

const express = require('express');
const router = express.Router();

const cacheSuggestionsRoutes = require('./cacheSuggestions');

router.use('/session', cacheSuggestionsRoutes);

module.exports = router;

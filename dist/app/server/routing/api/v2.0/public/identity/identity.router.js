const express = require('express');
const authentification = require('../../../../../login/authentificationMiddleware');
const analyticsService = require('../../../../../services/analyticsService');

const router = express.Router();

const loginApiMiddleware = (req, res, next) => {
    analyticsService.trackExternalIncomeEvent(req, res);

    if (!req.query.target_url) {
        req.query.target_url = '/';
    }
    next();
};

router.get('/login', loginApiMiddleware, authentification);

module.exports = router;

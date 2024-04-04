const express = require('express');

const SUCCESS_STATUS = 200;
const router = express.Router();

const healthCheckHandler = (req, res) => {
    res.sendStatus(SUCCESS_STATUS);
};

router.get('/', healthCheckHandler);

module.exports = router;

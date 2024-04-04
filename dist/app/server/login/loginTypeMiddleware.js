const registeredMiddleware = require('./registeredMiddleware');
const detectUserTypeService = require('../services/detectUserTypeService');

module.exports = (req, res, next) => {
    if (detectUserTypeService.isFreemium(req)) {
        next();

        return;
    }
    registeredMiddleware(req, res, next);
};

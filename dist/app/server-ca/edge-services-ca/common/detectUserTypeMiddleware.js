const detectUserTypeService = require('../services/detectUserTypeService');
module.exports = (req, _res, next) => {
    req.userType = detectUserTypeService.getUserType(req);
    next();
};
//# sourceMappingURL=detectUserTypeMiddleware.js.map
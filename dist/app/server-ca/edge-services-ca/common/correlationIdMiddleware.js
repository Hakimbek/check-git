"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
module.exports = (req, res, next) => {
    req.correlationId =
        req.correlationId ||
            req.query.correlationId ||
            (req.cookies && req.cookies.redirectCorrelationId) ||
            req.headers.correlationid ||
            uuid_1.v4();
    res.setHeader('correlationid', req.correlationId);
    // During redirect to home page we can't save correlationId in headers
    // So we have to set correlationId to cookies and clear it after redirect
    if (req.cookies && req.cookies.redirectCorrelationId) {
        res.clearCookie('redirectCorrelationId');
    }
    next();
};
//# sourceMappingURL=correlationIdMiddleware.js.map
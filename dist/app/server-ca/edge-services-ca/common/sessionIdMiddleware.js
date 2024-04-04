"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const varsService_1 = require("../services/varsService");
const crypto = require('crypto');
const jwtDecode = require('jwt-decode');
const cookieService = require('../services/cookieService');
const sessionIdName = varsService_1.VarsService.get('reactSessionKey');
const salt = process.env.SESSION_SECRET;
module.exports = (req, res, next) => {
    if (req.forwardedSession) {
        cookieService.addPersistentCookies(res, sessionIdName, crypto
            .createHash('sha3-512')
            .update(`${salt}.${jwtDecode(req.forwardedSession).sid}.${salt}`)
            .digest('base64url'), 1);
    }
    next();
};
//# sourceMappingURL=sessionIdMiddleware.js.map
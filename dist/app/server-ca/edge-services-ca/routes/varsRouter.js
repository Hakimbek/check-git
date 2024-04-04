"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.varsRouter = void 0;
const express_1 = require("express");
const varsService_1 = require("../services/varsService");
const router = express_1.Router();
router.get('/', (_req, res) => {
    res.setHeader('Content-Type', 'text/javascript');
    res.send(`var wkVars = ${JSON.stringify(varsService_1.VarsService.getAllVars())}`);
});
exports.varsRouter = router;
//# sourceMappingURL=varsRouter.js.map
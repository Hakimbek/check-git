"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceDocumentAPIRouter = void 0;
const express_1 = require("express");
const Info_1 = require("./Info");
const TypeIndicator_1 = require("./TypeIndicator");
const disableCacheMiddleware_1 = require("../../middlewares/disableCacheMiddleware");
const router = express_1.Router();
router.use(disableCacheMiddleware_1.disableCache);
router.use('/type-indicator', TypeIndicator_1.serviceDocumentTypeIndicatorRouter);
router.use('/info', Info_1.serviceDocumentInfoRouter);
exports.serviceDocumentAPIRouter = router;
//# sourceMappingURL=DocumentRoute.js.map
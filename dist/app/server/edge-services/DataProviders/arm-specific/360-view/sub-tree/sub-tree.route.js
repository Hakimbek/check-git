"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubTreeMiddleware = void 0;
const express_1 = require("express");
const arm_data_providers_constants_1 = require("../../arm.data-providers.constants");
const sub_tree_servise_1 = require("./sub-tree.servise");
function getSubTreeMiddleware() {
    const router = express_1.Router();
    const subTreeService = new sub_tree_servise_1.SubTreeService();
    router.get('/get-sub-tree', (req, resp) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { nodeId } = req.query;
            const decodedNodeId = decodeURIComponent(nodeId);
            const subTree = yield subTreeService.getSubTree(req, decodedNodeId);
            resp.setHeader('Content-Type', 'application/json');
            resp.status(arm_data_providers_constants_1.RESPONSE_STATUSES.SUCCESS).send(subTree);
        }
        catch (error) {
            resp.status(arm_data_providers_constants_1.RESPONSE_STATUSES.INTERNAL_SERVER_ERROR).send(error);
        }
    }));
    return {
        router,
        services: { subTreeService: subTreeService }
    };
}
exports.getSubTreeMiddleware = getSubTreeMiddleware;
//# sourceMappingURL=sub-tree.route.js.map
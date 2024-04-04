"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTrialUserRoute = void 0;
const createTrialUserService_1 = require("../services/createTrialUserService/createTrialUserService");
class CreateTrialUserRoute {
    static trialRegisterHandler(req, res) {
        createTrialUserService_1.CreateTrialUserService.createTrialUser(req, res);
    }
    static middleware(req, res, next) {
        next();
    }
}
exports.CreateTrialUserRoute = CreateTrialUserRoute;
//# sourceMappingURL=createTrialUserRoute.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const edge_services_1 = require("./edge-services");
const externalDependencies_1 = require("./edge-services/externalDependencies");
const varsRouter_1 = require("./routes/varsRouter");
const disableCacheMiddleware_1 = require("./edge-services/middlewares/disableCacheMiddleware");
const trialUserRoute_1 = require("./routes/trialUserRoute");
const bodyParser = require('body-parser');
const path = require('path');
const express = require('express');
const fs = require('fs');
const port = process.env.PORT || 8888;
const app = express();
const cookieParser = require('cookie-parser');
const forwardedMiddleware = require('./common/forwardedMiddleware');
const securityMiddleware = require('./common/securityMiddleware');
const correlationIdMiddleware = require('./common/correlationIdMiddleware');
const sessionIdMiddleware = require('./common/sessionIdMiddleware');
const detectUserTypeMiddleware = require('./common/detectUserTypeMiddleware');
const appLangMiddleware = require('./common/appLangMiddleware');
const licenseAgreementMiddleware = require('./common/licenseAgreementMiddleware');
const registeredMiddleware = require('./common/registeredMiddleware');
const compressionMiddleware = require('./common/compressionMiddleware');
const enableCacheMiddleware = require('./common/enableCacheMiddleware');
const indexFile = fs.readFileSync(path.resolve(__dirname, '../public/static/index.html')).toString();
process.on('unhandledRejection', (reason, promise) => {
    externalDependencies_1.logService.error(`Unhandled Rejection at: ${promise}. Reason: ${reason})`);
});
process.on('uncaughtException', err => {
    externalDependencies_1.logService.error(`Uncaught Exception. Error: ${err}`);
    process.exit(); // exit the process to avoid unknown state
});
app.disable('x-powered-by');
app.use(cookieParser());
app.use('/', securityMiddleware, forwardedMiddleware, correlationIdMiddleware, detectUserTypeMiddleware, appLangMiddleware);
// serve static assets normally
app.use(compressionMiddleware, enableCacheMiddleware, express.static(path.resolve(__dirname, '../public/static'), { index: false }));
app.get('/health_check', (_request, response) => {
    response.sendStatus(200);
});
app.use('/static/vars', varsRouter_1.varsRouter);
app.use('/service/edge/services', edge_services_1.servicesAPIRouter);
app.use('/trialUser', bodyParser.json(), trialUserRoute_1.trialUserRouter);
// handle every other route with index.html, which will contain
// a script tag to your application's JavaScript file(s).
app.get('*', registeredMiddleware, licenseAgreementMiddleware, sessionIdMiddleware, disableCacheMiddleware_1.disableCache, (request, response) => {
    response.send(indexFile.replace('<$=userType$>', request.userType));
});
app.listen(port);
console.log('server started on port ' + port);
exports.default = app;
//# sourceMappingURL=main.js.map
const url = require('url');
const analyticsService = require('../../../services/analyticsService');
const protectedFlow = require('../../../login/protectedMiddleware');
const externalResolver = require('./externalResolver');
const correlationIdMiddleware = require('../../../common/correlationIdMiddleware');

module.exports = function (router) {
    router.use('/', correlationIdMiddleware, (req, res, next) => {
        const parsedUrl = url.parse(req.originalUrl, true);

        if (req.query.AtlasTicket || req.query.linksource || req.query.redirect || req.path.indexOf('extlink') > -1) {
            const isApi20 = req.originalUrl.match('/api/2.0');

            analyticsService.trackExternalIncomeEvent(req, res);

            req.skipExternalIncomeEventAfterLogin = true;

            if (isApi20) {
                req.skipExternalIncomeEvent = true;

                return next();
            }

            protectedFlow(req, res, next);
        } else if (parsedUrl.query.specUrl) {
            // logic of spec urls detection, parsedUrl.query.specUrl is just test field
            protectedFlow(req, res, specialRouteTestCallback.bind(null, res));
        } else {
            next();
        }
    });

    externalResolver(router);
};

// temporary replacment for next() call in protected flow to test specUrl params
function specialRouteTestCallback(res) {
    res.write(`
        <html>
            <body>
                <h1>specUrl flow</h1>
            </body>
        </html>
    `);

    res.end();
}

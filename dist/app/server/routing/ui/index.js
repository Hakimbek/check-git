const applicationRouter = require('./application.router');
const seoInjectionRouter = require('./seoInjection.router');

module.exports = router => {
    router.use(seoInjectionRouter, applicationRouter);
};

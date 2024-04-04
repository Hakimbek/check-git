const NavigationApiDomain = require('./implementations/NavigationDomain/NavigationDomain');

module.exports = function (router) {
    const apiDomains = {
        navigationDomain: new NavigationApiDomain(),
    };

    router.use('/2.0', apiDomains.navigationDomain.router);
};

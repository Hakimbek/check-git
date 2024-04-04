const { wkVars } = require('../../services/utils/vars.util');

module.exports = function (req, res, next) {
    const redirectUrls = wkVars.vars('csn.support');

    const fallbackUrlsData = [
        {
            path: '/guidelines',
            redirectUrl: redirectUrls.helpCenter,
        },
        {
            path: '/walkthrough',
            redirectUrl: redirectUrls.helpCenter,
        },
    ];

    const fallbackUrlData = fallbackUrlsData.find(fallbackUrl => req.url === fallbackUrl.path);

    if (fallbackUrlData) {
        return res.redirect(fallbackUrlData.redirectUrl);
    }

    return next();
};

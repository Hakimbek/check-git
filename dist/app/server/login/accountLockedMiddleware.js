const noAccessPageFlow = require('../common/noAccessMiddleware');
const subscriptionService = require('../services/subscriptionService');

module.exports = async function accountLockedMiddleware(req, res, next) {
    const accountIsLocked = await subscriptionService.isAccountLocked(req);

    if (accountIsLocked) {
        noAccessPageFlow(req, res, next);
    } else {
        next();
    }
};

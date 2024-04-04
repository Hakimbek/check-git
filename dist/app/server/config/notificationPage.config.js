const { wkVars } = require('../services/utils/vars.util');
const NOTIFICATION_PREFIX = wkVars.vars('serverNotificationUrl');

const NOTIFICATION_TYPES = ['noaccess', 'loginerror', 'fullysuspended'];

NOTIFICATION_TYPES.forEach(item => {
    const type = item.toUpperCase();
    module.exports[`${type}_NOTIFICATION_URL`] = `${NOTIFICATION_PREFIX}/${item}`;
    module.exports[`${type}_NOTIFICATION_TYPE`] = item;
});

module.exports.NOTIFICATION_TYPES = NOTIFICATION_TYPES;
module.exports.ERROR_NOTIFICATION_URL = '/';

const _ = require('lodash');

const TRACKING_PARAMS = ['linksource', 'linkcontext', 'appcue'];

class TrackingParams {
    getAnalyticsParamsFromRequest(req) {
        return _.pick(req.query, TRACKING_PARAMS);
    }
}

module.exports = TrackingParams;

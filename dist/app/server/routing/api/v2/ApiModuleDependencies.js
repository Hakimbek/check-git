class ApiModuleDependencies {
    constructor() {
        this.loggerConstants = require('../../../loggerConstants');
        this.wkVars = require('../../../services/utils/vars.util').wkVars;
        this.logger = require('../../../services/loggerService');
        this.osa = require('../../../services/osaService');
        this.durationTrackingService = require('../../../services/durationTrackingService');
        this.subscriptionService = require('../../../services/subscriptionService');
        this.analyticsService = require('../../../services/analyticsService');
        this.notificationPageConfig = require('../../../config/notificationPage.config');
        this.appConfig = require('../../../config/appConfig');
    }
}

module.exports = new ApiModuleDependencies();

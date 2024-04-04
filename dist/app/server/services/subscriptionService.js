const osaService = require('./osaService');
const logger = require('./loggerService');
const { wkVars } = require('./utils/vars.util');
const durationTrackingService = require('./durationTrackingService');
const {
    LOGGING_LEVELS: { ERROR, INFO },
    FUNCTION_NAMES: { GET_PREFERENCE },
    LOGGING_MESSAGES: { PREFERENCES_REQ_FAIL, PREFERENCES_REQ_SUCCESS },
} = require('../loggerConstants');

const {
    IDENTITY_DOMAIN_NAME,
    PERSONALITEM_DOMAIN_NAME,
    URM_DOMAIN_NAME,
    CPID_HEADER_NAME,
} = require('../config/appConfig');

const IP_LICENSE_AGREEMENT_AMR = 'IP';
const LICENSE_AGREEMENT_AMR_LIST = [IP_LICENSE_AGREEMENT_AMR, 'UsernameAndPassword', 'Referrer'];
const LICENSE_AGREEMENT_AUTHORITY_LIST = ['ICAdminCompositeIDP', 'ICAdminODataAdapter'];
const MAX_RIGHTS_RESULTS_SIZE = 4000;
const INITIAL_EXPAND_STEP = 1;

class SubscriptionService {
    constructor() {
        this._acProductId = wkVars.vars('osaProductConfig').default.headers[CPID_HEADER_NAME];
    }

    async _getProductList(requestData) {
        return osaService
            .createDomainServiceInstance(IDENTITY_DOMAIN_NAME, requestData)
            .products.many()
            .then(
                products => products.map(item => item.id),
                () => []
            );
    }

    async hasAccessToProduct(requestData) {
        return this._getProductList(requestData).then(productList => productList.includes(this._acProductId));
    }

    async _getRights(requestData) {
        const rights = await osaService.createDomainServiceInstance(URM_DOMAIN_NAME, requestData).rights.many();

        if (rights.hasNext) {
            return this._expandRights(rights, INITIAL_EXPAND_STEP);
        }

        return rights;
    }

    async _expandRights(initialRightsRef, step, rightsSum) {
        const self = this;

        if (step === INITIAL_EXPAND_STEP) {
            rightsSum = initialRightsRef;
        }

        if (initialRightsRef.hasNext) {
            const expandedRights = await initialRightsRef.next({ $skip: step * MAX_RIGHTS_RESULTS_SIZE });
            rightsSum = rightsSum.concat(expandedRights);

            return expandedRights.hasNext ? self._expandRights(initialRightsRef, ++step, rightsSum) : rightsSum;
        }

        return rightsSum;
    }

    async isOperationPermitted(rightIds, requestData) {
        const userRightsIDs = await this._getRights(requestData);

        return rightIds.every(userOperationRight =>
            userRightsIDs.some(
                ({ id, type: { searchable, unpaid } }) => id === userOperationRight && searchable && !unpaid
            )
        );
    }

    async isAccountLocked(requestData) {
        return this._getRights(requestData)
            .then(() => false)
            .catch(() => true);
    }

    async getPreference(key, requestData) {
        const getPreferenceId = durationTrackingService.start();
        const { forwardedSub: userId = 'no_userId' } = requestData;
        let getPreferenceDuration;

        try {
            const preferences = await osaService
                .createDomainServiceInstance(PERSONALITEM_DOMAIN_NAME, requestData)
                .preferences.many({ $filter: `Id eq '${key}'` });
            getPreferenceDuration = durationTrackingService.end(getPreferenceId);
            logger.log(INFO, {
                message: PREFERENCES_REQ_SUCCESS,
                function: GET_PREFERENCE,
                correlationId: requestData.correlationId,
                userId,
                duration: getPreferenceDuration,
            });

            return preferences.shift();
        } catch (error) {
            getPreferenceDuration = durationTrackingService.end(getPreferenceId);
            logger.log(ERROR, {
                message: PREFERENCES_REQ_FAIL,
                function: GET_PREFERENCE,
                correlationId: requestData.correlationId,
                userId,
                duration: getPreferenceDuration,
                statusCode: error.status,
                stacktrace: error.stack,
            });

            return undefined;
        }
    }

    checkShowLicenseAgreementByUserType(amr, authority) {
        const isIPPromptUser = amr.includes(IP_LICENSE_AGREEMENT_AMR) && !amr.includes('Anonymous');
        const isSpecialUser = LICENSE_AGREEMENT_AMR_LIST.some(item => amr.includes(item));
        const isFederatedUser = LICENSE_AGREEMENT_AUTHORITY_LIST.includes(authority);

        return (isIPPromptUser || !isSpecialUser) && !isFederatedUser;
    }

    checkShowLicenseAgreementByPreference(preference) {
        return !preference || preference.value !== wkVars.vars('licenseAgreementValue').toString();
    }
}

module.exports = new SubscriptionService();

const express = require('express');
const url = require('url');
const wkVars = require('../../../../services/utils/vars.util').wkVars;
const analyticsService = require('../../../../services/analyticsService');

const WAF_PARAM_NAME = wkVars.vars('WAFParamName');
const SKIP_EXTERNAL_INCOME_EVENT_QUERY_FLAG = wkVars.vars('skipExternalIncomeEventQueryFlag');

const router = express.Router({ caseSensitive: true });

router.get('/cfactors/:returnType/:year/:complexityFactorName', (req, res) => {
    const wafParam = req.query[WAF_PARAM_NAME];
    const protectedPopupUrl = url.format({
        query: {
            ...req.query,
            [SKIP_EXTERNAL_INCOME_EVENT_QUERY_FLAG]: true,
        },
        pathname: url
            .parse(req.originalUrl)
            .pathname.replace('/cfactors', wafParam ? '/cfactors-oneid' : '/cfactors-idaas'),
    });

    analyticsService.trackExternalIncomeEvent(req, res, { isExternalUser: true });
    analyticsService.trackCustomEvent({
        eventName: 'axcessComplexityFactorsPopupLoaded',
        req,
        isExternalUser: true,
    });

    res.redirect(protectedPopupUrl);
});

module.exports = router;

const detectUserTypeService = require('../services/detectUserTypeService');
const wkVars = require('../services/utils/vars.util').wkVars;

const WAF_PARAM_NAME = wkVars.vars('WAFParamName');
const forbiddenWafParams = wkVars.vars('forbiddenWafParams');

function setWafParamToResponseLocals(req, res) {
    let wafParam = req.query[WAF_PARAM_NAME];

    // ACUS-3684: take available WAF parameter from token for Big4 environments
    if (!wafParam) {
        const isCurrentWafParamForbidden = forbiddenWafParams.some(wafParam => wafParam === req.forwardedAuthority);

        wafParam = !isCurrentWafParamForbidden ? req.forwardedAuthority : '';
    }

    res.locals.wafParam = wafParam;
}

module.exports = async (req, res, next) => {
    res.locals.userType = await detectUserTypeService.getUserType(req);
    setWafParamToResponseLocals(req, res);

    next();
};

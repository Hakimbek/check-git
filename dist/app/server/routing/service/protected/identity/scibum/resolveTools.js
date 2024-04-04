const osaRedirectTools = require('../../../middleware/osaRedirectTools');

module.exports = router => {
    router.get('/resolveTools', osaRedirectTools);
};

const i18n = require('i18n');
const envUtils = require('../services/utils/env.util');

const i18nConfig = {
    init: function () {
        i18n.configure({
            prefix: 'lang-',
            directory: envUtils.getLangFolder(),
        });
    },
};

module.exports = i18nConfig;

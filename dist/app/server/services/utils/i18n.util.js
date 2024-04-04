const i18n = require('i18n');
const env = require('./env.util');
const path = require('path');

const langPath = env.isHub() ? path.join(process.cwd(), '/public/static/lang') : path.join(process.cwd(), '/lang');

i18n.configure({
    prefix: 'lang-',
    directory: langPath,
});

module.exports = i18n;

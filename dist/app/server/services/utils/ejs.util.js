const ejs = require('ejs');
const path = require('path');

ejs.delimiter = '$';
ejs.async = true;
ejs.root = path.resolve(process.cwd(), './server/tpl');

module.exports = ejs;

const path = require('path');

const csnPckgJsonPath = path.resolve(__dirname, '../../../csn.pckg.json');
const csnPckgJson = require(csnPckgJsonPath);

module.exports = () => csnPckgJson;

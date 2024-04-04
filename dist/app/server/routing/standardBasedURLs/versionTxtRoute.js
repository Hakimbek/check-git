const path = require('path');
const { getPublicDir, isHub } = require('../../services/utils/env.util');
const { VERSIONS_PAGE_NAME } = require('../../config/appConfig');
const ProductInfo = require('../../classes/csnProductInfo');

module.exports = function (router) {
    let productInfo = null;
    let versionsStr = '';

    if (!isHub()) {
        productInfo = new ProductInfo(process.cwd());
        versionsStr = productInfo.getVersionsStr();
    }

    router.get(`/_${VERSIONS_PAGE_NAME}`, (req, res) => {
        if (!isHub()) {
            res.send(versionsStr);
        } else {
            res.sendFile(path.resolve(getPublicDir(), VERSIONS_PAGE_NAME));
        }
    });
};

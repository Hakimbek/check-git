const path = require('path');
const { GOOGLE_PAGE_NAME } = require('../../config/appConfig');
const { getPublicDir } = require('../../services/utils/env.util');

module.exports = router => {
    router.get(`/${GOOGLE_PAGE_NAME}`, (req, res) => {
        res.sendFile(path.resolve(getPublicDir(), GOOGLE_PAGE_NAME));
    });
};

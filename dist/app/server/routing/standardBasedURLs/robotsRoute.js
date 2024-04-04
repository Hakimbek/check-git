const { getPublicDir, isHub } = require('../../services/utils/env.util');
const { wkVars } = require('../../services/utils/vars.util');
const path = require('path');
const fs = require('fs');

module.exports = router => {
    const resHeaders = { 'Content-Type': 'text/plain; charset=UTF-8' };
    const enableContentIndexing = wkVars.vars('enableContentIndexing');

    const staticFolderSubPath = isHub() ? '' : 'static';
    const robotsDisallowPath = path.resolve(getPublicDir(), staticFolderSubPath, 'robots/robots-disallow.txt');

    // Adding a dedicated row for screaming frog on DEV enviroments only
    const devRobotsRules = fs.readFileSync(robotsDisallowPath);

    router.get('/robots.txt', (req, res) => {
        if (enableContentIndexing) {
            res.sendFile(path.resolve(getPublicDir(), staticFolderSubPath, 'robots/robots-allow.txt'));
        } else {
            res.set(resHeaders).send(devRobotsRules);
        }
    });
};

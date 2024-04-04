const authentification = require('./authentificationMiddleware');

module.exports = function standardLoginForIpUsersMiddleware(req, res, next) {
    req.forceLoginForIpUsers = true;

    return authentification(req, res, next);
};

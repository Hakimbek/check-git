const NO_RIGHTS_STATUS = 403;

const ADMIN_SUBS = [
    '6443403eabe8f5d7c0b572f8a361847056766984', //prod
    'achpadmin@cch.com', // dev, qa
    '4672ea95e830be7f172f29186b4521b8b69377d4', // stg
    'ab77ac7e3ccbb350b2ee06b6754fdfd0acddd394', //tal-dvl
];

module.exports = (req, res, next) => {
    if (ADMIN_SUBS.some(sub => sub === req.forwardedSub)) {
        next();
    } else {
        res.sendStatus(NO_RIGHTS_STATUS);
    }
};

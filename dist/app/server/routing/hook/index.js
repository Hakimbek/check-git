const authorizationRouter = require('./authorization');
const sessionRouter = require('./session');
const bodyParser = require('body-parser');

module.exports = router => {
    router.use('/hook', authorizationRouter);
    router.use('/hook', bodyParser.json(), sessionRouter);
};

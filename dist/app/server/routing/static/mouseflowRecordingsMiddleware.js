const path = require('path');
const { getPublicDir, isHub } = require('../../services/utils/env.util');

const mouseflowStylesFolderPath = isHub()
    ? 'static/assets/mouseflow-recordings/css/'
    : 'assets/mouseflow-recordings/css/';
const preReactStylesPath = path.resolve(getPublicDir(), `${mouseflowStylesFolderPath}pre-react-styles.css`);
const initialReactAppStylesPath = path.resolve(
    getPublicDir(),
    `${mouseflowStylesFolderPath}react-app-initial-styles.css`
);

const TAGS_USED_FOR_PRE_REACT_STYLES_ON_PROD = [
    'f0b04f18e3a7485a2b47364e519fb7a5', // v6.0.12
    'fba562679d0ddd43391b852fe506de04', // v6.2.8, v6.2.10, v6.2.11
    'ea893dfbd2e687f2fd46b11aab1581ab', // v6.3.6
    '547fea044584116c6ae96a8da16d21e3', // v6.5.10, v6.5.11
];

const TAG_USED_FOR_INITIAL_REACT_APP_STYLES_ON_PROD = '1170c35427558cfb4fd0';

// ACUS-4484: fix for outdated styles in mouseflow recordings on PROD
// TODO: we should remove this middleware later, since the mouseflow recordings are stored for no more than a year
// NOTE: we might need to create a long term solution for issues with broken styles in the mouseflow recordings in case if we will
// encounter some problems related to the current solution and will not be able to store CSS styles on the Mouseflow side
module.exports = (req, res, next) => {
    if (req.path.startsWith('/css/scss') && TAGS_USED_FOR_PRE_REACT_STYLES_ON_PROD.includes(req.query._etag)) {
        res.sendFile(preReactStylesPath);
    } else if (req.path.startsWith('/css/styles') && req.path.includes(TAG_USED_FOR_INITIAL_REACT_APP_STYLES_ON_PROD)) {
        res.sendFile(initialReactAppStylesPath);
    } else {
        next();
    }
};

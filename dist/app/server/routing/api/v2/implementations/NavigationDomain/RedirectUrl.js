const LOCALS_KEY = 'redirectUrl';

class RedirectUrlModifier {
    /**
     * Gets redirect URL object from Express response locals
     * @param {express.Response} res Express response object
     * @returns {Object} Object with URL properties compatible with Node URL class: https://nodejs.org/api/url.html#url_class_url
     */
    getRedirectUrlFromResponse(res) {
        return res.locals[LOCALS_KEY];
    }

    /**
     * Sets redirect URL object to Express response locals
     * @param {express.Response} res Express response object
     * @param {Object} redirectUrl Object with URL properties compatible with Node URL class: https://nodejs.org/api/url.html#url_class_url
     * @returns {express.Response} res Modified Express response object
     */
    setRedirectUrlToResponse(res, redirectUrl) {
        res.locals[LOCALS_KEY] = redirectUrl;

        return res;
    }
}

const redirectUrlModifier = new RedirectUrlModifier();

module.exports = redirectUrlModifier;

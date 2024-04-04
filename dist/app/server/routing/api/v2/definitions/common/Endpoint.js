class Endpoint {
    /*
     * @param {string} method HTTP method that is used to access the endpoint (should match some Express route method name)
     * @param {string} url URL of the API endpoint
     * @param {string[]} requiredParams List of required params to be passed to the API method
     * @param {options} additional configuration options
     * @param Options.checkingMethod {or|and} string that specifies what operation should be applied during requiredParams check
     */
    constructor(method, url, requiredParams, options) {
        this.method = method;
        this.url = url;
        this.requiredParams = requiredParams;
        this.options = options || { checkingMethod: 'AND' };
    }
}

module.exports = Endpoint;

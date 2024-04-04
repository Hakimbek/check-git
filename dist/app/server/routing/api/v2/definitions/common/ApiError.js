class ApiError extends Error {
    constructor(message, redirectUrl) {
        super(message);

        this.redirectUrl = redirectUrl;
    }
}

module.exports = ApiError;

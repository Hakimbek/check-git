module.exports = function (router) {
    router.get('/test', (req, res) => {
        res.write(`
            <html>
                <body>
                    <h1>Navigation test route for service</h1>
                </body>
            </html>
        `);

        res.end();
    });
};

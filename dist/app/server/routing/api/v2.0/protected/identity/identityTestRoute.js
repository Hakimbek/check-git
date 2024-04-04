module.exports = function (router) {
    router.get('/test', (req, res) => {
        res.write(`
            <html>
                <body>
                    <h1>Identity test route for api v1.0</h1>
                </body>
            </html>
        `);

        res.end();
    });
};

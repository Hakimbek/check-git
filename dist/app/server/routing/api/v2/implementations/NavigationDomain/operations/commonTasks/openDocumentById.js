const redirectUrlModifier = require('./../../RedirectUrl');

const openDocumentById = (req, res) => {
    let redirectUrl = redirectUrlModifier.getRedirectUrlFromResponse(res);
    // redirectUrl.pathname = `/resolve/document/${req.query.documentId}`;
    redirectUrl.pathname = `/app/acr/navigation`;
    redirectUrl.query.documentId = req.query.documentId;
    // ARMAC-1576 some ARM docs require node id to open correctly
    redirectUrl.query.nodeId = req.query.nodeId;
    redirectUrl.query.anchorId = req.query.anchorId || req.query.anchor;

    redirectUrlModifier.setRedirectUrlToResponse(res, redirectUrl);
};

module.exports = openDocumentById;

(function(isNode) {
    var _ = isNode ? require('lodash') : window._;

    /**
     * Service for treatment of arp28, arp29, arp30 explanation documents.
     *
     * @param {csn.services.MetadataService} metadataService
     * @param {bmb.research.document.DocumentModel} doc
     * @constructor
     */
    function ExplanationService(metadataService, doc) {
        var self = this;

        /**
         * Checks if the given document is from arp10 pack.
         *
         * @param {velvet.rsi.entities.Document} document
         * @returns {boolean} true if the given document is from arp10
         */
        this.isArp10Document = function(document) {
            return metadataService.extractPubVol(document) === 'arp10';
        };

        /**
         * Checks if the document is from the given pack.
         *
         * @param {velvet.rsi.entities.Document} document
         * @param {string[]|string} pack
         * @returns {boolean} true if the document is from the given pack
         */
        this.isDocumentInPack = function(document, pack) {
            var packArray = Array.isArray(pack) || pack instanceof Array
                ? pack : [pack];

            return packArray.indexOf(metadataService.extractPubVol(document)) !== -1;
        };

        /**
         * Checks if the given explanation document is from arp10 pack and a parent.
         *
         * @param {velvet.rsi.entities.Document} document
         * @returns {boolean} true if the given document is an explanation parent from arp10
         */
        this.isArp10ExplanationParent = function(document) {
            var citation = document.selfCitation || metadataService.extractNormLinkValues(document)[0];

            return self.isArp10Document(document) && citation.toLowerCase().indexOf('child') === -1;
        };

        /**
         * Checks if the given explanation document is from arp28 pack and a parent.
         *
         * @param {velvet.rsi.entities.Document} document
         * @returns {boolean} true if the given document is an explanation parent from arp28
         */
        this.isArp28ExplanationParent = function(document) {
            return self.isDocumentInPack(document, 'arp28') && /COPY$/.test(document.id);
        };

        /* eslint-disable max-len */
        /**
         * Checks if the given documents are from the given pack (arp28, arp29, arp30).
         *
         * @param {velvet.rsi.entities.Document[]} documents
         * @param {String} pack
         * @returns {boolean} true if the given document array is not empty and all of the documents are from the given pack
         */
        this.isAllRelatedDocumentsFromPack = function(documents, pack) {
            return documents.length && !_.difference(documents.map(metadataService.extractPubVol), [pack]).length;
        };

        /**
         * Filters for arp28 parent explanation documents.
         *
         * @param {velvet.rsi.entities.Document[]} documents
         * @returns {velvet.rsi.entities.Document[]} a new array which contains only parent explanation documents from arp28
         */
        this.filterArp28ParentExplanations = function(documents) {
            return documents.filter(self.isArp28ExplanationParent);
        };
        /* eslint-enable max-len */

        /**
         * Finds the first document in a document array which is not from arp28.
         *
         * @param {velvet.rsi.entities.Document[]} documents
         * @returns {velvet.rsi.entities.Document} returns the first document
         * which is not from arp28 in the given array or undefined
         */
        this.getFirstNonArp28Explanation = function(documents) {
            return _.find(documents, function(document) {
                return !self.isDocumentInPack(document, 'arp28');
            });
        };

        /**
         * Checks if a main code section is opened in the 360 view using the doc model.
         *
         * @returns {boolean} returns true if the document opened by the doc model is a main code section.
         */
        this.isMainCodeSection = function() {
            return metadataService.extractCodeSectionType(doc.getDocument()).toLowerCase() === 'full';
        };
    }

    if (isNode) {
        global.sharedServices.explanationService = new ExplanationService(global.sharedServices.metadataService);
    } else {
        csn.services.$module.service('explanationService', [ 'metadataService', 'doc', ExplanationService ]);
    }
})(typeof exports === 'object');

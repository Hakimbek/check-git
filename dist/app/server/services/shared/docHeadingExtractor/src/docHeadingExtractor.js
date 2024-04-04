(function(isNode) {
    var _ = isNode ? require('lodash') : window._;

    /**
     * Service to create document heading.
     *
     * @param {csn.services.UtilsService} csnUtils
     * @param {csn.services.DocumentHeadingMapping} documentHeadingMapping
     * @param {csn.services.HeadingOperators} headingOperators
     * @param {csn.services.MetadataService} metadataService
     * @param {csn.services.SearchHeadingMapping} searchHeadingMapping
     * @param {csn.services.TopicHeadingMapping} topicHeadingMapping
     * @param {csn.services.TreatyUtils} treatyUtils
     * @param {csn.services.ExplanationService} explanationService
     * @param {csn.pages.results.taxPrepPartnerDictionary} taxPrepPartnerDictionary
     * @param {csn.services.DocTypeService} docTypeService
     */
    function HeadingExtractor(
        csnUtils,
        documentHeadingMapping,
        headingOperators,
        metadataService,
        searchHeadingMapping,
        topicHeadingMapping,
        treatyUtils,
        explanationService,
        taxPrepPartnerDictionary,
        docTypeService
    ) {
        var getExtractor = headingOperators.getExtractor;

        /**
         * Extract heading of a document.
         * If headingFields parameter is present, the heading parts defined by headingFields parameter is extracted.
         *
         * @param {velvet.rsi.entities.Document} document
         * @param {Array.<string>=} headingFields
         * @param {string} context
         * @return {string|Array.<string>}
         */
        this.extract = function(document, headingFields, context) {
            var heading = undefined;
            try {
                var headingExtractor = !_.isEmpty(headingFields)
                    ? getExtractor('join', headingFields)
                    : getHeadingExtractor(metadataService.extractPrimaryClass(document), context);

                if (headingExtractor) {
                    heading = headingExtractor.extract(document);
                }
            } catch (error) {
                console.error(error); // eslint-disable-line
            }

            if (_.isArray(heading)) {
                return _.map(heading, function(text) {
                    return csnUtils.htmlDecode(text);
                });
            }

            return csnUtils.htmlDecode(heading || document.title);
        };

        /**
         * Extract heading of a plain document
         * If headingFields parameter is present, the heading parts defined by headingFields parameter is extracted.
         *
         * @param {vlvRsiDocument} document
         * @param {?Array<string>} headingFields
         * @returns {vlvRsiDocument}
         */
        this.extractDocumentHeading = function(document, headingFields) {
            return this.extract(document, headingFields, 'document');
        };

        /**
         * Extract heading of a search result item document.
         * If headingFields parameter is present, the heading parts defined by headingFields parameter is extracted.
         *
         * @param {vlvRsiDocument} document
         * @param {?Array<string>} headingFields
         * @returns {vlvRsiDocument}
         */
        this.extractSearchHeading = function(document, headingFields) {
            return this.extract(document, headingFields, 'search');
        };

        /**
         * Extract heading of a topic document.
         * If headingFields parameter is present, the heading parts defined by headingFields parameter is extracted.
         *
         * @param {osa.topic.DocumentReference} document
         * @param {?Array<string>} headingFields
         * @returns {osa.topic.DocumentReference}
         */
        this.extractTopicDocumentHeading = function(document, headingFields) {
            return this.extract(document, headingFields, 'topic');
        };

        this.enrich = function(document) {
            document.heading = this.extract(document);
        };

        this.getDocumentTitle = function(document, isEncode) {
            var titleParts = getTitleParts(document);
            var documentTitle = this.extract(document, titleParts);

            return isEncode ? csnUtils.encodeDocTitleParamForURL(documentTitle) : documentTitle;
        };

        this.getTitle = function(document) {
            var title = /[^,]*/.exec(document.title)[0];

            return csnUtils.encodeDocTitleParamForURL(csnUtils.htmlDecode(title));
        };

        /**
         * Gets the appropriate Extractor based on the heading mappings
         *
         * @param {{superClass: string, subClass: string}} primaryClass The primaryClass of the document
         * @param {string} context determines the document context
         * @returns {Extractor}
         */
        function getHeadingExtractor(primaryClass, context) {
            var contextMap = {
                document: documentHeadingMapping,
                search: searchHeadingMapping,
                topic: topicHeadingMapping,

                fallback: documentHeadingMapping
            };

            // if no extractor for this context specified
            var extractor = (contextMap[context] || contextMap.fallback)[primaryClass.superClass];

            function getExtractorObject(extractor) {
                if (!extractor) {
                    return undefined;
                }

                // if subClasses are not used for the heading mapping then return the Extractor
                if (extractor.extract) {
                    return extractor;
                }

                // return default extractor if there isn't a specific mapping defined for this subClass
                return extractor.subClasses[primaryClass.subClass] || extractor.default;
            }

            // fallback to the document heading mapping
            return getExtractorObject(extractor) || getExtractorObject(contextMap.fallback[primaryClass.superClass]);
        }

        function getTitleParts(document) {
            var titleParts = null;
            var isIntlTreatyDocument = treatyUtils.isIntlTreatyDocument(document);
            var isMTGDocument = metadataService.isMTGContent(document);
            var isUSMDGContent = metadataService.isUSMDGContent(document);
            var isMEGGContent = metadataService.isMEGGContent(document);

            if (isMTGDocument || isUSMDGContent || isMEGGContent
                || isFedExplanation(document) || isTPP(document) && !isIntlTreatyDocument) {
                titleParts = ['title'];
                // some documents already contains the date in the title
            } else if (docTypeService.isPendingLegislationDocument(document)
                && explanationService.isDocumentInPack(document, ['cog02'])) {
                titleParts = [ 'title', 'primary-citation' ];
            } else if (!isIntlTreatyDocument
                && !docTypeService.isLawLawDocument(document)
                && !docTypeService.isCommitteeReportDocument(document)
                && !docTypeService.isPendingLegislationDocument(document)
                && !docTypeService.isCCHTaxBriefingDocument(document)) {
                titleParts = [ 'num', 'title' ];
            }

            return titleParts;
        }

        // @todo Need to make a long term solution for heading rules. Made a temporary solution for CSN-7408.
        function isFedExplanation(doc) {
            return explanationService.isDocumentInPack(doc, [ 'arp10', 'arp28', 'arp29', 'arp30' ]);
        }

        function isTPP(doc) {
            var pubVol = metadataService.extractPubVol(doc);

            return taxPrepPartnerDictionary.isInDictionary(pubVol);
        }
    }

    if (!isNode) {
        csn.services.$module.service('docHeadingExtractor', [
            'csnUtils',
            'documentHeadingMapping',
            'headingOperators',
            'metadataService',
            'searchHeadingMapping',
            'topicHeadingMapping',
            'treatyUtils',
            'explanationService',
            'taxPrepPartnerDictionary',
            'docTypeService',
            HeadingExtractor
        ]);
    } else {
        //TO DO: we should try to share docTypeService between client and server
        //in order to avoid code duplication (reassignment of docTypeService must be removed after this)
        global.sharedServices.docTypeService = {
            isLawLawDocument: function(document) {
                var primaryClass = global.sharedServices.metadataService.extractPrimaryClass(document);

                return primaryClass.superClass === 'law' && primaryClass.subClass === 'law';
            },

            isCommitteeReportDocument: function(document) {
                var primaryClass = global.sharedServices.metadataService.extractPrimaryClass(document);

                return primaryClass.superClass === 'committee-report';
            },

            isPendingLegislationDocument: function(document) {
                var primaryClass = global.sharedServices.metadataService.extractPrimaryClass(document);

                return primaryClass.superClass === 'pending-legislation';
            },

            isCCHTaxBriefingDocument: function(document) {
                var documentPrimaryClass = global.sharedServices.metadataService.extractPrimaryClass(document);
                if (documentPrimaryClass.superClass !== 'periodical') {
                    return false;
                }

                if (documentPrimaryClass.subClass === 'journal' ||
                    documentPrimaryClass.subClass === 'newsletter' ||
                    documentPrimaryClass.subClass === 'report-letter') {
                    return true;
                }

                return false;
            }
        };
        //TO DO: we should try to share treatyUtils service between client and server
        //in order to avoid code duplication (reassignment of treatyUtils must be removed after this)
        global.sharedServices.treatyUtils = {
            isIntlTreatyDocument: function(document) {
                global.sharedServices.metadataService.extractPrimaryClass(document).superClass === 'international-agreement';
            }
        };

        global.sharedServices.docHeadingExtractor = new HeadingExtractor(
            global.sharedServices.csnUtils,
            global.sharedServices.documentHeadingMapping,
            global.sharedServices.headingOperators,
            global.sharedServices.metadataService,
            global.sharedServices.searchHeadingMapping,
            global.sharedServices.topicHeadingMapping,
            global.sharedServices.treatyUtils,
            global.sharedServices.explanationService,
            global.sharedServices.taxPrepPartnerDictionary,
            global.sharedServices.docTypeService
        );
    }
})(typeof exports === 'object');

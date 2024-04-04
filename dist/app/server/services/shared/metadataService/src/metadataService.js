(function(isNode) {
    var _ = isNode ? require('lodash') : window._;
    var cheerio = isNode ? require('cheerio') : null;

    /**
     * Service for enriching document entity with metadata.
     * @param {csn.appConstantsService} appConstantsService
     * @param {angular.$q} $q The AngularJS service
     * @param {csn.services.Util} csnUtils
     * @param {csn.services.documentExtendedMetadataFields} documentExtendedMetadataFields
     * @param {Object} documentTypesMapping
     * @param {csn.common.config.RelatedItemConfig} relatedItemConfig
     * @param {Resource} wkOsaResource
     * @param {Object} stateList
     */
    function MetadataService(
        appConstantsService,
        $q,
        csnUtils,
        documentExtendedMetadataFields,
        documentTypesMapping,
        relatedItemConfig,
        wkOsaResource,
        stateList
    ) {
        var self = this;

        // Topic metadata fields map
        var tlpDocumentMetadataFieldsMap = [
            {
                name: 'codeSecValue',
                attributeKey: 'codesec'
            }, {
                name: 'sort-date',
                attributeKey: 'date'
            }, {
                name: 'document-num',
                attributeKey: 'publisher-uri',
                attributeValue: 'http://wk-us.com/meta/publishers/#CCH'
            }
        ];
        var INTERNATIONAL_MAPPED_TYPE_REGEXP = /http:\/\/wk-us\.com\/meta\/regions\/#(US-PR|(?!US)[A-Z]{2,3})$/;
        var STATE_MAPPED_TYPE_REGEXP = /http:\/\/wk-us\.com\/meta\/regions\/#US-([A-Z]{2,3})$/;
        var FEDERAL_MAPPED_TYPE_REGEXP = /http:\/\/wk-us\.com\/meta\/regions\/#US$/;
        var MULTISTATE_MAPPED_TYPE_REGEXP = /^http:\/\/wk-us\.com\/meta\/regions\/#US-MULTISTATE$/;
        var PARAGRAPH_SIGN_HEX = /\u00B6(.*)/;
        var WHITESPACE_CHARACTERS_REGEXP = /\s+/g;

        /**
         *
         * @param {String} xmlData
         * e.g. <super-class super-class="topical-landing-page"></super-class><sub-class sub-class="topical-landing-page"></sub-class>
         * @returns {{subClass: string, superClass: string}|{}}
         */
        function parsePrimaryClassMetadataXML(xmlData) {
            var matchedStrings = xmlData.match(/"[A-Za-z-]+"/g);
            var primaryClass = {
                superClass: matchedStrings && matchedStrings[0]
                    ? matchedStrings[0].replace(/"/g, '').toLowerCase()
                    : '',
                subClass: matchedStrings && matchedStrings[1]
                    ? matchedStrings[1].replace(/"/g, '').toLowerCase()
                    : ''
            };

            return primaryClass;
        }

        /*eslint-disable */
        /**
         *
         * @param {velvet.rsi.entities.Document|velvet.rsi.entities.SearchResultListItem|osa.research.DocumentSearchResultItem} document
         * @returns {{subClass: string, superClass: string}|{}}
         */
        /*eslint-enable */
        function getPrimaryClass(document) {
            var primaryClass = {};
            var extendedMetadata = self.extractExtendedMetadata(document) || [];
            extendedMetadata.every(function(metaData) {
                if (metaData.name === 'primary-class') {
                    primaryClass = parsePrimaryClassMetadataXML(metaData.value);

                    return false;
                }

                return true;
            });

            return primaryClass;
        }

        this.getPrimaryClass = getPrimaryClass;

        /**
         * Gets the document anchor value.
         *
         * @param {velvet.rsi.entities.Document|
         * velvet.rsi.entities.SearchResultListItem|
         * osa.research.DocumentSearchResultItem} document
         * @returns {string}
         */
        this.extractAnchor = function(document) {
            if ( document.anchor) {
                return document.anchor;
            }

            var anchor = _.find(document.searchMetadata, { key: 'anchor' });

            return anchor && anchor.value ? anchor.value : anchor;
        };

        /**
         * Gets the document type uri of a document.
         *
         * @param {velvet.rsi.entities.Document} document The document to enrich.
         * @returns {string}
         */
        this.extractDocumentTypeUri = function(document) {
            document.contentType = self.extractMetadata(document, 'condor:documentType', 'uri');

            return document.contentType;
        };

        /**
         * Returns primaryClass field
         * @param {velvet.rsi.entities.Document} document The document entity.
         * @returns {{superClass:string,subClass:string}} metadata primaryClass field
         */

        this.extractPrimaryClass = function(document) {
            return getPrimaryClass(document);
        };

        /**
         * Returns the code section type from the sectionStatus field value.
         * @param {velvet.rsi.entities.Document} document The document entity.
         * @returns {string} The metadata sectionStatus field. It's 'shell', 'full' or 'subsection'
         */
        this.extractCodeSectionType = function(document) {
            return self.extractMetadata(document, 'sectionStatus', 'status') || '';
        };

        /**
         * @param {velvet.rsi.entities.Document} document
         * @returns {string}
         */
        this.extractShellDocumentId = function(document) {
            return self.extractMetadata(document, 'relatedCodeDocuments', 'shellDoc');
        };

        /**
         * @param {velvet.rsi.entities.Document} document
         * @returns {string} Ex. arp28 or arp10
         */
        this.extractPubVol = function(document) {
            return self.extractMetadata(document, 'pubvol') || '';
        };

        /**
         * Extract self citations
         * @param {velvet.rsi.entities.Document} document
         * @returns {Array.<string>|undefined}
         */
        this.extractNormLinkValues = function(document) {
            var normLinkValues = self.extractMetadata(document, 'norm-link-values');

            return normLinkValues ? normLinkValues.split(/;\s+/) : normLinkValues;
        };

        /**
         * returns mapped Document type by Primary Class Object
         * @param {{subClass: string, superClass: string}} primaryClass
         * @param {string} pubVol
         * @returns {object|string}
         */
        this.getTypeByPrimaryClass = function(primaryClass, pubVol) {
            var EVENT_TOPIC_TYPE = appConstantsService.get('elpGreenLabelName');
            var mappedType = documentTypesMapping[primaryClass.superClass + '/' + primaryClass.subClass + '/' + pubVol]
                || documentTypesMapping[primaryClass.superClass + '/' + primaryClass.subClass]
                || documentTypesMapping[primaryClass.superClass];

            if (mappedType === EVENT_TOPIC_TYPE) {
                mappedType = csnUtils.htmlDecode(mappedType);
            }

            return mappedType;
        };

        /**
         * @param {velvet.rsi.entities.Document} document
         * @returns {string}
         */
        this.extractDocumentType = function(document) {
            var primaryClass = getPrimaryClass(document);
            var pubVol = self.extractPubVol(document);
            var mappedType = this.getTypeByPrimaryClass(primaryClass, pubVol);

            if (typeof mappedType === 'object' && mappedType !== null) {
                mappedType = getComplexType(mappedType, document);
            }

            return mappedType;
        };

        /**
         * workaround for cases, when mapped Type is Object
         * @param {object} mappedType
         * @param {velvet.rsi.entities.Document} document
         * @returns {string}
         */
        function getComplexType(mappedType, document) {
            var regionUri = self.extractRegionUri(document);
            var documentTypeByUri = mappedType[self.extractDocumentTypeUri(document)];

            if (documentTypeByUri) {
                return documentTypeByUri;
            }

            if (regionUri && INTERNATIONAL_MAPPED_TYPE_REGEXP.test(regionUri)) {
                return mappedType.international;
            }

            if (regionUri && STATE_MAPPED_TYPE_REGEXP.test(regionUri)) {
                return mappedType.state;
            }

            if (regionUri && FEDERAL_MAPPED_TYPE_REGEXP.test(regionUri)) {
                return mappedType.federal;
            }

            return '';
        }

        this.getComplexType = getComplexType;

        /**
         * Enriches document entity with documentType field
         * @param {velvet.rsi.entities.Document| osa.personalitem.DocumentHistoryItem} document The document to enrich.
         */
        this.enrichWithDocumentType = function(document) {
            var mappedType = self.extractDocumentType(document);
            var primaryClass = getPrimaryClass(document);
            if (!mappedType) {
                //if no mappedType specified, then we set type from primaryClass
                if (!document.documentType && primaryClass.subClass) {
                    document.documentType = csnUtils.decorateText(primaryClass.subClass);
                }
            } else {
                document.documentType = mappedType;
            }
        };

        /**
         * @param {velvet.rsi.entities.Document} document
         */
        this.enrichWithDaTitle = function(document) {
            document.daTitle = self.extractDaTitle(document);
        };

        /**
         * Returns the da-title of the document.
         * @param {velvet.rsi.entities.Document} document The document to enrich.
         * @returns {string|undefined}
         */
        this.extractDaTitle = function(document) {
            return self.extractMetadata(document, 'da-title');
        };

        /**
         * Returns the da-id of the document.
         * @param {velvet.rsi.entities.Document} document The document to enrich.
         * @returns {string|undefined}
         */
        this.extractDaId = function(document) {
            return self.extractMetadata(document, 'da-id');
        };

        /**
         * @param {velvet.rsi.entities.Document} document
         */
        this.enrichWithMTG = function(document) {
            document.isMTG = self.isMTGContent(document);
        };

        /**
         * @param {velvet.rsi.entities.Document} document
         */
        this.enrichWithUSMDG = function(document) {
            document.isUSMDG = self.isUSMDGContent(document);
        };

        /**
         * @param {velvet.rsi.entities.Document} document
         * @returns {string}
         */
        this.extractRealType = function(document) {
            var primaryClass = self.extractPrimaryClass(document);

            return relatedItemConfig.documentTypes[primaryClass.superClass + '/' + primaryClass.subClass] ||
                relatedItemConfig.documentTypes[primaryClass.superClass];
        };

        /**
         * @param {velvet.rsi.entities.Document} document
         */
        this.enrichWithRealType = function(document) {
            document.realType = self.extractRealType(document);
        };

        /**
         * Enriches document entity with main citation value.
         * @param {velvet.rsi.entities.Document} document The document to enrich.
         * @returns {velvet.rsi.entities.Document}
         */
        this.enrichWithMainCitation = function(document) {
            document.mainCitation = self.extractMainCitation(document);

            return document;
        };

        /**
         * Enriches document entity with search title value
         * @param {velvet.rsi.entities.Document} document The document to enrich.
         */
        this.enrichWithSearchTitleType = function(document) {
            var searchTitle = self.extractSearchTitle(document);
            var searchItemMatchArray = null;

            document.searchTitleType = '';

            if (searchTitle) {
                searchItemMatchArray = searchTitle.match(/<bold>([\D]+)<\/bold>/);

                if (searchItemMatchArray && searchItemMatchArray[1]) {
                    document.searchTitleType = searchItemMatchArray[1];
                }
            }
        };

        /**
         * Extracts the document's main citation value. (Usage ex.: Regulations)
         * @param {velvet.rsi.entities.Document} document
         * @returns {string}
         */
        this.extractMainCitation = function(document) {
            // CSN-13389: In several state law documents we have two metadata with the same
            // AttributeKey='normval' and Name='contextualization' property
            // but with different AttributeValue (like: '93-632a' and '210.021').
            // We use normval value to specify mainCitation, but on the different environments
            // our request returns metadata values in different order, we pick up the first one
            // and sometimes we displaying the wrong mainCitation value
            var isVelvetMode = typeof document.extendedMetadata === 'function';
            var searchMultipleMetadataHandler = isVelvetMode ? searchMultipleVelvetMetadata : searchMultipleOsaMetadata;
            var metadataList = searchMultipleMetadataHandler(document, 'contextualization', 'normval');

            if (metadataList.length > 1) {
                return getRealNormval(document, metadataList);
            }

            var context = {
                mostLength: 0,
                result: null
            };

            var extendedMetadata = self.extractExtendedMetadata(document);

            _.forEach(extendedMetadata, function(metadata) {
                isVelvetMode
                    ? extractMainCitationVelvet.call(context, metadata)
                    : extractMainCitationOsa.call(context, metadata);
            });

            return context.result;
        };

        function extractMainCitationOsa(metadata) {
            var self = this;
            if (metadata.name === 'contextualization') {
                var attribute = metadata.attributes.find(function(_attribute) {
                    return _attribute.key === 'normval' && _attribute.value.length > self.mostLength;
                });

                if (attribute) {
                    this.result = attribute.value;
                    this.mostLength = attribute.value.length;
                }
            }
        }

        function extractMainCitationVelvet(metadata) {
            if (
                metadata.name === 'contextualization'
                && metadata.attributeKey === 'normval'
                && metadata.attributeValue.length > this.mostLength
            ) {
                this.result = metadata.attributeValue;
                this.mostLength = metadata.attributeValue.length;
            }
        }

        /**
         * Enriches document entity with regulation citation value based on 'document-num' metadata.
         * @param {velvet.rsi.entities.Document} document The document to enrich.
         */
        this.enrichWithRegulationCitation = function(document) {
            document.regulationCitation = self.extractRegulationCitation(document);
        };

        /**
         * Extracts regulation citation value based on 'document-num' metadata.
         * @param {velvet.rsi.entities.Document} document
         * @return {string}
         */
        this.extractRegulationCitation = function(document) {
            return self.extractMetadata(document, 'document-num');
        };

        /*eslint-disable */
        /**
         * @example
         * // will return the value of the first extended metadata with name 'test'
         * extractMetadata( doc, 'test', 'test' )
         *
         * @example
         * // will return the attributeValue of the first extended metadata with name 'test' and
         * // attributeKey 'attr'
         * extractMetadata( doc, 'test', 'test', 'attr' )
         *
         * @example
         * // will return the value of the first extended metadata with name 'test',
         * // attributeKey 'attr' and attributeValue 'val'
         * extractMetadata( doc, 'test', 'test', 'attr', 'val' )
         *
         *
         * @param {velvet.rsi.entities.Document|velvet.rsi.entities.SearchResultListItem|osa.research.DocumentSearchResultItem} document
         * @param {string} name Name of the metadata
         * @param {string=} attributeKey Name of the attribute key, if the metadata is an attribute collection
         * @param {string=} attributeValue Name of the attribute value to look for, if the attribute itself is a map
         * @returns {string|undefined}
         */
        /*eslint-enable */
        this.extractMetadata = function(document, name, attributeKey, attributeValue) {
            var metaData = self.findMetadata(document, name, attributeKey, attributeValue);
            var result = undefined;

            function getResultValueFromAttributes() {
                var index = metaData.attributes.findIndex( function( attribute ) {
                    return attribute.key === attributeKey;
                });

                return index > -1 && metaData.attributes[index].value;
            }

            if (!metaData) {
                return undefined;
            }

            if (attributeValue || !attributeKey) {
                result = metaData.value || metaData.attributes && getResultValueFromAttributes();
            } else {
                result = metaData.attributeValue || metaData.attributes && getResultValueFromAttributes();
            }

            return result;
        };

        this.findMetadata = function(document, name, attributeKey, attributeValue) {
            var result = undefined;
            var extendedMetadata = [];
            if (_.isFunction(document.extendedMetadata)) extendedMetadata = document.extendedMetadata();
            else if (document.extendedMetadata) extendedMetadata = document.extendedMetadata;

            findInExtendMetadataObjects(extendedMetadata.objects || extendedMetadata);

            if (!result && extendedMetadata.groups) {
                findInExtendMetadataGroups(extendedMetadata.groups);
            }

            function findInExtendMetadataObjects(objects) {
                objects.some(function(metaData) {
                    if (
                        metaData.name === name
                        && (
                            !attributeKey
                            || metaData.attributes
                            && metaData.attributes.some(function(attribute) {
                                return attribute.key === attributeKey;
                            })
                            || metaData.attributeKey === attributeKey
                        )
                        && (
                            !attributeValue
                            || metaData.attributes
                            && metaData.attributes.some(function(attribute) {
                                return attribute.value === attributeValue;
                            })
                            || metaData.attributeValue === attributeValue
                        )
                    ) {
                        result = metaData;
                    }

                    return result;
                });

            }

            function findInExtendMetadataGroups(groups) {
                groups.some(function(group) {
                    if (group.objects && group.objects.length > 0) {
                        findInExtendMetadataObjects(group.objects);
                    } else if (group.groups && group.groups.length > 0) {
                        findInExtendMetadataGroups(group.groups);
                    } else if (group.name === name) {
                        result = group;
                    }

                    return result;
                });
            }

            return result;
        };

        /**
         * Enrich document references from TLP section with ExtendedMetadata
         *
         * @param {osa.topic.DocumentReference} documentRef Document reference from topic section
         * @returns {osa.topic.DocumentReference} Extended document reference
         */
        this.enrichWithExtendedMetadata = function(documentRef) {
            if (!documentRef || _.has(documentRef, 'extendedMetadata')) return documentRef;

            var metadata = [];

            _.forEach(documentRef.metadata, function(metadataField) {
                metadata.push(extendWithAttributes({
                    documentId: documentRef.documentId,
                    id: metadataField.id,
                    name: metadataField.id,
                    value: metadataField.value || _.first(metadataField.values)
                }));
            });

            documentRef.extendedMetadata = function() {
                return metadata;
            };

            return documentRef;
        };

        /**
         * Extend metadata object with necessary attributes
         *
         * @param {Object} metadata
         * @returns {Object}
         */
        function extendWithAttributes(metadata) {
            var fieldExtension = _.find(tlpDocumentMetadataFieldsMap, {
                name: metadata.name
            });

            if (fieldExtension) {
                Object.assign(metadata, fieldExtension);
                !metadata.attributeValue && (metadata.attributeValue = metadata.value);
            } else if (_.includes(metadata.name, 'title')) {
                //'title' metadata comes from TDS along with its attributeValue, so splitting it
                Object.assign(metadata, {
                    attributeKey: 'type',
                    attributeValue: metadata.name.split('-')[0],
                    name: 'title',
                    id: 'title'
                });
            }

            return metadata;
        }

        /**
         * Gets values of selected xml elements or attributes.
         *
         * @param {String} xmlStr XML string
         * @param {String} elementSelector JQuery selector, which selects the element in the xml
         * @param {String=} attributeName Attribute of the selected element
         * @returns {Array<String>} Values of the selected elements/attributes
         */
        this.extractXmlData = function(xmlStr, elementSelector, attributeName) {
            var xml;
            if (!elementSelector) {
                return xmlStr;
            }

            if (isNode) {
                try {
                    xml = cheerio.load(xmlStr);
                } catch (err) {
                    return [];
                }

                var xmlExtractedData = [];
                var elementsFilteredBySelector = xml(elementSelector);

                // workaround for cheerio package, map/each methods don't work properly with elementsFilteredBySelector pseudoarray
                for (var i = 0; i < elementsFilteredBySelector.length; i++) {
                    var extractedData = attributeName ?
                        elementsFilteredBySelector[i].attribs[attributeName] :
                        elementsFilteredBySelector[i].children[0] && elementsFilteredBySelector[i].children[0].data;

                    xmlExtractedData.push(extractedData);
                }

                return xmlExtractedData.filter(function(data) {
                    return !!data;
                });
            }

            xml = angular.element(xmlStr);

            return xml.filter(elementSelector)
                .add(xml.find(elementSelector))
                .toArray()
                .map(angular.element)
                .map(function(element) {
                    return attributeName ? element.attr(attributeName) : element.text();
                });
        };

        /**
         * Returns the original title (not search) of the document.
         * @param {velvet.rsi.entities.Document} document The document to enrich.
         * @returns {string|undefined}
         */
        this.extractOriginalTitle = function(document) {
            return self.extractMetadata(document, 'title', 'type', 'standard');
        };

        /**
         * Enriches document entity with the original title (not search)
         * @param {velvet.rsi.entities.Document} document The document to enrich.
         */
        this.enrichWithOriginalTitle = function(document) {
            document.originalTitle = self.extractOriginalTitle(document);
        };

        /**
         * Enriches document entity with committee report label field
         * @param {velvet.rsi.entities.Document} document The document to enrich.
         */
        this.enrichWithLabel = function(document) {
            document.reportLabel = self.extractMetadata(document, 'committeeReportLabel', 'value');
        };

        /**
         * Enriches document entity with regulationType field
         * @param {velvet.rsi.entities.Document} document The document to enrich.
         */
        this.enrichWithRegulationType = function(document) {
            document.regulationType = self.extractRegulationType(document);
        };

        /**
         * @param {velvet.rsi.entities.Document} document The document to enrich.
         * @return {string}
         */
        this.extractRegulationType = function(document) {
            return self.extractMetadata(document, 'contextualization', 'root');
        };

        /**
         * Enriches document entity with codeSectionNumber field
         * @param {velvet.rsi.entities.Document} document The document to enrich.
         */
        this.enrichWithCodeSectionNumber = function(document) {
            document.codeSectionNumber = self.extractCodeSectionNumber(document);
        };

        /**
         * Enriches document entity with sort-date field
         * @param {velvet.rsi.entities.Document} document The document to enrich.
         */
        this.enrichWithSortDate = function(document) {
            document.sortDate = self.extractSortDate(document);
        };

        /**
         * Returns the sort-date.
         * @param {velvet.rsi.entities.Document} document The document entity.
         * @returns {string}
         */
        this.extractSortDate = function(document) {
            return self.extractMetadata(document, 'sort-date', 'date');
        };

        /**
         * Returns the code section number.
         * @param {velvet.rsi.entities.Document} document The document entity.
         * @returns {string}
         */
        this.extractCodeSectionNumber = function(document) {
            return self.extractMetadata(document, 'codeSecValue', 'codesec');
        };

        /**
         * Enriches document entity with region code field
         * @param {velvet.rsi.entities.Document} document The document to enrich.
         */
        this.enrichWithRegionCode = function(document) {
            document.code = self.extractRegionCode(document);
        };

        /**
         * Returns the region code
         * @param {velvet.rsi.entities.Document} document The document entity.
         * @returns {string}
         */
        this.extractRegionCode = function(document) {
            var code = self.extractMetadata(document, 'region', 'uri');
            var regionCodeIndex = 2;

            return code ? code.split('-')[regionCodeIndex] : undefined;
        };

        /**
         * Enriches document entity with country code field
         * @param {velvet.rsi.entities.Document} document The document to enrich.
         */
        this.enrichWithCountryCode = function(document) {
            document.code = self.extractCountryCode(document);
        };

        /**
         * Returns the country code
         * @param {velvet.rsi.entities.Document} document The document entity.
         * @returns {string}
         */
        this.extractCountryCode = function(document) {
            var code = self.extractMetadata(document, 'region', 'uri');

            return code ? code.split('#')[1] : undefined;
        };

        /**
         * Enriches document entity with region field
         * @param {velvet.rsi.entities.Document} document The document to enrich.
         */
        this.enrichWithRegion = function(document) {
            document.region = self.extractRegion(document);
        };

        /**
         * Returns the region
         * @param {velvet.rsi.entities.Document} document The document entity.
         * @returns {string}
         */
        this.extractRegion = function(document) {
            return self.extractMetadata(document, 'region') || '';
        };

        /**
         * Returns the region uri
         * @param {velvet.rsi.entities.Document} document The document entity.
         * @returns {string}
         */
        this.extractRegionUri = function(document) {
            return self.extractMetadata(document, 'region', 'uri');
        };

        /**
         * Returns a search title value
         * @param {velvet.rsi.entities.Document} document The document entity.
         * @returns {string}
         */
        this.extractSearchTitle = function(document) {
            var searchTitle = self.extractMetadata(document, 'title', 'type', 'search');

            return searchTitle ? searchTitle.trim().replace(WHITESPACE_CHARACTERS_REGEXP, ' ') : undefined;
        };

        /**
         * @param {velvet.rsi.entities.Document} document
         * @returns {boolean}
         */
        this.isStatesContent = function(document) {
            var documentRegion = self.extractRegionUri(document);

            if (!documentRegion) {
                bmb.log.warn('Cannot define document region. Maybe we\'re missing some metadata?');

                return false;
            }

            var documentRegionMatch = documentRegion.match(STATE_MAPPED_TYPE_REGEXP);
            var regionCode = documentRegionMatch && documentRegionMatch[1];

            return regionCode && stateList[regionCode] && !FEDERAL_MAPPED_TYPE_REGEXP.test(documentRegion);
        };

        /**
         * @param {velvet.rsi.entities.Document} document
         * @returns {boolean}
         */
        this.isFederalContent = function(document) {
            var documentRegion = self.extractRegionUri(document);

            if (!documentRegion) {
                bmb.log.warn('Cannot define document region. Maybe we\'re missing some metadata?');

                return false;
            }

            return FEDERAL_MAPPED_TYPE_REGEXP.test(documentRegion);
        };

        /**
         * @param {velvet.rsi.entities.Document} document
         * @returns {boolean}
         */
        this.isMTGContent = function(document) {
            var pubVol = self.extractPubVol(document);

            return pubVol ? pubVol.toLowerCase() === 'mtg01' : false;
        };

        /**
         * @param {velvet.rsi.entities.Document} document
         * @returns {boolean}
         */
        this.isUSMDGContent = function(document) {
            var pubVol = self.extractPubVol(document);

            return pubVol ? pubVol.toLowerCase() === 'edg01' : false;
        };

        /**
         * @param {velvet.rsi.entities.Document} document
         * @returns {boolean}
         */
        this.isMEGGContent = function(document) {
            var pubVol = self.extractPubVol(document);

            return pubVol ? pubVol.toLowerCase() === 'fix01' : false;
        };

        /**
         * @param {velvet.rsi.entities.Document} document
         * @returns {string}
         */
        this.extractUrl = function(document) {
            var practiceAidMetadata = self.extractMetadata(document, 'wkpractice-aid:metadata');

            return practiceAidMetadata ? practiceAidMetadata.match(/url="(.+?)"/)[1] : null;
        };

        /**
         * Enriches document entity with url of the document. Used for ProxyDocs only.
         * @param {velvet.rsi.entities.Document} document The document entity.
         */
        this.enrichWithUrl = function(document) {
            document.url = self.extractUrl(document);
        };

        /**
         * Checks if the parameter document is a proxy doc.
         * Returns true if the parameter document is a proxy doc, otherwise false.
         *
         * @param {velvet.rsi.entities.Document} document The document to check whether it's a proxy doc.
         * @returns {boolean}
         */
        this.isProxyDoc = function(document) {
            var primaryClass = getPrimaryClass(document);

            return primaryClass.superClass === 'practice-aid' && primaryClass.subClass === 'application-proxy';
        };

        /**
         * Returns the archive-date of the document.
         *
         * @param {velvet.rsi.entities.Document|velvet.rsi.entities.SearchResultListItem
         * |osa.research.DocumentSearchResultItem} document
         * @returns {string}
         */
        this.extractArchiveDate = function(document) {
            var extendedMetadata = self.extractMetadata(document, 'archive-date');
            var archivedDates = extendedMetadata && extendedMetadata.match(/\b\d{4}\b/);

            return archivedDates && archivedDates[0];
        };

        /**
         * Enrich documents with extended metadata
         * @param {Array} docs documents
         * @param {Array} extendedMetadataFields array of extended metadata fields
         * @returns {Promise}
         */
        this.enrichDocumentsByExtendedMetadata = function( docs, extendedMetadataFields ) {
            extendedMetadataFields = extendedMetadataFields || documentExtendedMetadataFields.all;
            var hasDocItems = docs.some(function(doc) {
                return self.getDocumentId(doc);
            });
            if (hasDocItems) {
                return self.getExtendedMetadata(docs, extendedMetadataFields).then(function(extendedMetadataItems) {
                    _.forEach(docs, function(doc) {
                        var extendedMetadataItem = _.find(extendedMetadataItems, function(extendedMetadataItem) {
                            return extendedMetadataItem.documentId === self.getDocumentId(doc);
                        });
                        if (extendedMetadataItem) {
                            doc.extendedMetadata = extendedMetadataItem.metadata[0];
                        }
                    });

                    return docs;
                });
            }

            return $q.when(docs);

        };

        this.getExtendedMetadata = function( docs, extendedMetadataFields ) {
            extendedMetadataFields = extendedMetadataFields || documentExtendedMetadataFields.all;
            var documents = docs.reduce(function(acc, doc) {
                var docId = self.getDocumentId(doc);
                if (docId) {
                    acc.push(new wkOsaResource.DocumentId({ id: docId }));
                }

                return acc;
            }, []);
            // there is a global restriction for documents amount for getExtendedMetadata.
            var documentChunks = _.chunk(documents, appConstantsService.get('documentsExtendedMetadataChunk'));
            var promises = [];
            documentChunks.forEach(function(documentChunk) {
                var request = new wkOsaResource.GetExtendedMetadata({
                    documents: documentChunk,
                    extendedMetadataFields: extendedMetadataFields
                });

                promises.push($q.when(wkOsaResource.service.getExtendedMetadata(request)));
            });

            return $q.all(promises)
                .then(function(results) {
                    var extendedMetadataItems = [];

                    _.each(results, function(result) {
                        extendedMetadataItems = extendedMetadataItems.concat(result);
                    });

                    return extendedMetadataItems;
                });
        };

        this.extractExtendedMetadata = function(document) {
            if (!document.extendedMetadata) {
                return [];
            }

            var isVelvetMode = typeof document.extendedMetadata === 'function';

            return isVelvetMode ? document.extendedMetadata() : document.extendedMetadata.objects;
        };

        /**
         * Enriches documents from array with pubvol.
         * @param {Array<velvet.rsi.entities.Document>} documents array of documents.
         * @returns {Array<velvet.rsi.entities.Document>}
         */
        this.enrichDocumentListWithPubVol = function(documents) {
            return _.forEach(documents, function(document) {
                document.publicationId = self.extractPubVol(document);
            });
        };

        /**
         * Returns documents Authorizated flag
         * @param {velvet.rsi.entities.Document} document
         * @returns {boolean}
         */
        this.isDocAuthorized = function(document) {
            return this.extractMetadata(document, 'Authorized') === 'T';
        };

        /**
         * Returns claims needed to get document content
         * @param {velvet.rsi.entities.Document | osa.resource.Document} document
         * @returns {Array<string>}
         */
        this.extractDocumentClaims = function(document) {
            var isVelvetMode = typeof document.extendedMetadata === 'function';

            return isVelvetMode ? extractVelvetDocumentClaims(document) : extractOsaDocumentClaims(document);
        };

        this.getDocumentId = function(item) {
            var res = null;

            if (item instanceof wkOsaResource.Document) {
                res = item.id;
            } else if (item instanceof wkOsaResource.ContentTreeNode) {
                res = item.documentIdentifier || item.modelDocumentId;
            } else {
                res = item.documentId || item.docId;
            }

            return res;
        };

        /**
         * Returns claims needed to get document content
         * @param {velvet.rsi.entities.Document} document
         * @returns {Array<string>}
         */
        function extractVelvetDocumentClaims(document) {
            return document.extendedMetadata().reduce(function(claims, metadata) {
                if (metadata.groupName === 'AUTH_ID' && metadata.isGroup === false) {
                    claims.push(metadata.name);
                }

                return claims;
            }, []);
        }

        /**
         * Returns claims needed to get document content
         * @param {osa.resource.Document} document
         * @returns {Array<string>}
         */
        function extractOsaDocumentClaims(document) {
            var extendedMetadataGroups = _.get(document, 'extendedMetadata.groups') || [];

            return extendedMetadataGroups.reduce(function(claims, metadata) {
                if (metadata.name === 'AUTH_ID') {
                    metadata.objects.forEach(function(item) {
                        claims.push(item.name);
                    });
                }

                return claims;
            }, []);
        }

        function searchMultipleVelvetMetadata(document, name, attributeKey, attributeValue) {
            var properties = _.omitBy({
                name: name,
                attributeKey: attributeKey,
                attributeValue: attributeValue
            }, _.isNil);
            var extendedMetadata = self.extractExtendedMetadata(document);

            return extendedMetadata.filter(function(metaData) {
                return _.find([metaData], properties);
            });
        }

        /**
         *
         * @param {osa.resource.Document} document
         * @param {string} name
         * @param {string} attributeKey
         * @returns {osa.common.ExtendedMetadataObject[]}
         */
        function searchMultipleOsaMetadata(document, name, attributeKey) {
            var extendedMetadata = _.get(document, 'extendedMetadata.objects', []);

            return extendedMetadata.filter(function(metadata) {
                return (metadata.name === name) && hasAttribute(metadata, attributeKey);
            });
        }

        /**
         *
         * @param {osa.resource.Metadata} metadata
         * @param {string} attributeName
         * @returns {boolean}
         */
        function hasAttribute(metadata, attributeName) {
            return metadata.attributes.some(function(attribute) {
                return attribute.key === attributeName;
            });
        }

        function getRealNormval(document, items) {
            var normval = null;
            var metadata = null;
            var paragraph = self.extractMetadata(document, 'cch-paragraph-number');
            var paragraphMatches = paragraph &&_.last(paragraph.match(PARAGRAPH_SIGN_HEX));

            if (paragraph && paragraphMatches && paragraphMatches.length) {
                metadata = _.find(items, function(item) {
                    return item.attributeValue !== paragraphMatches;
                });
            }

            if (_.has(metadata, 'attributeValue')) {
                normval = metadata.attributeValue;
            } else {
                normval = _.last(self.extractMetadata(document, 'document-num').split(' '));
            }

            return normval;
        }

        /*
            argument topic here is entity,
            that can be got with 'enrichDocumentsByExtendedMetadata' method
        */
        this.isTopicInternationalByExtendedMetadata = function(topic) {
            var rootContextualization = self.extractMetadata(topic, 'contextualization', 'root') || '';

            return rootContextualization.split('-').shift() === 'intl';
        };

        /**
         * Enrich document with extended metadata
         * @param {Array} document documents
         * @param {Array} metadataFields array of extended metadata fields
         * @returns {Promise}
         */
        this.enrichDocumentByExtendedMetadata = function(document, metadataFields) {
            return self.enrichDocumentsByExtendedMetadata([document], metadataFields)
                .then(function(docsWithMetadata) {
                    return docsWithMetadata[0];
                })
                .catch(function(error) {
                    var statusCodeUnauthorized = 401;

                    console.log('Error while getting extended metadata for document: ', document);
                    console.log(error);

                    if (error.status === statusCodeUnauthorized) {
                        throw error;
                    }

                    return document;
                });
        };

        this.isDocValid = function(document) {
            return self.extractMetadata(document, 'DocStatus') !== 'Invalid';
        };

        /**
         *
         * @param {osa.resource.Document} document
         * @returns {string[]}
         */
        this.getAllRegions = function(document) {
            return getAllMetadataAttributes(document, 'region', 'uri')
                .map(function(regionUriAttribute) {
                    var federalUriTest = regionUriAttribute.value.match(FEDERAL_MAPPED_TYPE_REGEXP);
                    if (federalUriTest) {
                        return appConstantsService.get('documentsGeneralRegions').federal;
                    }

                    var multistateUriTest = regionUriAttribute.value.match(MULTISTATE_MAPPED_TYPE_REGEXP);
                    if (multistateUriTest) {
                        return appConstantsService.get('documentsGeneralRegions').multistate;
                    }

                    var stateUriTest = regionUriAttribute.value.match(STATE_MAPPED_TYPE_REGEXP);

                    return stateUriTest && stateUriTest[1];
                })
                .filter(function(regionName) {
                    return !!regionName;
                });
        };

        /**
         *
         * @param {osa.resource.Document} document
         * @param {string} metadataName
         * @param {string} attributeKey
         * @returns {osa.resource.common.KeyValuePair[]}
         */
        function getAllMetadataAttributes(document, metadataName, attributeKey) {
            var regionMetadataItems = searchMultipleOsaMetadata(document, metadataName, attributeKey) || [];

            return regionMetadataItems.reduce(function(regionsUris, regionMetadata) {
                return regionsUris.concat(getAttributes(regionMetadata, attributeKey));
            }, []);
        }

        /**
         *
         * @param {osa.resource.Document} document
         * @returns {string[]}
         */
        function getAllTaxTypes(document) {
            return getAllMetadataAttributes(document, 'state-tax-type', 'skos:prefLabel')
                .map(function(taxTypeLabel) {
                    return taxTypeLabel.value;
                });
        }

        this.getAllTaxTypes = getAllTaxTypes;

        /**
         *
         * @param {osa.resource.Metadata} metadata
         * @param {string} attributeName
         * @returns {osa.resource.common.KeyValuePair[]}
         */
        function getAttributes(metadata, attributeName) {
            return metadata.attributes.filter(function(attribute) {
                return attribute.key === attributeName;
            });
        }

        function getDocumentTypeByPrimaryClass(primaryClass, pubVol, mapping) {
            var EVENT_TOPIC_TYPE = appConstantsService.get('elpGreenLabelName');
            var mappedType = mapping[primaryClass.superClass + '/' + primaryClass.subClass + '/' + pubVol]
                || mapping[primaryClass.superClass + '/' + primaryClass.subClass]
                || mapping[primaryClass.superClass];

            if (typeof csnUtils === 'undefined') {
                csnUtils = global.sharedServices.csnUtils;
            }

            if (mappedType === EVENT_TOPIC_TYPE) {
                mappedType = csnUtils.htmlDecode(mappedType);
            }

            return mappedType;
        }

        this.getDocumentTypeByPrimaryClass = getDocumentTypeByPrimaryClass;

        /**
         * @param {velvet.rsi.entities.Document} document
         * @param {object} mapping
         * @returns {string}
         */
        this.getDocumentType = function(document, mapping) {
            var primaryClass = getPrimaryClass(document);
            var pubVol = self.extractPubVol(document);
            var mappedType = getDocumentTypeByPrimaryClass(primaryClass, pubVol, mapping);

            if (_.isObject(mappedType)) {
                mappedType = getComplexType(mappedType, document);
            }

            //if no mappedType specified, then we can get type from primaryClass
            //(the same logic is used in function enrichWithDocumentType)
            if (!mappedType && !document.documentType && primaryClass.subClass) {
                mappedType = csnUtils.decorateText(primaryClass.subClass);
            }

            return mappedType || document.documentType;
        };

        // ARMAC-452 Temporary solution will be removed when the Favorite page is migrated to react
        // Is equal as getDocumentTypeByPrimaryClass method from document-type.utils.ts
        /**
         * @param {velvet.rsi.entities.Document} document
         * @param {object} mapping
         * @returns {string}
         */
        this.getArmDocumentType = function(document, mapping) {
            var primaryClass = getPrimaryClass(document);
            var mappedTypeData = mapping[primaryClass.superClass + '/' + primaryClass.subClass] || mapping[primaryClass.superClass];

            var book = self.extractMetadata(document, 'pcicore:isInPublication', 'skos:prefLabel') || '';

            if (mappedTypeData && mappedTypeData.length) {
                var mappedType = mappedTypeData[0];

                for (var i = 0; i < mappedTypeData.length; i++) {
                    var item = mappedTypeData[i];

                    if (book && item.book && item.book === book) {
                        mappedType = item;
                        break;
                    } else if (!item.book) {
                        mappedType = item;
                    }
                }

                return mappedType.type;
            } if (document.documentType) {
                return document.documentType;
            }

            return primaryClass && primaryClass.subClass && csnUtils.decorateText(primaryClass.subClass);
        };

        /**
         * @param {velvet.rsi.entities.Document} document
         * @param {sting} rootValue
         * @param {sting} field
         * @returns {Promise}
         */
        this.getContextualizationFieldByRoot = function(document, rootValue, field) {
            var extendedMetadata = [];

            function getValue(metadata) {
                var fieldObj = null;
                var contextualizationObjByRoot = metadata.find(function(item) {
                    if (item.name !== 'contextualization') {
                        return false;
                    }

                    return item.attributes.find(function(item) {
                        return item.key === 'root' && item.value === rootValue;
                    });
                });

                if (contextualizationObjByRoot && contextualizationObjByRoot.attributes) {
                    fieldObj = contextualizationObjByRoot.attributes.find(function(item) {
                        return item.key === field;
                    });
                }

                return (fieldObj && fieldObj.value) || null;
            }

            if (_.isFunction(document.extendedMetadata)) extendedMetadata = document.extendedMetadata();
            else if (document.extendedMetadata) extendedMetadata = document.extendedMetadata;

            if (!extendedMetadata || !rootValue || !field) {
                return $q.when(null);
            }

            // We need additional extendedMetadata request when document don't have an object field.
            // These documents have metadata with a different interface. The interface structure doesn't suit us.
            if (extendedMetadata.objects) {
                var value = getValue(extendedMetadata.objects);

                return $q.when(value || null);
            }

            return $q.when(wkOsaResource.service.getExtendedMetadata(
                new wkOsaResource.GetExtendedMetadata({
                    documents: [new wkOsaResource.DocumentId({ id: document.id })],
                    extendedMetadataFields: ['contextualization']
                })))
                .then(function(extendedMetadataResult) {
                    return getValue(_.get(extendedMetadataResult, '[0].metadata[0].objects'));
                })
                .catch(function() {
                    return null;
                });
        };

        /**
         *
         * @param {osa.common.ExtendedMetadataGroup} group
         * @returns {osa.resource.common.ExtendedMetadataObject[]}
         */
        function reduceMetadataObjectsFromGroup(group) {
            var objects = [];

            if (!_.isEmpty(group.objects)) {
                objects = objects.concat(group.objects);
            }

            if (!_.isEmpty(group.groups)) {
                angular.forEach(group.groups, function(innerGroup) {
                    objects = objects.concat(reduceMetadataObjectsFromGroup(innerGroup));
                });
            }

            return objects;
        }

        this.reduceMetadataObjectsFromGroup = reduceMetadataObjectsFromGroup;
    }

    if (!isNode) {
        csn.services.$module.service('metadataService', [
            'appConstantsService',
            '$q',
            'csnUtils',
            'documentExtendedMetadataFields',
            'documentTypesMapping',
            'relatedItemConfig',
            'wkOsaResource',
            'stateList',
            MetadataService
        ]);
    } else {
        var appConstantsService = { get: require('./../../../../../server/services/utils/vars.util').wkVars.vars };

        global.sharedServices.metadataService = new MetadataService(appConstantsService);
    }
})(typeof exports === 'object');

(function(isNode) {
    var _ = isNode ? require('lodash') : window._;

    /**
     * @typedef Extractor
     * @property {Function} extract
     * 'extract' function returns data according the type of extractor
     */

    /* eslint new-cap: "off" */
    /**
     * @param {csn.services.UtilsService} csnUtils
     * @param {csn.services.headingMetadataConfig} headingMetadataConfig
     * @param {csn.services.MetadataService} metadataService
     * @returns {Object}
     */
    function headingOperators(csnUtils, headingMetadataConfig, metadataService) {
        var headingExtractors;

        /**
         *
         * @param {string} name
         * @param {string} attributeKey
         * @param {string} attributeValue
         * @param {string} xml
         * @param {function} postProcess
         */
        function HeadingExtractorByMetadata(name, attributeKey, attributeValue, xml, postProcess) {
            var self = this;

            self.names = _.isString(name) ? [name] : name;
            self.attributeKey = attributeKey;
            self.attributeValue = attributeValue;
            self.xml = xml;
            self.postProcess = postProcess;

            /**
             * @param {osa.resource.document | osa.resource.ContentTreeNode} entity
             * @returns {string}
             */
            self.extract = function(entity) {
                var data = '';
                self.names.some(function(name) {
                    data = metadataService.extractMetadata(
                        entity,
                        name,
                        attributeKey,
                        attributeValue
                    );

                    return !!data;
                });

                if (self.xml) {
                    data = metadataService.extractXmlData(data, self.xml.element, self.xml.attribute);
                }
                if (self.postProcess) {
                    data = self.postProcess(data);
                }

                return _.trim(data);
            };
        }

        headingExtractors = _.mapValues(headingMetadataConfig, function(value) {
            return new HeadingExtractorByMetadata(
                value.name,
                value.attributeKey,
                value.attributeValue,
                value.xml,
                value.postProcess
            );
        });

        /**
         * Returns a specific metadata extractor object by the key parameter. See headingMetadataConfig for keys.
         * @param {string} key
         * @returns {Extractor}
         */
        function getMetadataExtractor(key) {
            return headingExtractors[key];
        }

        /**
         * @type {Extractor}
         */
        var subClassExtractor = {
            extract: function(document) {
                return csnUtils.decorateText(metadataService.extractPrimaryClass(document).subClass).toUpperCase();
            }
        };

        /**
         * Returns extractor, that
         * creates an array of the results of the extractors passed as parameters.
         * @param {string|Extractor[]} extractors - names of extractors
         * @returns {Extractor}
         */
        function getUnionExtractor(extractors) {
            return {
                extract: function(entity) {
                    return extractAsUnion(entity, extractors);
                }
            };
        }

        /**
         * Returns extractor, that
         * creates string from the results of the extractors passed as parameters.
         * @param {Array<string|Extractor>} extractors of extractors | extractors
         * @param {string} separator
         * @returns {Extractor}
         */
        function getJoinExtractor(extractors, separator) {
            separator = _.isUndefined(separator) && ', ' || separator;

            return {
                extract: function(entity) {
                    return extractAsUnion(entity, extractors).join(separator);
                }
            };
        }

        /**
         * Returns extractor, that
         * returns first non-empty result from all the extractors passed as parameters.
         * @param {Array<string|Extractor>} extractors of extractors | extractors
         * @returns {Extractor}
         */
        function getFirstNotEmptyExtractor(extractors) {
            return {
                extract: function(entity) {
                    return extractFirstNotEmpty(entity, extractors);
                }
            };
        }

        /**
         * returns result of extractor's extraction from entity
         * @param {osa.resource.Document|osa.resource.ContentTreeNode} entity
         * @param {string|Extractor} extractor
         * @returns {string|undefined}
         */
        function getExtractorResult(entity, extractor) {
            if (_.isString(extractor)) {
                extractor = getMetadataExtractor(extractor);
            }

            return !_.isUndefined(extractor) ? extractor.extract(entity) : undefined;
        }

        /**
         * returns results of extractors's extraction from entity as array
         * @param {osa.resource.Document|osa.resource.ContentTreeNode} entity
         * @param {Array<string|Extractor>} extractors
         * @returns {string[]}
         */
        function extractAsUnion(entity, extractors) {
            var result = _.compact(extractors.map(function(extractor) {
                return getExtractorResult(entity, extractor);
            }));

            return _.chain(result)
                .flatten()
                .uniq()
                .value();
        }

        /**
         * returns first non-empty result of extractors's extraction from entity
         * @param {osa.resource.Document|osa.resource.ContentTreeNode} entity
         * @param {Array<string|Extractor>} extractors
         * @returns {string}
         */
        function extractFirstNotEmpty(entity, extractors) {
            var firstNotEmpty = '';
            extractors.some(function(extractor) {
                firstNotEmpty = getExtractorResult(entity, extractor);

                if (_.isArray(firstNotEmpty) && firstNotEmpty.length) {
                    firstNotEmpty = '';
                }

                return firstNotEmpty;
            });

            return firstNotEmpty;
        }

        /**
         *
         * @param {string} type - join | union | firstNotEmpty | metadata | subclass
         * @param {(string|Object)[]|string} [metaExtractors]
         * - list of names|objects of extractors (from headingMetadataConfig.js)
         * in case of type 'metadata' it should be just a string
         * @param {Object} [extraParams] - additional parameters (e.g. 'separator' for 'join'-type)
         * @returns {Extractor}
         */
        function getExtractor(type, metaExtractors, extraParams) {
            var extractor;
            switch (type) {
                case 'join':
                    if (extraParams && !_.isUndefined(extraParams.separator)) {
                        extractor = getJoinExtractor(metaExtractors, extraParams.separator);
                    } else {
                        extractor = getJoinExtractor(metaExtractors);
                    }
                    break;
                case 'union':
                    extractor = getUnionExtractor(metaExtractors);
                    break;
                case 'firstNotEmpty':
                    extractor = getFirstNotEmptyExtractor(metaExtractors);
                    break;
                case 'subclass':
                    extractor = subClassExtractor;
                    break;
                case 'metadata':
                    extractor = getMetadataExtractor(metaExtractors);
                    break;
                default:
                    extractor = null;
            }

            return extractor;
        }

        return {
            getExtractor: getExtractor
        };
    }

    if (isNode) {
        global.sharedServices.headingOperators = new headingOperators(
            global.sharedServices.csnUtils,
            global.sharedServices.headingMetadataConfig,
            global.sharedServices.metadataService
        );
    } else {
        csn.services.$module.factory('headingOperators', [
            'csnUtils',
            'headingMetadataConfig',
            'metadataService',
            headingOperators
        ]);
    }
})(typeof exports === 'object');

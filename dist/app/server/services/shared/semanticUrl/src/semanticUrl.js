(function(isNode) {
    var Entities = isNode ? require('html-entities').AllHtmlEntities : undefined;
    var _ = isNode ? require('lodash') : window._;

    /**
     * @param {csn.appConstantsService} appConstantsService
     * @param {bmb.services.csnUtils} csnUtils
     * @param {csn.services.HeadingExtractor} docHeadingExtractor
     * @param {csn.services.MetadataService} metadataService
     * @param {csn.common.config.RelatedItemConfig} relatedItemConfig
     * @constructor
     */
    function SemanticUrl(appConstantsService, csnUtils, docHeadingExtractor, metadataService, relatedItemConfig) {
        var self = this;
        var entities = isNode ? new Entities() : undefined;
        var SLUG_MAX_LENGTH = 800; // to avoid bugs like ACUS-1551 (very long urls fail to open)

        /**
         * @param {string} input
         * @returns {string}
         */

        var slug = function(input) {
            return _.deburr(input) // decode htmlentities (and strip tags)
                .toLowerCase()
                .replace(/[^\w!]+/g, '-') // replace every non-alphanumeric char with dash
                .slice(0, SLUG_MAX_LENGTH)
                .replace(/^-|-$/g, ''); // trim dashes
        };

        /**
         * @param {string} input
         * @returns {string}
         */
        this.slugify = function(input) {
            if (isNode) {
                return slug(entities.decode(input));
            }

            return slug($('<div>')
                .html(input)
                .text());
        };

        /**
         * @param {string} input
         * @returns {string}
         */
        this.slugifyUrl = function(input) {
            return slug(input);
        };

        /**
         * @param {boolean} isParent
         * @param {velvet.rsi.entities.Document} document
         * @param {string} documentType
         * @param {velvet.rsi.entities.Document=} context
         * @returns {string}
         */
        this.getSlug = function(isParent, document, documentType, context) {
            var codeSecNum = metadataService.extractCodeSectionNumber(context || document);
            var title = metadataService.extractOriginalTitle(document);

            var key = documentType + (isParent ? ' Parent' : '');
            if (!(key in relatedItemConfig.slugPatterns)) {
                throw new Error('Missing slug pattern for document type: ' + key);
            }
            var pattern = relatedItemConfig.slugPatterns[key];

            var placeholders = {
                title: self.slugify(title),
                codeSecNumber: codeSecNum ? 'code-section-' + self.slugify(codeSecNum) : ''
            };

            _.each(placeholders, function(value, key) {
                pattern = pattern.replace('{' + key + '}', value);
            });

            return pattern;
        };

        var cleanUrlCacheKey = null;
        var cleanUrlCacheValue = null;

        /**
         * Parse a code section url while we can, strip the remaining
         *
         * @param {string} url
         * @returns {string}
         */
        this.cleanUrl = function(url) {
            var current = 0;
            var suffix = url;
            var parts = [];
            var maxNumberOfParts = 25;
            var minUrlPartsNesting = 2;
            var guard = 0;

            if (cleanUrlCacheKey && cleanUrlCacheKey === url) {
                return cleanUrlCacheValue;
            }

            for (guard = maxNumberOfParts; guard > 0; guard--) {
                var idx = suffix.indexOf('/', current);
                if (idx < 0) {
                    idx = suffix.length;
                    if (idx <= 0) break;
                }

                parts.push([ suffix.substring(current, idx), current ]);
                current = idx + 1;
                if (current > suffix.length) break;
            }

            if (guard === 0) throw new Error('Infinite loop while trimming slug');

            if (parts.length < minUrlPartsNesting) return cacheResult(url);
            if (parts[1][0] !== 'document') return cacheResult(url); // no document, no slug

            for (var i = 3; i < parts.length; i++) {
                var part = parts[i][0];
                if (part in relatedItemConfig.relatedItemTitles || part === 'IRC') continue;
                if (relatedItemConfig.embeddedTabIds.indexOf(part) >= 0) continue;
                if (part === 'popout') {
                    i++;
                    continue;
                } // skip popout
                if (part === 'page') {
                    i++;
                    continue;
                } // skip pages
                if (part === 'nodes') {
                    i++;
                    continue;
                } // skip opened toc nodes

                return cacheResult(url.substring(0, parts[i][1]).replace(/\/$/, '')); // remove slug
            }

            return cacheResult(url);

            function cacheResult(result) {
                cleanUrlCacheKey = url;
                cleanUrlCacheValue = result;

                return result;
            }
        };

        /**
         * @param {velvet.rsi.entities.Document} document
         * @param {boolean=} isForceTopic
         * @returns {string}
         */
        this.generateCanonicalUrl = function(document, isForceTopic) {
            var topicIdSeparator = appConstantsService.get('topicIdSeparator');
            var semanticUrlParts = [appConstantsService.get('mainSeoHost')];
            var documentHeader =
                metadataService.extractOriginalTitle(document) || docHeadingExtractor.getDocumentTitle(document);
            var slug = self.slugify(documentHeader);
            var documentClasses = metadataService.extractPrimaryClass(document);
            var countryCode = metadataService.extractCountryCode(document);
            var documentSuperClass = documentClasses.superClass;
            var documentSubClass = documentClasses.subClass;

            var processNewsDocUrl = function(subClass) {
                return subClass === 'article' || subClass === 'column' ? 'journal' : 'news';
            };

            var processFederalDocUrl = function(superClass, subClass) {
                var url = 'federal';

                if (superClass === 'explanation' && subClass === 'explanation') {
                    url += '/irc/explanation';
                } else if (superClass === 'law' && subClass === 'codified') {
                    url += '/irc/current';
                } else if (superClass === 'agency-publication' && subClass === 'publication') {
                    url += '/irs';
                }

                return url;
            };

            var processStateDocUrl = function(superClass, subClass, document) {
                var url = 'state';

                if (superClass === 'explanation' && subClass === 'explanation') {
                    url +=
                        '/explanations/' +
                        metadataService
                            .extractRegion(document)
                            .toLowerCase()
                            .replace(/\s+/g, '-');
                }

                return url;
            };

            var documentId = csnUtils.ensureNotFullIrcId(document.id);

            if (
                isForceTopic ||
                (documentSuperClass === 'topical-landing-page' && documentSubClass === 'topical-landing-page')
            ) {
                semanticUrlParts.push('topic');
                semanticUrlParts.push(_.last(documentId.split(topicIdSeparator)));
            } else {
                semanticUrlParts.push('document');
                semanticUrlParts.push(documentId);

                switch (metadataService.extractPubVol(document)) {
                    case 'mtg01':
                        semanticUrlParts.push('mastertaxguide');
                        break;
                    case 'edg01':
                        semanticUrlParts.push('masterdepreciationguide');
                        break;
                    case 'arp60':
                        semanticUrlParts.push('legislation');
                        break;
                    default:
                        if (documentSuperClass === 'news') {
                            semanticUrlParts.push(processNewsDocUrl(documentSubClass));
                        } else if (countryCode === 'US') {
                            semanticUrlParts.push(processFederalDocUrl(documentSuperClass, documentSubClass));
                        } else if (/^US-/.test(countryCode)) {
                            semanticUrlParts.push(processStateDocUrl(documentSuperClass, documentSubClass, document));
                        }
                        break;
                }
            }

            semanticUrlParts.push(slug);

            return semanticUrlParts.join('/');
        };
    }

    if (isNode) {
        var appConstantsService = { get: require('../../../../../server/services/utils/vars.util').wkVars.vars };

        global.sharedServices.semanticUrl = new SemanticUrl(
            appConstantsService,
            global.sharedServices.csnUtils,
            global.sharedServices.docHeadingExtractor,
            global.sharedServices.metadataService
        );
    } else {
        csn.services.$module.service('semanticUrl', [
            'appConstantsService',
            'csnUtils',
            'docHeadingExtractor',
            'metadataService',
            'relatedItemConfig',
            SemanticUrl
        ]);
    }
})(typeof exports === 'object');

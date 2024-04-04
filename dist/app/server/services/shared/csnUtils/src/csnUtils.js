(function(isNode) {
    var Entities = isNode ? require('html-entities').AllHtmlEntities : undefined;
    var _ = isNode ? require('lodash') : window._;
    var btoa;

    if (isNode) {
        btoa = function(str) {
            Buffer.from(str, 'binary').toString('base64');
        };
    } else {
        btoa = window.btoa;
    }

    /**
     * @param {csn.appConstantsService} appConstantsService
     * @param {angular.$q} $q
     * @param {ui.router.$state} $state
     * @param {ui.router.$state} $stateParams
     * @param {angular.$window} $window
     * @param {csn.models.AuthModel} auth
     * @param {osa.personalitem} wkOsaPersonalitem
     * @param {osa.research} wkOsaResearch
     * @constructor
     */
    function UtilsService(
        appConstantsService,
        $q,
        $state,
        $stateParams,
        $window,
        auth,
        wkOsaPersonalitem,
        wkOsaResearch
    ) {
        var MAX_EXPORTED_FILENAME_LENGTH = 98;
        var entities = isNode ? new Entities() : undefined;
        var stateCodeRegexp = /-(...?)$/;
        var searchIdPrefixRegexp = /^\d+!/;
        var multiSearchIdPrefixRegexp = /(\w|-)+!/g;
        var allowedUserDomains = appConstantsService.get('showTlpMetadataForDomains');
        var maxExportedFilenameLength = appConstantsService.get('maxExportedFilenameLength') || MAX_EXPORTED_FILENAME_LENGTH;
        var datePostfix = 'T00:00:00';
        var isHttps = !isNode && $window.location.protocol.indexOf('https') > -1;

        /**
         * Surround the first 3 digits with a span to prevent skype plugin number recognition in MS IE browsers.
         *
         * @param {string} phone The phone number.
         * @returns {string}
         */
        this.transformPhoneNumber = function(phone) {
            var result = '';
            if (phone) {
                result = phone.replace(/(\d{3})/, '<span>$1</span>');
            }

            return result;
        };

        /**
         * Removes request variables from ftp urls.
         * @param {velvet.rsi.entities.Document} document The document entity.
         */
        this.formatPdfUrl = function(document) {
            var pattern = /^ftp:\/\//i;
            var url = document.url;

            if (pattern.test(url)) {
                var tks = url.split('?');
                document.url = tks[0];
            }
        };

        /**
         * Create document object for rs-single-document-view
         * @param {bmb.research.document.DocumentModel} document
         * @returns {Object}
         */
        this.createObjectForDocViewDir = function(document) {
            var type = '';

            if (document.document) {
                type = angular.isFunction(document.document) ? document.document().type : document.document.type;
            }

            return {
                documentId: document.documentId,
                searchId: document.searchItemId, // @todo shouldn't it be equal searchParams.searchId? (Now it doesn't)
                type: type ? type : '',
                document: document.document
            };
        };

        /**
         * Removes dashes and capitalizes letters
         * @param {string} item String to decorate.
         * @returns {string}
         */
        this.decorateText = function(item) {

            return item.split('-').map(function(part) {
                return part.charAt(0).toUpperCase() + part.substring(1);
            }).join(' ');
        };

        this.htmlDecode = function(text) {
            if (isNode) {
                return entities.decode(text);
            }

            var decodedText = this.removeTags(text);

            return angular.element('<textarea>').html(decodedText).text();
        };

        /**
         * Checks is query valid for search
         * @param {string} query
         * @returns {boolean}
         */
        this.checkQuery = function(query) {
            query = query && query.trim();

            return query && (!query.startsWith('*') || query === '*');
        };

        /**
         * Checks if the current state is popout or standalone
         * @returns {boolean} true if the current state is popout or standalone
         */
        this.isSingleOrStandaloneState = function() {
            return $state.includes('**.single') || $state.includes('**.standalone');
        };

        /**
         * Turns a model event into a promise.
         *
         * @param {string} eventName Name of the event which should be listened
         * @param {Object} eventSource Any event publisher via publish-subscribe model
         * @returns {Promise}
         */
        this.eventToPromise = function(eventName, eventSource) {
            var deferred = $q.defer();

            var unsubscribe = ( eventSource.on || eventSource.$on ).call(eventSource, eventName, function handlerFn() {
                deferred.resolve( arguments );
                if (eventSource.off) {
                    eventSource.off( eventName, handlerFn );
                } else {
                    unsubscribe();
                }
            } );

            return deferred.promise;
        };

        /**
         * Remove all tags from text
         * @param {string} text
         * @returns {string}
         */
        this.removeTags = function(text) {
            return text ? text.replace(/<[^>]+>/g, '') : '';
        };

        /**
         * Multi-keys sorting in natural order. Don't sort if order undefined
         * @param {array} collection Array of objects to sort
         * @param {string|array} orderBy String or array of keys by which provide sorting
         * @param {boolean} isReversedOrder the flag of reversed list
         * @returns {array}
         */
        this.sortByNaturalOrder = function(collection, orderBy, isReversedOrder) {
            if (!collection) return [];
            if (!orderBy) return collection;

            if (!_.isArray(orderBy)) {
                orderBy = new Array(orderBy);
            }
            var orderKey;

            function naturalComparator(a, b) {
                var ax = getSortTokens(a);
                var bx = getSortTokens(b);

                function getSortTokens(elem) {
                    var tokens = [];
                    if (elem) {
                        elem.replace(/(\d+)|(\D+)/g, function(_, $1, $2) {
                            tokens.push([ $1 || Infinity, $2 || '' ]);
                        });
                    } else {
                        tokens.push(['']);
                    }

                    return tokens;
                }

                while (ax.length && bx.length) {
                    var an = ax.shift();
                    var bn = bx.shift();
                    var nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
                    if (nn) return isReversedOrder ? -nn : nn;
                }

                return ax.length - bx.length;
            }

            return collection.sort(function(objA, objB) {
                for (var i = 0; i < orderBy.length; i++) {
                    orderKey = orderBy[i];
                    if (objA[orderKey] === objB[orderKey]) {
                        continue;
                    }

                    return naturalComparator(objA[orderKey], objB[orderKey]);
                }

                return 0;
            });
        };

        /**
         * Encodes the document title parameter for CF. The title is utf-8 encoded,
         * then base64 before it's passed to CF.
         * @param {string} title
         * @returns {string}
         */
        this.encodeDocTitleParam = function(title) {
            return this.base64EncodeUtf8(title);
        };

        /**
         * Encodes the document title parameter for CF and URL encodes it. The title is utf-8 encoded,
         * then base64 and finally URL encoded before it's passed to CF.
         * @param {string} title
         * @returns {string}
         */
        this.encodeDocTitleParamForURL = function(title) {
            return encodeURIComponent(this.encodeDocTitleParam(title));
        };

        this.decodeDocTitleParam = function(title) {
            return this.base64DecodeUtf8(decodeURIComponent(title));
        };

        /**
         * Encodes a utf-8 string in base64
         * @param {string} string
         * @returns {string}
         */
        this.base64EncodeUtf8 = function(string) {
            string = (string || '').replace(/\r\n/g, '\n');
            var utftext = '';

            for (var n = 0; n < string.length; n++) {

                var c = string.charCodeAt(n);

                if (c < 128) {                                             // eslint-disable-line
                    utftext += String.fromCharCode(c);
                }
                else if ((c > 127) && (c < 2048)) {                        // eslint-disable-line
                    utftext += String.fromCharCode((c >> 6) | 192);        // eslint-disable-line
                    utftext += String.fromCharCode((c & 63) | 128);        // eslint-disable-line
                }
                else {
                    utftext += String.fromCharCode((c >> 12) | 224);       // eslint-disable-line
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128); // eslint-disable-line
                    utftext += String.fromCharCode((c & 63) | 128);        // eslint-disable-line
                }

            }

            return btoa(utftext);
        };

        /**
         * Decodes a base64 encoded utf-8 string
         * @param {string} str
         * @returns {string}
         */
        this.base64DecodeUtf8 = function(str) {
            str = str || '';

            var utftext;
            var c = 0;
            var c2 = 0;
            var c3;
            var string = '';
            var i = 0;

            try {
                utftext = atob(str);
            } catch (e) {
                return '';
            }

            while (i < utftext.length) {

                c = utftext.charCodeAt(i);

                if (c < 128) {                                                                      // eslint-disable-line
                    string += String.fromCharCode(c);
                    i++;
                }
                else if ((c > 191) && (c < 224)) {                                                  // eslint-disable-line
                    c2 = utftext.charCodeAt(i + 1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));                     // eslint-disable-line
                    i += 2;                                                                         // eslint-disable-line
                }
                else {
                    c2 = utftext.charCodeAt(i + 1);
                    c3 = utftext.charCodeAt(i + 2);                                                 // eslint-disable-line
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)); // eslint-disable-line
                    i += 3;                                                                         // eslint-disable-line
                }

            }

            return string;
        };

        /**
         * Removes the searchId prefix from a result entity's id.
         * @param {string} id
         * @returns {string}
         */
        this.removeSearchIdPrefix = function(id) {
            return id.replace(searchIdPrefixRegexp, '');
        };

        /**
         * Returns document id without prefixes
         * @param {string} id
         * @returns {string}
         */
        this.getIdWithoutPrefixes = function(id) {
            return id.replace(multiSearchIdPrefixRegexp, '');
        };

        /**
         * Extracts the state code from the end of the parameter string
         * @param {string} param a string which endswith state code like '-NY'
         * @returns {*|boolean}
         */
        this.extractStateCode = function(param) {
            var matches = param.match(stateCodeRegexp);

            return matches && matches.length > 1 && matches[1];
        };

        /**
         * Extracts the country code from the end of the parameter string
         * @param {string} param a string which endswith state code like '_AF'
         * @returns {string}
         */
        this.extractCountryCode = function(param) {
            var matches = param.split('_');

            return matches && matches.length > 1 && matches[1] || '';
        };

        /**
         * Fixing backslash error '/' included in a search, translated as "%2F"
         * @param {string} searchTerm a string which is the search query
         * @returns {string}
         */
        this.decodeSearchTerm = function(searchTerm) {
            searchTerm = searchTerm || '';

            return decodeURIComponent(unescape(searchTerm).replace(/%/g, '%25'))
                .replace(/(%2F)/gi, '/')
                .replace(/(~2F)/g, '/');
        };

        /**
         * Encode the special characters in the search query to use it in the uri
         * @param {string} searchTerm a string which is the search query
         * @returns {string}
         */
        this.encodeSearchTerm = function(searchTerm) {
            return searchTerm ? encodeURIComponent(searchTerm) : searchTerm;
        };

        /**
         * Handle special characters in search query for generating new RegExp
         * @param {string} query string, which is the search query
         * @returns {string}
         */
        this.handleSpecialCharactersInSearchQuery = function(query) {
            return query ? query.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1') : query;
        };

        /**
         * Generate new RegExp for prefix search
         * @param {string} query string, which is the search query
         * @returns {RegExp}
         */
        this.generateRegexForPrefixSearch = function(query) {
            return new RegExp('(?:^' + this.handleSpecialCharactersInSearchQuery(query) +
                ')|(?:\\(' + this.handleSpecialCharactersInSearchQuery(query) +
                ')|(?:\\s' + this.handleSpecialCharactersInSearchQuery(query) +
                ')|([/—-]' + this.handleSpecialCharactersInSearchQuery(query) +
                ')', 'gi');
        };

        /**
         * @param {string} possiblyFullId
         * @returns {string}
         */
        this.ensureNotFullIrcId = function(possiblyFullId) {
            return possiblyFullId.replace(/FULL$/, '');
        };

        /**
         * Ensures provided protocol is used in link
         * If there is no protocol  if no protocol is passed, it is set to  // - same as origin proto
         * @param {string} link to process
         * @param {string} protocol to set if no protocol is passed, it is set to same as host "//"
         * @returns {string}
         */
        this.ensureLinkProtocol = function(link, protocol) {
            var regExp = /^(([A-z0-9]+\:\/\/)|(\/\/))?(.+)/;

            return link.replace(regExp, (protocol || '') + (protocol ? ':' : '') + '//$4');
        };

        /**
         * Ensures HTTPS protocol is used in link
         * If there is no protocol link then just https://
         * @param {string} link to process
         * @returns {string}
         */
        this.ensureLinkHTTPS = function(link) {
            return this.ensureLinkProtocol(link, 'https');
        };

        /**
         * Ensures protocol is used in link is // - same as origin proto
         * @param {string} link link to process
         * @returns {string}
         */
        this.ensureLinkSameProtocol = function(link) {
            return this.ensureLinkProtocol(link);
        };

        /**
         * Change link protocol from ftp to http
         * @param {string} link The document url.
         * @return {string}
         */
        this.convertLinkToHttp = function(link) {
            return link ? link.replace(/^ftp:\/\//i, 'http://') : '';
        };

        /**
         * Removes particular words from string
         * @param {string} query to clean
         * @param {array} words Array of strings to remove
         * @return {string}
         */
        this.removeWordsFromQuery = function(query, words) {
            _.forEach(words, function(word) {
                query = query.replace(new RegExp('\\b' + word + '\\b', 'gi'), '');
            });

            return query;
        };

        /**
         * Hidden TaxTypeInfo (CSN-7160) and ModifiedDate (CSN-9881) features are available only for @wolterskluwer.com
         * and @cch.com users
         * @returns {Object}
         */
        this.checkUserProfile = function() {
            var isHiddenFeatureAvailable = false;

            return auth.getUserProfile().then(function(userProfile) {

                if (userProfile && allowedUserDomains && !!allowedUserDomains.length) {
                    isHiddenFeatureAvailable = _.some(allowedUserDomains, function(item) {
                        return userProfile.id && userProfile.id.match(new RegExp(item));
                    });
                }

                var email = userProfile.email || userProfile.id;

                return $q.when({
                    userID: email,
                    isHiddenFeatureAvailable: isHiddenFeatureAvailable
                });

            });
        };

        this.getAlphabet = function(cFrom, cTo) {
            cFrom = cFrom || 'A';
            cTo = cTo || 'Z';

            var iStart = cFrom.charCodeAt(0);

            return Array.apply(null, Array(cTo.charCodeAt(0) - iStart + 1)).map(function(_, i) {
                return String.fromCharCode(iStart + i);
            });
        };

        this.toCapitalizeCase = function(title) {
            return title.replace(/\w*/gi, function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        };

        this.isDocumentHistoryItem = function(item) {
            return item instanceof wkOsaPersonalitem.DocumentHistoryItem;
        };

        this.isSearchHistoryItem = function(item) {
            return item instanceof wkOsaPersonalitem.SearchHistoryItem;
        };

        /**
         * @param {angular.IAugmentedJQuery} element
         * @returns {boolean} true if element is inside pop-up
         */
        this.isInsidePopup = function(element) {
            return element.parents('bmb-popup').length > 0;
        };

        /**
         * @param {string} input
         * @returns {{documentId: string, citation: string?, pit: string?}}
         */
        this.parsePersistentDocumentLocator = function(input) {
            var result = {};

            var withoutCitation = input.replace(/^\((.*)\)/, function(match, citation) {
                result.citation = citation;

                return '';
            });

            result.documentId = withoutCitation.replace(/<([^<]*)>$/, function(match, pit) {
                result.pit = pit;

                return '';
            });

            return result;
        };

        /**
         * Returns the last state node from path with 'csh' type
         * @param {Object} path
         * @returns {Object} node
         */
        this.getLastStateNode = function(path) {
            return _.findLast(path, function(node) {
                return node && node.type ? node.type.toLowerCase() === 'csh' : !node.tableOfContentsNode;
            });
        };

        /**
         * Remove useless savedSearch entity
         * @param {id} id of the entity
         * @returns {Promise<void>}
         */
        this.removeSavedSearchItem = function(id) {
            return wkOsaResearch.service.savedSearches.remove(id)
                .catch(function(error) {
                    //eslint-disable-next-line no-console
                    console.warn('An error happened during removing saved search entity: ' + error);
                });
        };

        // Ensures filename is valid for the most of the file systems.
        // Replaces  /, \, ", *, ?, <, >, |, : to - in the name of the file
        // Truncates the title to appConstantsService.maxExportedFilenameLength
        this.escapeFilename = function(name) {
            var cleanTitle = name.replace(/[\"\*\/\:\<\>\?\\\|]/g, ' ');

            return cleanTitle.substring(0, maxExportedFilenameLength);
        };

        this.getContextId = function() {
            return $stateParams.codeSectionId || $stateParams.contextId || $stateParams.contextDocumentId;
        };

        this.convertDateToLocale = function(date) {
            if (date) {
                return new Date(date + datePostfix);
            }

            return null;
        };

        this.isHttps = function() {
            return isHttps;
        };

        this.getDocumentId = function(doc) {
            return doc.documentId || _.last(doc.id.split('!'));
        };

        this.getNodeTeid = function(nodeId) {
            return Number(nodeId.match(/#teid-(\d+)$/)[1]);
        };

        this.splitArrayEvenly = function(array, numberOfChunks) {
            var result = [];
            var lengthOfChunk;

            for (var i = 0; i < array.length; i += result[result.length - 1].length) {
                lengthOfChunk = Math.ceil((array.length - _.sumBy(result, 'length')) / numberOfChunks);
                result.push(array.slice(i, i + lengthOfChunk));
                --numberOfChunks;
            }

            return result;
        };

        this.getDocumentIdByState = function() {
            var fullPostfix = 'FULL';
            switch ($state.current.name) {
                case 'main.federal.irc.history.single':
                case 'main.federal.irc.committeeReports.single':
                case 'main.federal.regulations.single':
                case 'main.federal.explanations.single':
                case 'main.federal.casesAndGuidance.current.cases.single':
                case 'main.federal.casesAndGuidance.current.rulings.single':
                case 'main.federal.casesAndGuidance.annotations.single':
                case 'main.federal.irsPubs.single':
                case 'main.state.statutes.single':
                case 'main.state.regulations.single':
                case 'main.document':
                case 'main.node.treatise':
                case 'main.node.journal':
                case 'main.contentsDocument':
                case 'main.treaty.document':
                case 'main.news.doc':
                case 'main.standalone':
                case 'main.standalone.slug':
                case 'freemiumSubscribe':
                    return $state.params.documentId;
                case 'main.topic.single':
                case 'main.topic.single.slug':
                    return $state.params.topicId;
                case 'main.news.event':
                    return $state.params.eventId;
                case 'main.state.casesAndRulings.list':
                    return $state.params.citeId;
                case 'main.state.explanations':
                    return $state.params.contextId;
                case 'main.federal.irc.current':
                    var codeSectionId = $state.params.codeSectionId;

                    return (_.endsWith(codeSectionId, fullPostfix))
                        ? codeSectionId
                        : (codeSectionId + fullPostfix);
                case 'main.statenavigator.tax.popoutDocument':
                case 'main.multistatebrowse.tax.popoutDocument':
                    return $state.params.popoutDocumentId;
                default:
                    return $state.params.documentId ? $state.params.documentId : null;
            }
        };

        this.removeLastSlashInUrl = function(url) {
            return url.replace(/\/$/, '');
        };

        this.addRelsNoFollow = function(element, selector) {
            element.find(selector).each(function(key, elem) {
                elem.setAttribute('rel', 'nofollow');
            });
        };

        this.getUrlOrigin = function(url) {
            var HOSTNAME_PATH_INDEX = 2;
            var pathArray = url.split('/');
            var protocol = pathArray[0];
            var hostname = pathArray[HOSTNAME_PATH_INDEX];

            return protocol + '//' + hostname;
        };
    }

    if (isNode) {
        var appConstantsService = { get: require('../../../../../server/services/utils/vars.util').wkVars.vars };

        global.sharedServices.csnUtils = new UtilsService(appConstantsService);
    } else {
        csn.services.$module.service('csnUtils', [
            'appConstantsService',
            '$q',
            '$state',
            '$stateParams',
            '$window',
            'auth',
            'wkOsaPersonalitem',
            'wkOsaResearch',
            UtilsService
        ]);
    }
})(typeof exports === 'object');

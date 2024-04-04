(function(isNode) {
    /* eslint new-cap: "off" */
    /**
     * @param {csn.services.HeadingOperators} headingOperators
     * @returns {Object}
     */
    function searchHeadingMapping(headingOperators) {
        var getExtractor = headingOperators.getExtractor;

        var searchHeadingMapping = {
            'explanation': {
                subClasses: {
                    treatise: getExtractor(
                        'union',
                        [ 'title', getExtractor('firstNotEmpty', [ 'daTitle', 'publicationInfo' ]) ]
                    )
                }
            },
            'case-law': getExtractor('join', [ 'primaryCitation', 'caseAbbrevName' ]),
            'law': {
                subClasses: {
                    codified: getExtractor('join', [ 'num', 'region', 'title' ])
                }
            },
            'news': getExtractor('union', [ 'title', getExtractor('join', [ 'daTitle', 'sortDate' ]) ]),
            'ruling': {
                default: getExtractor('union', [ 'title', getExtractor('join', [ 'primaryCitation', 'sortDate' ]) ]),
                subClasses: {
                    'revenue-procedure': getExtractor('join', [ 'primaryCitation', 'sortDate' ]),
                    'revenue-ruling': getExtractor('join', [ 'title', 'sortDate' ]),
                    'notice': getExtractor('join', [ 'title', 'sortDate' ]),
                    'letter-ruling': getExtractor('metadata', 'title'),
                    'release': getExtractor('join', [ 'title', 'sortDate' ])
                }
            },
            'introductory-material': getExtractor('union', [ 'title', 'daTitle' ]),
            'periodical': {
                subClasses: {
                    'newsletter': getExtractor('union', [ 'title', getExtractor('join', [ 'daTitle', 'sortDate' ]) ]),
                    'journal': getExtractor('union', [ 'title', getExtractor('join', [ 'daTitle', 'sortDate' ]) ]),
                    'report-letter': getExtractor('union', [ 'title', getExtractor('join', [ 'daTitle', 'sortDate' ]) ])
                }
            }
        };

        return searchHeadingMapping;
    }

    if (isNode) {
        global.sharedServices.searchHeadingMapping = searchHeadingMapping(global.sharedServices.headingOperators);
    } else {
        csn.services.$module.factory('searchHeadingMapping', [
            'headingOperators',
            searchHeadingMapping
        ]);
    }
})(typeof exports === 'object');

(function(isNode) {
    /* eslint new-cap: "off" */
    /**
     * @param {csn.services.HeadingOperators} headingOperators
     * @returns {Object}
     */
    function documentHeadingMapping(headingOperators) {
        var getExtractor = headingOperators.getExtractor;

        var documentHeadingMapping = {
            'agency-publication': getExtractor(
                'join',
                [ 'num', 'title', 'region', 'primaryCitation', 'issuingBody', 'sortDate' ]
            ),
            'annotation': getExtractor('join', ['title']),
            'authoritative-rules-procedures': getExtractor(
                'join',
                [ 'title', 'primaryCitation', 'issuingBody', 'sortDate' ]
            ),
            'case-law': getExtractor('join', [ 'primaryCitation', 'caseAbbrevName', 'sortDate' ]),
            'committee-report': getExtractor(
                'join',
                [ 'title', 'region', 'issuingBody', 'primaryCitation', 'sortDate' ]
            ),
            'explanation': {
                default: getExtractor('join', [ 'region', 'title' ]),
                subClasses: {
                    'treatise': getExtractor('metadata', 'title'),
                    'history-note': getExtractor('metadata', 'title')
                }
            },
            'finder': getExtractor('metadata', 'title'),
            'form': getExtractor('join', [ 'num', 'title' ]),
            'international-agreement': getExtractor('join', [ getExtractor('subclass'), 'title' ]),
            'introductory-material': getExtractor('metadata', 'title'),
            'law': {
                default: getExtractor('join', [ 'num', 'region', 'title' ], { separator: ' ' }),
                subClasses: {
                    codified: getExtractor('join', [ 'region', 'title' ]),
                    law: getExtractor('join', [ 'num', 'region', 'PlNormLinkValue', 'title' ], { separator: ' ' })
                }
            },
            // extraction of 'da-title' has not been implemented,
            // because the sample document does not contain this data
            'news': getExtractor('join', ['title'/*, 'object[@name=’da-title’]'*/] ),
            'pending-legislation': getExtractor(
                'join',
                [ 'title', 'primaryCitation', getExtractor('firstNotEmpty', [ 'officialHistoryDate', 'sortDate' ]) ]
            ),
            // extraction of 'issue-number' and 'report-number' has not been implemented,
            // because there was no sample document, which contains this data
            'periodical': {
                default: getExtractor(
                    'join',
                    [ getExtractor('firstNotEmpty', [ /*'issue-number', 'report-number'*/] ), 'title' ]
                ),
                subClasses: {
                    'newsletter': getExtractor('join', [ 'daTitle', 'title' ]),
                    'journal': getExtractor('join', [ 'daTitle', 'title' ]),
                    'report-letter': getExtractor('join', [ 'daTitle', 'title' ])
                }
            },
            'practice-aid': getExtractor('metadata', 'title'),
            'regulation': getExtractor('join', [ 'region', 'num', 'title' ]),
            'ruling': getExtractor('join', [ 'title', 'primaryCitation', 'issuingBody', 'sortDate' ]),
            'topical-landing-page': getExtractor('metadata', 'title')
        };

        return documentHeadingMapping;
    }

    if (isNode) {
        global.sharedServices.documentHeadingMapping = documentHeadingMapping(global.sharedServices.headingOperators);
    } else {
        csn.services.$module.factory('documentHeadingMapping', [
            'headingOperators',
            documentHeadingMapping
        ]);
    }
})(typeof exports === 'object');

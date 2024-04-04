(function(isNode) {

    /* eslint new-cap: "off" */
    /**
     * @param {csn.services.HeadingOperators} headingOperators
     * @param {csn.services.SearchHeadingMapping} searchHeadingMapping
     * @returns {Object}
     */
    function topicHeadingMapping(
        headingOperators,
        searchHeadingMapping
    ) {
        var getExtractor = headingOperators.getExtractor;

        var topicHeadingMapping = Object.assign({}, searchHeadingMapping, {
            'regulation': getExtractor('join', [ 'region', 'num', 'regType', 'title' ]),
            'case-law': getExtractor('join', [ 'primaryCitation', 'caseAbbrevName', 'sortDate' ])
        });

        return topicHeadingMapping;
    }

    if (isNode) {
        global.sharedServices.topicHeadingMapping = topicHeadingMapping(
            global.sharedServices.headingOperators,
            global.sharedServices.searchHeadingMapping
        );
    } else {
        csn.services.$module.factory('topicHeadingMapping', [
            'headingOperators',
            'searchHeadingMapping',
            topicHeadingMapping
        ]);
    }
})(typeof exports === 'object');

(function(isNode) {
    var _ = isNode ? require('lodash') : window._;
    var moment = isNode ? require('moment') : window.moment;

    function headingMetadataConfig() {

        var citationsPostProcessor = function(citations) {
            //test against IRB cites
            var checkIRBCites = /^((IRB)|(I\.R\.B\.))\s\d{2}(\d{2})?-\d{1,2},\s\d{1,4}/;
            //test against CB cites
            var checkCBCites = /^\d{2}(\d{2})?-0?(1|2)\s((CB)|(C.B.))\s\d{1,4}/;

            if (!_.isArray(citations)) {
                return citations;
            }

            if (citations.length > 1) {
                //If there are more than one citations IRB and CB citations should be excluded
                return citations.filter(function(citation) {
                    return !( checkIRBCites.test(citation) || checkCBCites.test(citation) );
                });
            }

            return citations;
        };

        var issuingBodyPostProcessor = function(items) {
            if (!_.isArray(items)) {
                return items;
            }

            return _.difference(items, [ 'IRS', 'Internal Revenue Service' ]);
        };

        var regionPostProcessor = function(region) {
            var checkUSRegion = /United States/i;
            var checkMultistateRegion = /multistate/i;

            return region && !region.match(checkUSRegion) && !region.match(checkMultistateRegion) ? region : '';
        };

        var dateFormatter = function(dateStr) {
            if (!dateStr) return '';

            return moment(dateStr).format('(MMM. D, YYYY)');
        };

        var codeSectionFormatter = function(codeSec) {
            return codeSec && '&sect;' + codeSec;
        };

        var regulationTypeFormatter = function(regType) {
            return regType ? '(' + regType.toUpperCase() + ')' : '';
        };

        var getPlFromNormLinkValue = function(normLinkValue) {
            var values = _.split(normLinkValue, ';');
            if (values[0].startsWith('PL')) {
                return values[0].replace('PL', 'P.L. ');
            }

            return '';
        };

        var officialHistoryDateFormatter = function(dateArray) {
            return dateFormatter(dateArray.toString());
        };

        return {
            codeSec: {
                name: 'codeSecValue',
                attributeKey: 'codesec',
                postProcess: codeSectionFormatter
            },
            num: {
                name: 'document-num',
                attributeKey: 'publisher-uri',
                attributeValue: 'http://wk-us.com/meta/publishers/#CCH'
            },
            title: {
                name: 'title',
                attributeKey: 'type',
                attributeValue: 'standard'
            },
            titleSearch: {
                name: 'title',
                attributeKey: 'type',
                attributeValue: 'search'
            },
            region: {
                name: 'region',
                postProcess: regionPostProcessor
            },
            caseAbbrevName: {
                name: 'wkcase-law:metadata',
                xml: {
                    element: 'case-abbrev-name'
                }
            },
            primaryCitation: {
                name: [
                    'wkcase-law:metadata',
                    'wkrul:metadata'
                ],
                xml: {
                    element: 'document-number[type="primary-citation"]'
                },
                postProcess: citationsPostProcessor
            },
            issuingBody: {
                name: [
                    'wkagency-pub:metadata',
                    'wkcom-rep:metadata'
                ],
                xml: {
                    element: 'issuing-body'
                },
                postProcess: issuingBodyPostProcessor
            },
            sortDate: {
                name: 'sort-date',
                attributeKey: 'date',
                postProcess: dateFormatter
            },
            daTitle: {
                name: 'da-title'
            },
            pubVol: {
                name: 'pubVol'
            },
            regType: {
                name: 'reg-type',
                postProcess: regulationTypeFormatter
            },
            PlNormLinkValue: {
                name: 'norm-link-values',
                attributeKey: 'publisher-uri',
                attributeValue: 'http://wk-us.com/meta/publishers/#CCH',
                postProcess: getPlFromNormLinkValue
            },
            officialHistoryDate: {
                name: 'wkpend-leg:metadata',
                xml: {
                    element: 'official-history-date',
                    attribute: 'date'
                },
                postProcess: officialHistoryDateFormatter
            },
            publicationInfo: {
                name: 'publication-info',
                xml: {
                    element: 'publication-title'
                }
            }
        };
    }

    if (isNode) {
        global.sharedServices.headingMetadataConfig = headingMetadataConfig();
    } else {
        csn.services.$module.factory('headingMetadataConfig', headingMetadataConfig);
    }
})(typeof exports === 'object');

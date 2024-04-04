(function(isNode) {
    var _ = isNode ? require('lodash') : window._;

    function TaxPrepPartnerDictionary() {
        var packsStr =
            [ 'tpz01', 'btp08', 'ctp09', 'atp10', 'atp11', 'atp12', 'atp13', 'atp14', 'atp15', 'tpz06', 'ctp08',
              'dtp09', 'gtp10', 'ftp11', 'ftp12', 'ftp13', 'ftp14', 'ftp15', 'tpz02', 'dtp08', 'ftp09', 'btp10',
              'btp11', 'btp12', 'btp13', 'btp14', 'btp15', 'tpz03', 'ftp08', 'gtp09', 'ctp10', 'ctp11', 'ctp12',
              'ctp13', 'ctp14', 'ctp15', 'tpz04', 'gtp08', 'htp09', 'dtp10', 'dtp11', 'dtp12', 'dtp13', 'dtp14',
              'dtp15', 'tpz09', 'itp09', 'jtp10', 'itp11', 'itp12', 'itp13', 'itp14', 'itp15', 'tpz08', 'atp09',
              'itp10', 'htp11', 'htp12', 'htp13', 'htp14', 'htp15', 'tpz05', 'atp08', 'btp09', 'ftp10', 'etp11',
              'etp12', 'etp13', 'etp14', 'etp15', 'tpz12', 'mtp10', 'ltp11', 'ltp12', 'ltp13', 'ltp14', 'ltp15',
              'tpz10', 'jtp09', 'ktp10', 'jtp11', 'jtp12', 'jtp13', 'jtp14', 'jtp15', 'tpz07', 'htp08', 'ktp09',
              'htp10', 'gtp11', 'gtp12', 'gtp13', 'gtp14', 'gtp15', 'tpz11', 'ltp09', 'ltp10', 'ktp11', 'ktp12',
              'ktp13', 'ktp14', 'ktp15', 'tpx01' ];
        var packsMap = _.mapKeys(packsStr);

        this.isInDictionary = function(pubvol) {
            return !!packsMap[pubvol];
        };
    }

    if (isNode) {
        global.sharedServices.taxPrepPartnerDictionary = new TaxPrepPartnerDictionary();
    } else {
        csn.pages.results.$module.service('taxPrepPartnerDictionary', [
            TaxPrepPartnerDictionary
        ]);
    }
})(typeof exports === 'object');

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DATitlesHelpers = void 0;
const lodash_1 = require("lodash");
const global_constants_1 = require("../global.constants");
const sharedServices = global.sharedServices;
class DATitlesHelpers {
    static init() {
        const { explanationPubs, modelTreatyPubs, conventionPubs, finderPubs, newsPubs, toolsPubs, rulingsPubs, formsPubs, 
        // journalArticlePubs,
        // journalColumnPubs,
        caseStudyPubs, checklistsPubs, practiceAidPubs, introductoryMaterial, modelLawPubs, compactLawPubs, codifiedLawPubs, proposedRegulationPubs, billPubs, } = global_constants_1.vars.get('pubsToShowDaTitle');
        const primarySourcePubs = global_constants_1.vars.get('BEPSGlobalPrimarySourcePubs');
        const explanationPubsMap = lodash_1.mapKeys(explanationPubs);
        const modelTreatyPubsMap = lodash_1.mapKeys(modelTreatyPubs);
        const conventionPubsMap = lodash_1.mapKeys(conventionPubs);
        const finderPubsMap = lodash_1.mapKeys(finderPubs);
        const newsPubsMap = lodash_1.mapKeys(newsPubs);
        const toolsPubsMap = lodash_1.mapKeys(toolsPubs);
        const rulingsPubsMap = lodash_1.mapKeys(rulingsPubs);
        const formsPubsMap = lodash_1.mapKeys(formsPubs);
        // const journalArticlePubsMap = mapKeys(journalArticlePubs);
        // const journalColumnPubsMap = mapKeys(journalColumnPubs);
        const caseStudyPubsMap = lodash_1.mapKeys(caseStudyPubs);
        const checklistsPubsMap = lodash_1.mapKeys(checklistsPubs);
        const practiceAidPubsMap = lodash_1.mapKeys(practiceAidPubs);
        const introductoryMaterialMap = lodash_1.mapKeys(introductoryMaterial);
        const explanationPubsPrimarySourceMap = lodash_1.mapKeys(primarySourcePubs.explanationPubs);
        const modelLawPubsMap = lodash_1.mapKeys(modelLawPubs);
        const compactLawPubsMap = lodash_1.mapKeys(compactLawPubs);
        const codifiedLawPubsMap = lodash_1.mapKeys(codifiedLawPubs);
        const proposedRegulationPubsMap = lodash_1.mapKeys(proposedRegulationPubs);
        const billPubsMap = lodash_1.mapKeys(billPubs);
        DATitlesHelpers.pubsMapFactory = {
            'explanation/explanation': explanationPubsMap,
            'international-agreement/model-treaty': modelTreatyPubsMap,
            'international-agreement/convention': conventionPubsMap,
            'finder/topical-index': finderPubsMap,
            'news/story': newsPubsMap,
            'practice-aid/application-proxy': toolsPubsMap,
            'ruling/ruling': rulingsPubsMap,
            'form': formsPubsMap,
            'news/article': rulingsPubsMap,
            'news/column': formsPubsMap,
            'practice-aid/case-study': caseStudyPubsMap,
            'practice-aid/checklist': checklistsPubsMap,
            'practice-aid/practice-aid': practiceAidPubsMap,
            'introductory-material/preface': introductoryMaterialMap,
            'introductory-material/introduction': introductoryMaterialMap,
            'introductory-material/about-the-author': introductoryMaterialMap,
            'law/model-law': modelLawPubsMap,
            'law/compact': compactLawPubsMap,
            'law/codified': codifiedLawPubsMap,
            'regulation/proposed-regulation': proposedRegulationPubsMap,
            'pending-legislation/bill': billPubsMap,
        };
        DATitlesHelpers.pubsPrimarySourceMapFactory = {
            'explanation/explanation': explanationPubsPrimarySourceMap,
        };
    }
    static isPrimarySource(document) {
        const { superClass, subClass } = sharedServices.metadataService.extractPrimaryClass(document);
        const pub = sharedServices.metadataService.extractPubVol(document);
        const pubsMap = this.pubsPrimarySourceMapFactory[`${superClass}/${subClass}`];
        return !!pubsMap && !!pubsMap[pub];
    }
    static showDaTitle(document) {
        const { superClass, subClass } = sharedServices.metadataService.extractPrimaryClass(document);
        const pub = sharedServices.metadataService.extractPubVol(document);
        const mappedType = subClass ? `${superClass}/${subClass}` : superClass;
        const pubsMap = this.pubsMapFactory[mappedType];
        return !!pubsMap && !!pubsMap[pub];
    }
    // arm section:
    static isArmDocument(document) {
        const pubVol = sharedServices.metadataService.extractPubVol(document);
        return pubVol === null || pubVol === void 0 ? void 0 : pubVol.startsWith('armac');
    }
}
exports.DATitlesHelpers = DATitlesHelpers;
// duplicates app\wk-ac-ui\src\wk-ac-ui\csn-search\services\daTitlesForPubsService.ts
DATitlesHelpers.pubsPrimarySourceMapFactory = {};
DATitlesHelpers.pubsMapFactory = {};
DATitlesHelpers.init();
//# sourceMappingURL=DATitles.utils.js.map
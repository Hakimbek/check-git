const { Router } = require('express');

const { wkVars } = require('../../services/utils/vars.util');
const seoDataService = require('../../services/seoDataService');
const logger = require('../../services/loggerService');
const {
    LOGGING_LEVELS: { ERROR },
    FUNCTION_NAMES: { GENERATE_CANONICAL_URL, GET_INDEX_RULE },
    LOGGING_MESSAGES: { GENERATE_CANONICAL_ERROR, GET_INDEX_RULE_ERROR },
} = require('../../loggerConstants');

const { FREE_USER_NAME } = require('../../config/appConfig');
const isApplicationIndexingAllowed = wkVars.vars('enableContentIndexing');

const DEFAULT_INDEX_FOLLOW_RULE = 'index, follow';
const INDEX_NOFOLLOW_RULE = 'index, nofollow';
const DEFAULT_HOME_PATH = '/federal';
const mainSeoHost = wkVars.vars('mainSeoHost');

// @TODO design more flexible solution
const statesAliases = {
    '/home': '/federal',
    '/': '/federal',
    '/app/acr/home/federal': '/federal',
    '/app/acr/home/state': '/state',
    '/app/acr/home/international': '/international',
    '/app/acr/home/news': '/news',
    '/app/acr/home/all': '/all',
    '/app/acr/home/accounting': '/accounting',
    '/app/acr/home*': '/federal',
    '/app/acr/home/checklists': '/checklists',
};

const staticDiscoverableUrls = Object.values(wkVars.vars('statesUsedCanonical')).reduce((urlList, value) => {
    if (typeof value === 'string') {
        urlList[value] = value;
    } else {
        value.length &&
            value.forEach(({ url }) => {
                urlList[url] = url;
            });
    }

    return urlList;
}, statesAliases);

function staticLocalsInjector(req, res, next) {
    // TODO: get title via shared service
    // res.locals.defaultPageTitle = '';
    if (isApplicationIndexingAllowed) {
        res.locals.defaultIndexFollowRule = DEFAULT_INDEX_FOLLOW_RULE;
    }
    res.locals.defaultCanonicalUrl = mainSeoHost + (staticDiscoverableUrls[req.path] || DEFAULT_HOME_PATH);
    next();
}

function getRequestData({ correlationId, forwardedHost, forwardedProto }) {
    return {
        forwardedAuthorization: `freemium ${FREE_USER_NAME}`,
        correlationId,
        forwardedHost,
        forwardedProto,
    };
}

async function generateCanonicalUrl(req, document, isTopic = false) {
    try {
        return global.sharedServices.semanticUrl.generateCanonicalUrl(document, isTopic);
    } catch (error) {
        logger.logRequest(
            ERROR,
            req,
            {
                message: GENERATE_CANONICAL_ERROR,
                funcrion: GENERATE_CANONICAL_URL,
                correlationId: req.correlationId,
            },
            error
        );

        return { isError: true };
    }
}

async function getIndexRule(req) {
    try {
        const {
            params: { documentId },
        } = req;

        return await seoDataService.getIndexRule(documentId, getRequestData(req));
    } catch (error) {
        logger.logRequest(
            ERROR,
            req,
            {
                message: GET_INDEX_RULE_ERROR,
                funcrion: GET_INDEX_RULE,
                correlationId: req.correlationId,
            },
            error
        );

        return { isError: true };
    }
}

async function getDocument(req, isTopic) {
    const {
        params: { documentId },
    } = req;
    const stateType = isTopic ? 'topic' : 'document';

    return seoDataService.getDocumentInContext(documentId, stateType, getRequestData(req));
}

async function documentLocalsInjector(req, res, next) {
    try {
        const document = await getDocument(req);
        const [cannonicalUrl, indexRule] = await Promise.all([generateCanonicalUrl(req, document), getIndexRule(req)]);
        if (!cannonicalUrl.isError) {
            res.locals.defaultCanonicalUrl = cannonicalUrl;
        }
        if (!indexRule.isError && isApplicationIndexingAllowed) {
            res.locals.defaultIndexFollowRule = indexRule;
        }
    } finally {
        next();
    }
}

async function topicLocalsInjector(req, res, next) {
    try {
        const isTopic = true;
        const document = await getDocument(req, isTopic);
        const cannonicalUrl = await generateCanonicalUrl(req, document, isTopic);

        const metadataService = global.sharedServices.metadataService;
        const isTopicInternational = await metadataService.isTopicInternationalByExtendedMetadata(document);

        if (!cannonicalUrl.isError) {
            res.locals.defaultCanonicalUrl = cannonicalUrl;
        }
        if (!isTopicInternational && isApplicationIndexingAllowed) {
            res.locals.defaultIndexFollowRule = INDEX_NOFOLLOW_RULE;
        }
    } finally {
        next();
    }
}

const router = new Router();

router.get(Object.keys(staticDiscoverableUrls), staticLocalsInjector);
router.get('/document/:documentId/*', documentLocalsInjector);
router.get('/topic/:documentId/*', topicLocalsInjector);

module.exports = router;

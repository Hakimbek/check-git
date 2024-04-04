const envUtils = require('../services/utils/env.util');

let ProductInfo;
try {
    ProductInfo = require('@wk/dev-common/entity/productInfo');
} catch (e) {
    // stub for linter
}

// Thanks to implementation of @wk/dev-common we can't use ES6 classes for inheritance (sarcasm)
function CsnProductInfo(...args) {
    ProductInfo.apply(this, args);

    const originalGetResolver = this.getResolver;

    this.getResolver = function (...args) {
        const resolver = originalGetResolver.apply(this, args);

        if (envUtils.isDevMode()) {
            decorateJSResolver(resolver);
        }

        return resolver;
    };

    function decorateJSResolver(resolver) {
        const originalResolveModuleSources = resolver.resolveModuleSources;

        resolver.resolveModuleSources = (...args) => {
            const sources = originalResolveModuleSources(...args);

            // here we can filter js-sources
            return sources;
        };
    }
}

if (ProductInfo) {
    CsnProductInfo.prototype = Object.create(ProductInfo.prototype);
    CsnProductInfo.prototype.getVersionsStr = function () {
        const meta = this.getResolver().getRepository().getMetaInfo().packages;

        return Object.keys(meta).reduce((acc, key) => acc + key + ':' + meta[key] + '\n', '');
    };

    module.exports = CsnProductInfo;
}

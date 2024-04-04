const path = require('path');
const { wkVars, wkVarsHash } = require('./utils/vars.util');
const { getRootDir, isHub, getPublicDir, getAppVersion } = require('./utils/env.util');
const ejs = require('./utils/ejs.util');
const i18n = require('./utils/i18n.util');

const fs = require('fs');

const fakeHeaderRelativePath = isHub()
    ? './static/static-fake-header.html'
    : '../app-react/static-templates/static-fake-header.html';
const fakeHeaderTemplate = fs.readFileSync(path.resolve(getPublicDir(), fakeHeaderRelativePath));

class TemplateService {
    constructor() {
        this.defaultRenderContext = {
            __: i18n.__,
            defaultPageTitle: wkVars.vars('defaultPageTitle'),
            defaultProductTitle: this.getDefaultProductTitle(),
            defaultMetaDescription: wkVars.vars('pageDescription'),
            defaultIndexFollowRule: this.getDefaultIndexFollowRule(),
            defaultCanonicalUrl: '',
            injectedCookies: {},
            prefetchResources: this.getPrefetchResources(),
            appcuesScript: wkVars.vars('appcuesScript'),
            googleServices: {
                optimize: {
                    enabled: wkVars.vars('googleOptimizeSetting') && wkVars.vars('googleOptimizeSetting').isEnabled,
                    container: wkVars.vars('googleOptimizeSetting').container,
                },
                tagManager: {
                    enabled: wkVars.vars('enableGoogleTagManager'),
                    id: wkVars.vars('googleTagManagerId'),
                },
                analytics: {
                    enabled: wkVars.vars('enableGoogleAnalytics'),
                    id: wkVars.vars('googleAnalyticsId'),
                },
            },
            vars: wkVars.vars,
            appLang: 'en',
            varsEtag: `?_etag=${wkVarsHash}`,
            fakeHeader: fakeHeaderTemplate,
            applicationVersion: getAppVersion(),
        };
    }

    async renderTemplate(filepath, locale = 'en', data = {}, options = {}) {
        const renderContext = {
            ...this.defaultRenderContext,
            ...data,
        };

        i18n.setLocale(renderContext, locale);

        return ejs.renderFile(filepath, renderContext, options);
    }

    renderStaticTemplate(filename, locale = 'en', data = {}, options = {}) {
        const filePath = path.resolve(ejs.root, filename);

        return this.renderTemplate(filePath, locale, data, options);
    }

    getPrefetchResources() {
        return (wkVars.vars('prefetchResources') || [])
            .map(p => `<link rel="preload" as="${p.as}" href="${p.url}"/>`)
            .join('\n');
    }

    getDefaultIndexFollowRule() {
        return [wkVars.vars('defaultRobotsIndex'), wkVars.vars('defaultRobotsFollow')].join(', ');
    }

    getDefaultProductTitle() {
        return wkVars.vars('defaultProductTitle').replace(new RegExp('&#174', 'g'), '®');
    }
}

class DevTemplateService extends TemplateService {
    constructor() {
        super();
        this.initRenderContext();

        const ProductInfo = require('../classes/csnProductInfo');

        this.productInfo = new ProductInfo(process.cwd());
        this.resolver = this.productInfo.getResolver();
        this.scriptsRenderer = require('@wk/dev-common/renderer/scriptsRenderer');
        this.stylesRenderer = require('@wk/dev-common/renderer/stylesRenderer');
    }

    initRenderContext() {
        this.defaultRenderContext = {
            ...this.defaultRenderContext,
            bmb: {
                scripts: this.scriptRender.bind(this),
                styles: this.styleRender.bind(this),
            },
            cssEtag: '',
            varsEtag: '',
            version: Date.now(),
        };
    }

    urlAppender(srcUrl, script) {
        let res = '/static/';

        if (script.match(/node_modules|bmb_packages|bower_components/)) {
            res += script.replace('../', '');
        } else {
            res += script;
        }

        return res;
    }

    scriptRender(moduleName) {
        let output = '';
        const moduleScripts = this.resolver
            .resolveSources(moduleName, {
                platformName: 'modern',
            })
            .reduce((paths, path) => {
                if (path.includes('es6-shim')) {
                    // add default constants code into bundle right after es6-shim polyfills to avoid troubles in ie11
                    return paths.concat([path, './app/defaultConstants.js']);
                }

                return paths.concat([path]);
            }, []);
        const resolveState = this.resolver.getLastResolveState();

        output += this.scriptsRenderer.renderBmbAngModules(false, resolveState.bmbAngularModules);
        output += this.scriptsRenderer.renderMetaInfo(false, resolveState.packagesMeta);

        const renderResult = this.scriptsRenderer.render(
            false,
            [],
            moduleScripts.concat('/static/dev-bmb-app-starter.js'),
            getRootDir(),
            true,
            void 0,
            this.urlAppender
        );

        output += renderResult.output;

        return output;
    }

    styleRender(moduleName) {
        let output = '';

        const moduleStyles = this.resolver.resolveStyles(moduleName, {
            platformName: 'modern',
        });

        output += this.stylesRenderer.render(false, moduleStyles, getRootDir(), true, void 0, this.urlAppender);

        return output;
    }
}

module.exports = isHub() ? new TemplateService() : new DevTemplateService();

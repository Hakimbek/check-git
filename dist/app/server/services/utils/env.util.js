const path = require('path');

// temporary solution
// TODO: add detection of hub or dev mode
const isHub =
    ~process.cwd().indexOf('wwwroot') || ~process.cwd().indexOf('dist') || process.argv.some(arg => arg === '--dist');

const localDir = path.join(process.cwd(), 'app');

const rootDir = isHub ? process.cwd() : localDir;

const varsDir = isHub ? path.resolve(rootDir, 'vars') : path.resolve('vars');

const publicDir = isHub ? path.join(process.cwd(), 'public') : localDir;

const sitemapsDir = path.join(publicDir, '/static/sitemaps');

const sharedServicesDir = `../${isHub ? 'server' : 'app'}/services/shared`;

const langFolder = isHub ? path.resolve(process.cwd(), './public/static/lang') : path.resolve('./lang');

const { version: applicationVersion } = require('./../../../package.json');

module.exports = {
    isHub: () => isHub,
    isDevMode: () => !isHub,
    getRootDir: () => rootDir,
    getPublicDir: () => publicDir,
    getSharedServicesDir: () => sharedServicesDir,
    getSitemapsDir: () => sitemapsDir,
    getLangFolder: () => langFolder,
    getVarsFolder: () => varsDir,
    getAppVersion: () => applicationVersion,
};

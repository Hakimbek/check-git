const request = require('request-promise-native');
const cheerio = require('cheerio');

const ABSOLUTE_OR_MAILTO_LINK_REGEXP = /^https?:\/{2}|^mailto:/i;
const LOAD_FILE_TIMEOUT = 60000;

class FilesService {
    async loadFile(fileUrl, requestData) {
        const responseBody = await request({
            url: fileUrl,
            method: 'GET',
            timeout: LOAD_FILE_TIMEOUT,
        });
        const fileUrlData = new URL(fileUrl);

        if (fileUrl.endsWith('.html') && requestData.headers.host !== fileUrlData.host) {
            return this.transformRelativeLinksToAbsolute(responseBody, fileUrlData);
        }

        return responseBody;
    }

    transformRelativeLinksToAbsolute(htmlContent, fileUrlData) {
        const $ = cheerio.load(htmlContent);

        $('*[src], *[href]').each((index, element) => {
            let link = $(element).attr('src') || $(element).attr('href');

            if (!ABSOLUTE_OR_MAILTO_LINK_REGEXP.test(link)) {
                let prefixForRelativeLink = fileUrlData.href.substring(0, fileUrlData.href.lastIndexOf('/'));

                if (!link.startsWith('/')) {
                    prefixForRelativeLink += '/';
                } else {
                    prefixForRelativeLink = fileUrlData.origin;
                }

                if ($(element).attr('src')) {
                    $(element).attr('src', prefixForRelativeLink + link);
                } else {
                    $(element).attr('href', prefixForRelativeLink + link);
                }
            }
        });

        return $.html();
    }
}

module.exports = new FilesService();

import axios from 'axios';
import IsNotValidUrlException from '../exception/isNotValidUrlException.js';

export default class ScrapValidator {
    /***
     * check url is correct and find true url
     * @param url given url
     * @return {Promise<null>} correct url
     */
    async checkValidShopifyUrl(url) {
        let correctUrl = null;
        if (!url.includes('collection.json')) {
            url += '/collections.json';
        }

        let urlList = [];
        urlList.push(url);
        urlList.push('https://' + url);
        urlList.push('https' + url);
        urlList.push('https://www.' + url);
        urlList.push('www.' + url);

        let i = 0;

        while (i < urlList.length && !correctUrl) {
            try {
                let res = await axios.get(urlList[i]);

                if (res.data.collections.length <= 0) {
                    i += 1;
                } else {
                    correctUrl = urlList[i];
                }
            } catch (e) {
                i += 1;
            }
        }

        if (!correctUrl) {
            throw new IsNotValidUrlException(JSON.stringify({ data: 'Your given url is invalid' }));
        }
        return correctUrl.replace('/collections.json', '');
    }
}

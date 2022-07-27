import axios from 'axios';
import IsNotValidUrlException from '../exception/isNotValidUrlException.js';

export default class ScrapValidator {
    async checkValidShopifyUrl(url) {
        if (!url.includes('collection.json')) {
            url += '/collections.json';
        }

        try {
            let res = await axios.get(url);

            if (res.data.collections.length <= 0) {
                throw new IsNotValidUrlException(JSON.stringify({ data: 'Your given url is invalid' }));
            }
        } catch (e) {
            throw new IsNotValidUrlException(JSON.stringify({ data: 'Your given url is invalid' }));
        }
    }
}

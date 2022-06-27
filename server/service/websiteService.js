import axios from 'axios';
import WebsiteRepository from '../repository/websiteRepository.js';

import cheerio from 'cheerio';

export default class WebsiteService {
    async getCollectionByWebsiteNameFromWeb(url) {
        try {
            let response = await axios.get(url + '/collections.json');

            return response.data.collections;
        } catch (e) {}
        return [];
    }

    async getCartByWebsiteNameFromWeb(url) {
        try {
            let response = await axios.get(url + '/cart.json');

            return response.data;
        } catch (e) {}
        return {};
    }

    async upsertWebSitesAllCollections(url, collections) {
        let websiteRepository = new WebsiteRepository();

        await websiteRepository.upsertWebSitesAllCollections(url, collections);
    }

    async upsertWebSitesFavicon(url, collections) {
        let websiteRepository = new WebsiteRepository();

        await websiteRepository.upsertWebSitesFavicon(url, collections);
    }

    async upsertWebSitesCart(url, cart) {
        let websiteRepository = new WebsiteRepository();

        await websiteRepository.upsertWebSitesCart(url, cart);
    }

    async getFaviconUrlByWebsiteNameFromWeb(url) {
        let result = null;
        try {
            let response = await axios.get(url);
            const $ = cheerio.load(response.data);

            result = $('link[rel="shortcut icon"]').attr('href');
        } catch (e) {
            console.log(e);
        }

        return result;
    }
}

import axios from 'axios';
import WebsiteRepository from '../repository/websiteRepository.js';
import cheerio from 'cheerio';

export default class WebsiteService {
    /***
     * get collection by website name from web
     * @param url
     * @return {Promise<(() => Promise<Collection[]>)|((callback: Callback<Collection[]>) => void)|((options: ListCollectionsOptions) => Promise<Collection[]>)|((options: ListCollectionsOptions, callback: Callback<Collection[]>) => void)|((options?: (ListCollectionsOptions | Callback<Collection[]>), callback?: Callback<Collection[]>) => (Promise<Collection[]> | void))|*[]>}
     */
    async getCollectionByWebsiteNameFromWeb(url) {
        try {
            let response = await axios.get(url + '/collections.json');

            return response.data.collections;
        } catch (e) {}
        return [];
    }

    /***
     * get Cart by website name from web
     * @param url
     * @return {Promise<{}|any>}
     */
    async getCartByWebsiteNameFromWeb(url) {
        try {
            let response = await axios.get(url + '/cart.json');

            return response.data;
        } catch (e) {}
        return {};
    }

    /***
     * upsert WebSites All Collections
     * @param url
     * @param collections
     * @return {Promise<void>}
     */
    async upsertWebSitesAllCollections(url, collections) {
        let websiteRepository = new WebsiteRepository();

        await websiteRepository.upsertWebSitesAllCollections(url, collections);
    }

    /***
     * upsert WebSites Favicon
     * @param url
     * @param collections
     * @return {Promise<void>}
     */
    async upsertWebSitesFavicon(url, collections) {
        let websiteRepository = new WebsiteRepository();

        await websiteRepository.upsertWebSitesFavicon(url, collections);
    }

    /***
     * upsert WebSites Cart
     * @param url
     * @param cart
     * @return {Promise<void>}
     */
    async upsertWebSitesCart(url, cart) {
        let websiteRepository = new WebsiteRepository();

        await websiteRepository.upsertWebSitesCart(url, cart);
    }

    /***
     * get Favicon AddStore By Website Name From Web
     * @param url
     * @return {Promise<null>}
     */
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

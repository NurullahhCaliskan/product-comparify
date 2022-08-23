import StoreWebsiteRelationRepository from '../repository/storeWebsiteRelationRepository.js';
import { urlFormatter } from '../utility/stringUtility.js';

export default class StoreWebsiteRelationService {
    /***
     * add url to scrap service
     * @param url url
     * @param storeId storeId
     */
    async addUrlToScrapService(url, storeId) {
        url = urlFormatter(url);
        let urlToScrapRepository = new StoreWebsiteRelationRepository();
        await urlToScrapRepository.addUrlToScrapRepository(url, storeId);
    }

    /***
     * update url
     * @param body request body
     * @param storeId storeId
     */
    async updateUrl(body, storeId) {
        let urlToScrapRepository = new StoreWebsiteRelationRepository();
        await urlToScrapRepository.upsertUrlRepository(body, storeId);
    }

    /***
     * delete url
     * @param id id
     * @return {Promise<void>}
     */
    async deleteUrlToScrapService(id) {
        let urlToScrapRepository = new StoreWebsiteRelationRepository();
        await urlToScrapRepository.deleteUrlToScrapRepository(id);
    }

    /***
     * user url exist check
     * @param url url
     * @param storeId storeId
     * @return {Promise<void>}
     */
    async isExistsUserToUrlRelation(url, storeId) {
        url = urlFormatter(url);
        let urlToScrapRepository = new StoreWebsiteRelationRepository();
        await urlToScrapRepository.isExistsUserToUrlRelation(url, storeId);
    }

    /***
     * limit check
     * @param storeId storeId
     * @return {Promise<void>}
     */
    async storeMaximumLimitCheck(storeId) {
        let urlToScrapRepository = new StoreWebsiteRelationRepository();
        await urlToScrapRepository.storeMaximumLimitCheck(storeId);
    }

    /***
     * get url by storeId
     * @param storeId storeId
     * @return {Promise<undefined|*|[]>}
     */
    async getUrlToScrapService(storeId) {
        let urlToScrapRepository = new StoreWebsiteRelationRepository();
        return await urlToScrapRepository.getUserToUrlRelation(storeId);
    }

    async uninstallStoreByStoreId(storeId) {
        let urlToScrapRepository = new StoreWebsiteRelationRepository();
        await urlToScrapRepository.uninstallStoreByStoreId(storeId);
    }
}

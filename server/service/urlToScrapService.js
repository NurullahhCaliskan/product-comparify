import UrlToScrapRepository from "../repository/urlToScrapRepository.js";
import { urlFormatter } from "../utility/stringUtility.js";

export default class UrlToScrapService {

    /***
     * add url to scrap service
     * @param url url
     * @param userid userid
     */
    async addUrlToScrapService(url, userid) {

        url = urlFormatter(url)
        let urlToScrapRepository = new UrlToScrapRepository();
        await urlToScrapRepository.addUrlToScrapRepository(url, userid);
    }

    /***
     * update url
     * @param body request body
     * @param userid userid
     */
    async updateUrl(body, userid) {
        let urlToScrapRepository = new UrlToScrapRepository();
        await urlToScrapRepository.upsertUrlRepository(body, userid);
    }

    /***
     * delete url
     * @param id id
     * @return {Promise<void>}
     */
    async deleteUrlToScrapService(id) {
        let urlToScrapRepository = new UrlToScrapRepository();
        await urlToScrapRepository.deleteUrlToScrapRepository(id);
    }

    /***
     * user url exist check
     * @param url url
     * @param userid userid
     * @return {Promise<void>}
     */
    async isExistsUserToUrlRelation(url, userid) {
        url=urlFormatter(url)
        let urlToScrapRepository = new UrlToScrapRepository();
        await urlToScrapRepository.isExistsUserToUrlRelation(url, userid);
    }

    /***
     * get url by userid
     * @param userid userid
     * @return {Promise<undefined|*|[]>}
     */
    async getUrlToScrapService(userid) {
        let urlToScrapRepository = new UrlToScrapRepository();
        return await urlToScrapRepository.getUserToUrlRelation(userid);
    }
}

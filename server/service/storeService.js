import StoreRepository from '../repository/storeRepository.js';
import StoreUserService from './storeUserService.js';
import StoreWebsiteRelationService from './storeWebsiteRelationService.js';

export default class StoreService {
    /***
     * get user and store info
     * @param userId
     * @param storeId
     * @return {Promise<{}>}
     */
    async getUserAndStoreInfo(userId, storeId) {
        let storeService = new StoreRepository();
        let response = {};
        let result = await storeService.getUserInfo(userId, storeId);

        try {
            response.storeId = result[0].storeId;
            response.first_name = result[0].first_name;
            response.last_name = result[0].last_name;
            response.address1 = result[0].storeInfo[0].address1;
            response.country_name = result[0].storeInfo[0].country_name;
            response.selectedMail = result[0].storeInfo[0].selectedMail;

            return response;
        } catch (e) {
            return {};
        }
    }

    /***
     * uninstall merchant
     * @param store store
     * @return {Promise<void>}
     */
    async uninstallStore(store) {
        let storeUserService = new StoreUserService();
        let storeRepository = new StoreRepository();
        let storeWebsiteRelationService = new StoreWebsiteRelationService();
        let storeId = JSON.parse(store).id;

        await storeUserService.uninstallStoreUserByStoreId(storeId);
        await storeRepository.uninstallStoreByStoreId(storeId);
        await storeWebsiteRelationService.uninstallStoreByStoreId(storeId);
    }
}

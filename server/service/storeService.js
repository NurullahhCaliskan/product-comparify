import StoreRepository from '../repository/storeRepository.js';

export default class StoreService {
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
}

import StoreUserRepository from '../repository/storeUserRepository.js';

export default class StoreUserService {
    /***
     * move all store user to uninstall store user
     * @param storeId storeid
     * @return {Promise<void>}
     */
    async uninstallStoreUserByStoreId(storeId) {
        let storeUserRepository = new StoreUserRepository();

        await storeUserRepository.uninstallStoreUserByStoreId(storeId);
    }
}

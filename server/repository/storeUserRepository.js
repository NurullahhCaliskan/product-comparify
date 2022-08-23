import { collections } from '../database.config.js';
import OccurredUnknownErrorException from '../exception/occurredUnknownErrorException.js';

export default class StoreUserRepository {
    /***
     * move all store user to uninstall store user
     * @param storeId storeid
     * @return {Promise<void>}
     */
    async uninstallStoreUserByStoreId(storeId) {
        await collections.storeUserModel
            .aggregate([{ $match: { storeId: storeId } }, { $out: 'uninstall-store-user' }])
            .toArray()
            .then((r) => r)
            .catch((e) => {});

        await collections.storeUserModel
            .deleteMany({ storeId: storeId })
            .then((r) => r)
            .catch((e) => {});
    }
}

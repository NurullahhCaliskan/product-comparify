import { collections } from '../database.config.js';

export default class StoreRepository {
    /***
     * get user and store info
     * @param userId
     * @param storeId
     * @return {Promise<{}>}
     */
    async getUserInfo(userId, storeId) {
        let json = [
            {
                $match: { $and: [{ storeId: storeId }, { id: userId }] },
            },

            {
                $lookup: {
                    from: 'store',
                    localField: 'storeId',
                    foreignField: 'id',
                    as: 'storeInfo',
                },
            },

            { $project: { storeId: 1, first_name: 1, last_name: 1, 'storeInfo.address1': 1, 'storeInfo.country_name': 1, 'storeInfo.selectedMail': 1 } },
        ];

        return await collections.storeUserModel?.aggregate(json).toArray();
    }
}

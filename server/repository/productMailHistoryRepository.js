import { collections } from '../database.config.js';

export default class ProductMailHistoryRepository {
    /***
     * get product mail history
     * @param storeId
     * @param date
     * @return {Promise<*>}
     */
    async getProductMailHistory(storeId, date) {
        let json = [{ $match: { $and: [{ storeId: storeId }, { createDateTime: { $gte: date } }] } }, { $project: { website: 1, url: 1, newValue: 1, oldValue: 1, priceChangeRate: 1, productTitle: 1, imageSrc: 1, currency: 1, createDateTime: 1, mail: 1, faviconUrl: 1 } }];

        return await collections.productMailHistoryModel?.aggregate(json).toArray();
    }
}

import { collections } from '../database.config.js';

export default class ProductHistoryCrawlerQueueRepository {
    /***
     * update or insert url
     * @param website website
     */
    async addToQueue(website) {
        let query = { website: website };
        let newRecord = { $set: { website: website } };

        await collections.productHistoryCrawlerQueueModel
            .updateOne(query, newRecord, { upsert: true })
            .then((r) => r)
            .catch((e) => e);
    }
}

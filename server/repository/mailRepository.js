import { collections } from '../database.config.js';

export default class MailRepository {
    /***
     * get store's mail
     * @param storeId storeId
     * @return {Promise<(Document & {_id: null})|{selectedMail: null}>} mail
     */
    async getStoreMailByStoreId(storeId) {
        let query = { id: storeId };

        const options = { projection: { _id: 1, selectedMail: 1 } };

        return await collections.storeModel.findOne(query, options);
    }

    /***
     * update or insert user's mail
     * @param mail mail
     * @param storeId store id
     * @return {Promise<void>} void
     */
    async upsertMailByStoreId(mail, storeId) {
        let query = { id: storeId };
        let newRecord = { $set: { userId: storeId, selectedMail: mail } };

        await collections.storeModel.updateOne(query, newRecord);
    }
}

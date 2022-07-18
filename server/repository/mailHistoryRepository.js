import { collections } from '../database.config.js';

export default class MailHistoryRepository {
    /***
     * get Mail history
     * @param storeId
     * @param project
     * @return {Promise<*>}
     */
    async getMailHistoryByUserBy(storeId, project) {
        return await collections.mailHistoryModel.find({ storeId: storeId }).project(project).toArray();
    }
}

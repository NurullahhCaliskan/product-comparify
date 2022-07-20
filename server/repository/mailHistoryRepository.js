import { collections } from '../database.config.js';

export default class MailHistoryRepository {
    /***
     * get Mail history
     * @param storeId
     * @param project
     * @param date
     * @return {Promise<*>}
     */
    async getMailHistoryByUserBy(storeId, project, date) {
        return await collections.mailHistoryModel
            .find({ $and: [{ storeId: storeId }, { createDateTime: { $gte: date } }] })
            .project(project)
            .toArray();
    }
}

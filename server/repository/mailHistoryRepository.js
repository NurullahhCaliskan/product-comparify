import { collections } from '../database.config.js';

export default class MailHistoryRepository {
    async getMailHistoryByUserBy(userId, project) {
        return await collections.mailHistoryModel.find({ userId: userId }).project(project).toArray();
    }
}

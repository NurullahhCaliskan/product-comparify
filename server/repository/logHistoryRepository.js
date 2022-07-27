import { collections } from '../database.config.js';

export default class LogHistoryRepository {
    /***
     * Save action logs
     * @param log
     */
    saveLogHistory(log) {
        collections.logHistoryModel.insertOne(log);
    }
}

import LogHistoryRepository from '../repository/logHistoryRepository.js';

export default class LogHistoryService {
    /***
     * Save action logs
     * @param log
     */
    saveLogHistory(log) {
        let logHistoryRepository = new LogHistoryRepository();
        logHistoryRepository.saveLogHistory(log);
    }
}

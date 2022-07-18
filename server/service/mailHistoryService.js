import MailHistoryRepository from '../repository/mailHistoryRepository.js';

export default class MailHistoryService {
    /***
     * get Mail history
     * @param storeId
     * @return {Promise<*>}
     */
    async getMailHistoryByUserid(storeId) {
        let project = { mailBody: 0 };

        let mailHistoryRepository = new MailHistoryRepository();

        return await mailHistoryRepository.getMailHistoryByUserBy(storeId, project);
    }
}

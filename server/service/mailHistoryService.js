import MailHistoryRepository from '../repository/mailHistoryRepository.js';
import { getSelectedDayAgo, getTodayMidnight } from '../utility/dayUtility.js';

export default class MailHistoryService {
    /***
     * get Mail history
     * @param storeId
     * @return {Promise<*>}
     */
    async getMailHistoryByUserid(storeId, dateType) {
        let date = new Date();
        let project = { mailBody: 0 };

        let mailHistoryRepository = new MailHistoryRepository();

        //today
        if (dateType === 0) {
            date = getTodayMidnight();
        }
        if (dateType === 1) {
            date = getSelectedDayAgo(7);
        }
        if (dateType === 2) {
            date = getSelectedDayAgo(30);
        }

        return await mailHistoryRepository.getMailHistoryByUserBy(storeId, project, date);
    }
}

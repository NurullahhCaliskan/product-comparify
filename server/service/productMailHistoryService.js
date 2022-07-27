import MailHistoryRepository from '../repository/mailHistoryRepository.js';
import DashboardRepository from '../repository/dashboardRepository.js';
import { getSelectedDayAgo, getTodayMidnight, getYesterdayMidnight } from '../utility/dayUtility.js';
import ProductMailHistoryRepository from '../repository/productMailHistoryRepository.js';

export default class ProductMailHistoryService {
    /***
     * get product mail history
     * @param storeId
     * @param dateType
     * @return {Promise<*>}
     */
    async getProductMailHistory(storeId, dateType) {
        let date = new Date();
        let productMailHistoryRepository = new ProductMailHistoryRepository();

        //
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

        return await productMailHistoryRepository.getProductMailHistory(storeId, date);
    }
}

import MailHistoryRepository from '../repository/mailHistoryRepository.js';
import DashboardRepository from '../repository/dashboardRepository.js';
import { get7dayMidnight, getTodayMidnight, getYesterdayMidnight } from '../utility/dayUtility.js';
import ProductMailHistoryRepository from '../repository/productMailHistoryRepository.js';

export default class ProductMailHistoryService {
    async getProductMailHistory(storeId, dateType) {
        let date = new Date();
        let productMailHistoryRepository = new ProductMailHistoryRepository();

        //
        //today
        if (dateType === 1) {
            date = getTodayMidnight();
        }
        //yesterday
        if (dateType === 2) {
            date = getYesterdayMidnight();
        }
        //7 day
        if (dateType === 3) {
            date = get7dayMidnight();
        }

        return await productMailHistoryRepository.getProductMailHistory(storeId, date);
    }
}

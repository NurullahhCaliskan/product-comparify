import MailHistoryRepository from '../repository/mailHistoryRepository.js';
import DashboardRepository from '../repository/dashboardRepository.js';
import { get7dayMidnight, getTodayMidnight, getYesterdayMidnight } from '../utility/dayUtility.js';

export default class DashboardService {
    async getDashboardInformation(storeId, dateType) {
        let date = new Date();
        let dashboardRepository = new DashboardRepository();

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

        let storeMailItemSendCount = await dashboardRepository.getStoreMailItemSendCount(storeId, date);
        let averagePriceChangeAsRate = await dashboardRepository.getAveragePriceChangeAsRate(storeId, date);
        let averagePriceChangeAsPrice = await dashboardRepository.getAveragePriceChangeAsPrice(storeId, date);
        let maxPriceChangeAsRate = await dashboardRepository.getMaxPriceChangeAsRate(storeId, date);
        let maxPriceChangeAsRateProductTitle = await dashboardRepository.getMaxPriceChangeAsRateProductTitle(storeId, date);
        let countOfFollowedStore = await dashboardRepository.getCountOfFollowedStore(storeId);

        let result = {};
        result.store_mail_item_send_count = storeMailItemSendCount;
        result.average_price_change_as_rate = averagePriceChangeAsRate;
        result.average_price_change_as_price = averagePriceChangeAsPrice;
        result.max_price_change_as_rate = maxPriceChangeAsRate;
        result.max_price_change_as_rate_product_title = maxPriceChangeAsRateProductTitle;
        result.count_of_followed_store = countOfFollowedStore;
        result.id = 1;

        return result;
    }
}

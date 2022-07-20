import DashboardRepository from '../repository/dashboardRepository.js';
import { getSelectedDayAgo, getTodayMidnight } from '../utility/dayUtility.js';

export default class DashboardService {
    /***
     * get Dashboard Information such as price average
     * @param storeId
     * @param dateType
     * @return {Promise<{}>}
     */
    async getDashboardInformation(storeId, dateType) {
        let date = new Date();
        let dashboardRepository = new DashboardRepository();

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

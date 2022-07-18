import { collections } from '../database.config.js';

export default class DashboardRepository {
    async getStoreMailItemSendCount(storeId, date) {
        let findJson = { $and: [{ storeId: storeId }, { createDateTime: { $gte: date } }] };

        return await collections.productMailHistoryModel?.find(findJson).count();
    }

    async getAveragePriceChangeAsRate(storeId, date) {
        let json = [{ $match: { $and: [{ storeId: storeId }, { createDateTime: { $gte: date } }] } }, { $group: { _id: null, avg_val: { $avg: '$priceChangeRate' } } }];
        let response = await collections.productMailHistoryModel?.aggregate(json).toArray();

        if (response && response.length > 0) {
            return Number(response[0].avg_val.toFixed(2));
        }
        return 0;
    }

    async getAveragePriceChangeAsPrice(storeId, date) {
        let json = [{ $match: { $and: [{ storeId: storeId }, { createDateTime: { $gte: date } }] } }, { $group: { _id: null, avg_val: { $avg: { $subtract: ['$newValueAsUsd', '$oldValueAsUsd'] } } } }];
        let response = await collections.productMailHistoryModel?.aggregate(json).toArray();

        if (response && response.length > 0) {
            return Number(response[0].avg_val.toFixed(2));
        }
        return 0;
    }

    async getMaxPriceChangeAsRate(storeId, date) {
        let json = [{ $match: { $and: [{ storeId: storeId }, { createDateTime: { $gte: date } }] } }, { $group: { _id: null, avg_val: { $max: '$priceChangeRate' } } }];
        let response = await collections.productMailHistoryModel?.aggregate(json).toArray();
        if (response && response.length > 0) {
            return Number(response[0].avg_val.toFixed(2));
        }
        return 0;
    }

    async getMaxPriceChangeAsRateProductTitle(storeId, date) {
        let json = [{ $match: { $and: [{ storeId: storeId }, { createDateTime: { $gte: date } }] } }, { $group: { _id: '$productTitle', avg_val: { $max: '$priceChangeRate' } } }];
        let response = await collections.productMailHistoryModel?.aggregate(json).toArray();

        if (response && response.length > 0) {
            return response[0]._id;
        }
        return '-';
    }

    async getCountOfFollowedStore(storeId) {
        let json = [{ $match: { storeId: storeId } }, { $count: 'count_of_followed_store' }];
        let response = await collections.storeWebsitesRelationModel?.aggregate(json).toArray();

        if (response && response.length > 0) {
            return response[0].count_of_followed_store;
        }
        return '-';
    }
}

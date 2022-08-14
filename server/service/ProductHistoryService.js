import ProductHistoryRepository from '../repository/productHistoryRepository.js';

export default class ProductHistoryService {
    async getSameProductsByProduct(session, body) {
        let productHistoryRepository = new ProductHistoryRepository();

        if (!body.productType) {
            return { data: [], count: 0 };
        }

        let data = await productHistoryRepository.getSameProductsByProduct(session.onlineAccessInfo.associated_user.storeId, body);

        if (data.length > 0) {
            return { data: data, count: data[0].totalCount };
        } else {
            return { data: [], count: 0 };
        }
    }
}

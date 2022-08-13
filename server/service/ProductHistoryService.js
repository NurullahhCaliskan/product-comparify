import ProductHistoryRepository from '../repository/productHistoryRepository.js';
import _ from 'lodash';

export default class ProductHistoryService {
    async getSameProductsByProduct(session, body) {
        let productHistoryRepository = new ProductHistoryRepository();
        let data = await productHistoryRepository.getSameProductsByProduct(session.onlineAccessInfo.associated_user.storeId, body);

        let count = await productHistoryRepository.getSameProductsByProductCount(session.onlineAccessInfo.associated_user.storeId, body);
        return { data: data, count: _.get(count, '[0]') ? count[0].id : 0 };
    }
}

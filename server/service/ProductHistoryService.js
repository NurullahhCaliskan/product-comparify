import ProductHistoryRepository from '../repository/productHistoryRepository.js';
import { Shopify } from '@shopify/shopify-api';
import _ from 'lodash';

export default class ProductHistoryService {
    async getSameProductsByProduct(session, body) {
        const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);
        let productHistoryRepository = new ProductHistoryRepository();

        let innerList = [];

        let innerId = 'id:"' + body.id + '"';

        innerList.push(innerId);

        let queryFilterAsString = innerList.filter((item) => item !== null).join(', ');
        let query = `{
                        product(:inners) {
                            title
                            description
                            onlineStoreUrl
                            handle
                            vendor
                            tags
                            productType
                            
                        }
                    }`;

        query = query.replaceAll(':inners', queryFilterAsString);

        let product = await client.query({
            data: query,
        });

        let data = await productHistoryRepository.getSameProductsByProduct(session.onlineAccessInfo.associated_user.storeId, product.body.data.product, body);
        let count = await productHistoryRepository.getSameProductsByProductCount(session.onlineAccessInfo.associated_user.storeId, product.body.data.product, body);

        return { data: data, count: _.get(count, '[0]') ? count[0].id : 0 };
    }
}

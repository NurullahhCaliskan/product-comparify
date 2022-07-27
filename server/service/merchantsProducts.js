import { queryBuilder } from '../utility/queryBuilder.js';

export default class MerchantsProductsService {
    async getMerchantProduct(client, body) {
        let innerList = [];

        let innerFirst = 'first:10';
        let innerCursor = null;
        let innerQuery = queryBuilder(body);

        innerList.push(innerFirst);
        innerList.push(innerCursor);
        innerList.push(innerQuery);

        let queryFilterAsString = innerList.filter((item) => item !== null).join(', ');
        let query = `{
            products(:inners) {
              edges {
                node {
                  id
                  title
                  handle
                  createdAt
                  productType
                  publishedAt
                  updatedAt
                  tags
                  vendor
                  options (first:20) {
                        id
                        name
                        values
                  }
                  variants(first:20){
                      edges{
                        node{ 
                            compareAtPrice
                            availableForSale
                            createdAt
                            updatedAt
                            displayName
                            id
                            price
                            sku
                            title
                            weight
                            weightUnit
                            image {
                                 id
                                 url 
                                }
                            selectedOptions{
                                name
                                value
                            }
                        }
                     }
                  }
                  images(first:1){
                    edges{
                        node{ 
                            id
                            url 
                        }
                    }
                   }
                  priceRangeV2 {
                    maxVariantPrice {
                      amount
                      currencyCode
                    } 
                    minVariantPrice {
                      amount
                      currencyCode
                    }
                  }
                } 
                cursor
              }
              pageInfo {
                  endCursor
                  hasNextPage
                  hasPreviousPage
                  startCursor
                }
            }
        }`;

        query = query.replaceAll(':inners', queryFilterAsString);
        return await client.query({
            data: query,
        });
    }
}

import { queryBuilder } from '../utility/queryBuilder.js';

export default class MerchantsProductsService {
    async getMerchantProduct(client, body) {
        let innerList = [];

        let innerFirst = null;

        let beforeCursor = null;
        let afterCursor = null;

        if (body.start_cursor || body.end_cursor) {
            if (body.start_cursor) {
                innerFirst = 'last:10';
                beforeCursor = 'before:"' + body.start_cursor + '"';
            }
            if (body.end_cursor) {
                innerFirst = 'first:10';
                afterCursor = 'after:"' + body.end_cursor + '"';
            }
        } else {
            innerFirst = 'first:10';
        }

        let innerQuery = queryBuilder(body);

        innerList.push(innerFirst);
        innerList.push(beforeCursor);
        innerList.push(afterCursor);
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

import { collections } from '../database.config.js';

export default class ProductHistoryRepository {
    async getSameProductsByProduct(storeId, requestBody) {
        let productType = requestBody.productType;
        let search = requestBody.search ? requestBody.search : '';
        let offset = requestBody.offset ? requestBody.offset : 0;

        let aggregateArray = [];

        aggregateArray.push({
            $lookup: {
                from: 'store-websites-relation',
                as: 'storeWebsiteRelation',
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [{ $eq: ['storeWebsiteRelation.storeId', storeId] }, { $eq: ['storeWebsiteRelation.website', 'store-websites-relation.website'] }],
                            },
                        },
                    },
                ],
            },
        });

        aggregateArray.push({ $match: { product_type: productType } });

        if (search) {
            aggregateArray.push({ $match: { title: { $regex: new RegExp(search.trim()), $options: 'i' } } });
        }

        aggregateArray.push({ $project: { id: 1, title: 1, handle: 1, currency: 1, published_at: 1, created_at: 1, updated_at: 1, vendor: 1, product_type: 1, tags: 1, variants: 1, images: 1, options: 1, website: 1, collection: 1, url: 1 } });
        aggregateArray.push({ $setWindowFields: { output: { totalCount: { $count: {} } } } });
        aggregateArray.push({ $skip: offset });
        aggregateArray.push({ $limit: 10 });
        return await collections.productHistoryModel
            ?.aggregate(
                aggregateArray,
                {
                    collation: { locale: 'en', strength: 1 },
                },
                { allowDiskUse: true }
            )
            .toArray();
    }

    async getSameProductsByProductCount(storeId, requestBody) {
        let productType = requestBody.productType;
        let search = requestBody.search ? requestBody.search : '';
        let offset = requestBody.offset ? requestBody.offset : 0;

        let aggregateArray = [];

        aggregateArray.push({
            $lookup: {
                from: 'store-websites-relation',
                as: 'storeWebsiteRelation',
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [{ $eq: ['storeWebsiteRelation.storeId', storeId] }, { $eq: ['storeWebsiteRelation.website', 'store-websites-relation.website'] }],
                            },
                        },
                    },
                ],
            },
        });

        aggregateArray.push({ $match: { product_type: productType } });

        if (search) {
            aggregateArray.push({ $match: { title: { $regex: new RegExp(search.trim()), $options: 'i' } } });
        }

        aggregateArray.push({ $project: { id: 1, title: 1, handle: 1, currency: 1, published_at: 1, created_at: 1, updated_at: 1, vendor: 1, product_type: 1, tags: 1, variants: 1, images: 1, options: 1, website: 1, collection: 1, url: 1 } });
        aggregateArray.push({ $count: 'id' });

        return await collections.productHistoryModel?.aggregate(aggregateArray, { collation: { locale: 'en', strength: 1 } }).toArray();
    }
}

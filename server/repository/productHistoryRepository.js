import { collections } from '../database.config.js';

export default class ProductHistoryRepository {
    async getSameProductsByProduct(storeId, body, requestBody) {
        let handle = body.handle;
        let vendor = body.vendor;
        let productType = body.productType;
        let tags = body.tags;
        let search = requestBody.search ? requestBody.search : '';
        let offset = requestBody.offset ? requestBody.offset : 0;

        console.log(search);
        return await collections.productHistoryModel
            ?.aggregate(
                [
                    {
                        $lookup: {
                            from: 'store-websites-relation',
                            localField: 'website',
                            foreignField: 'website',
                            as: 'storeWebsiteRelation',
                        },
                    },
                    {
                        $match: {
                            $or: [{ handle: handle }, { vendor: vendor }, { productType: productType }, { tags: { $in: tags } }],
                            'storeWebsiteRelation.storeId': storeId,
                            title: { $regex: new RegExp(search), $options: 'i' },
                        },
                    },
                    { $project: { id: 1, title: 1, handle: 1, currency: 1, published_at: 1, created_at: 1, updated_at: 1, vendor: 1, product_type: 1, tags: 1, variants: 1, images: 1, options: 1, website: 1, collection: 1, url: 1 } },
                    { $skip: offset },
                    { $limit: 10 },
                ],
                { collation: { locale: 'en', strength: 1 } }
            )
            .toArray();
    }

    async getSameProductsByProductCount(storeId, body, requestBody) {
        let handle = body.handle;
        let vendor = body.vendor;
        let productType = body.productType;
        let tags = body.tags;
        let search = requestBody.search ? requestBody.search : '';

        console.log(search);
        return await collections.productHistoryModel
            ?.aggregate(
                [
                    {
                        $lookup: {
                            from: 'store-websites-relation',
                            localField: 'website',
                            foreignField: 'website',
                            as: 'storeWebsiteRelation',
                        },
                    },
                    {
                        $match: {
                            $or: [{ handle: handle }, { vendor: vendor }, { productType: productType }, { tags: { $in: tags } }],
                            'storeWebsiteRelation.storeId': storeId,
                            title: { $regex: new RegExp(search), $options: 'i' },
                        },
                    },
                    { $project: { id: 1, title: 1, handle: 1, currency: 1, published_at: 1, created_at: 1, updated_at: 1, vendor: 1, product_type: 1, tags: 1, variants: 1, images: 1, options: 1, website: 1, collection: 1, url: 1 } },
                    { $count: 'id' },
                ],
                { collation: { locale: 'en', strength: 1 } }
            )
            .toArray();
    }
}

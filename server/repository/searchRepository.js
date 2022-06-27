import { collections } from '../database.config.js';

export default class SearchRepository {
    /***
     *
     * @param searchModel {SearchModel}
     */
    async getSearch(searchModel) {
        let andArray = this.prepareAndFilter(searchModel);

        console.log(andArray);
        return await collections.productHistoryModel
            ?.aggregate([
                {
                    $lookup: {
                        from: 'store-websites-relation',
                        localField: 'website',
                        foreignField: 'website',
                        as: 'storeWebsiteRelation',
                    },
                },
                { $unwind: '$variants' },
                {
                    $match: {
                        $and: andArray,
                        'variants.price': { $gte: searchModel.price_min },
                    },
                },
            ])
            .toArray();
    }

    /***
     *
     * @param searchModel {SearchModel}
     */
    prepareAndFilter(searchModel) {
        let andArray = [];

        if (searchModel.title) {
            andArray.push({ title: searchModel.title });
        }

        if (searchModel.handle) {
            andArray.push({ handle: searchModel.handle });
        }

        if (searchModel.body_html) {
            andArray.push({ body_html: searchModel.body_html });
        }

        if (searchModel.published_at) {
            andArray.push({ published_at: searchModel.published_at });
        }

        if (searchModel.created_at) {
            andArray.push({ created_at: searchModel.created_at });
        }

        if (searchModel.updated_at) {
            andArray.push({ updated_at: searchModel.updated_at });
        }

        if (searchModel.vendor) {
            andArray.push({ vendor: searchModel.vendor });
        }

        if (searchModel.product_type) {
            andArray.push({ product_type: searchModel.product_type });
        }

        if (searchModel.tags) {
            andArray.push({ tags: searchModel.tags });
        }

        if (searchModel.variants) {
            andArray.push({ variants: searchModel.variants });
        }

        if (searchModel.images) {
            andArray.push({ images: searchModel.images });
        }

        if (searchModel.options) {
            andArray.push({ options: searchModel.options });
        }

        if (searchModel.website) {
            andArray.push({ website: searchModel.website });
        }

        if (searchModel.collection) {
            andArray.push({ collection: searchModel.collection });
        }

        if (searchModel.created_date_time) {
            andArray.push({ created_date_time: searchModel.created_date_time });
        }

        //advanced filters
        if (searchModel.published_at_start) {
            andArray.push({
                published_at: {
                    $gte: new Date(searchModel.published_at_start).toISOString(),
                },
            });
        }

        if (searchModel.published_at_end) {
            andArray.push({
                published_at: {
                    $lte: new Date(searchModel.published_at_end).toISOString(),
                },
            });
        }

        if (searchModel.created_at_start) {
            andArray.push({
                created_at: {
                    $gte: new Date(searchModel.created_at_start).toISOString(),
                },
            });
        }

        if (searchModel.created_at_end) {
            andArray.push({
                created_at: {
                    $lte: new Date(searchModel.created_at_end).toISOString(),
                },
            });
        }

        if (searchModel.price_min) {
            andArray.push({ 'variants.price': { $gte: searchModel.price_min } });
        }

        if (searchModel.price_max) {
            andArray.push({ 'variants.price': { $lte: searchModel.price_max } });
        }

        andArray.push({ storeWebsiteRelation: { $not: { $size: 0 } } });
        andArray.push({ 'storeWebsiteRelation.storeId': searchModel.storeId });

        return andArray;
    }
}

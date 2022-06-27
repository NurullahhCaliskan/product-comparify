import SearchModel from '../model/searchModel.js';

export default class SearchMapper {
    /**
     *
     * @param storeId {number}
     * @param request {Request}
     * @return {SearchModel}
     */
    setSearchMapper(storeId, request) {
        let body = request.body;

        return new SearchModel(
            storeId,
            body.id,
            body.title,
            body.handle,
            body.body_httml,
            body.published_at,
            body.created_at,
            body.updated_at,
            body.vendor,
            body.product_type,
            body.tags,
            body.variants,
            body.images,
            body.options,
            body.website,
            body.collection,
            body.created_date_time,
            body.url,
            body.published_at_start,
            body.published_at_end,
            body.created_at_start,
            body.created_at_end,
            body.updated_at_start,
            body.updated_at_end,
            body.price_min,
            body.price_max
        );
    }
}

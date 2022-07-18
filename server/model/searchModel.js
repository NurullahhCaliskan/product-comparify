export default class SearchModel {
    constructor(
        storeId,
        id,
        title,
        handle,
        bodyHtml,
        publishedAt,
        createdAt,
        updatedAt,
        vendor,
        productType,
        tags,
        variants,
        images,
        options,
        website,
        collection,
        createdDateTime,
        url,
        publishedAtStart,
        publishedAtEnd,
        createdAtStart,
        createdAtEnd,
        updatedAtStart,
        updatedAtEnd,
        priceMin,
        priceMax,
        search
    ) {
        this.storeId = storeId;
        this.id = id;
        this.title = title;
        this.handle = handle;
        this.body_html = bodyHtml;
        this.published_at = publishedAt;
        this.created_at = createdAt;
        this.updated_at = updatedAt;
        this.vendor = vendor;
        this.product_type = productType;
        this.tags = tags;
        this.variants = variants;
        this.images = images;
        this.options = options;
        this.website = website;
        this.collection = collection;
        this.created_date_time = createdDateTime;
        this.url = url;

        //extra field
        this.published_at_start = publishedAtStart;
        this.published_at_end = publishedAtEnd;

        this.created_at_start = createdAtStart;
        this.created_at_end = createdAtEnd;

        this.updated_at_start = updatedAtStart;
        this.updated_at_end = updatedAtEnd;

        this.price_min = priceMin;
        this.price_max = priceMax;

        this.search = search;
    }
}

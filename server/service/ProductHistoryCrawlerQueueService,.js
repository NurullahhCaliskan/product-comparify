import ProductHistoryCrawlerQueueRepository from '../repository/ProductHistoryCrawlerQueueRepository.js';

export default class ProductHistoryCrawlerQueueService {
    /***
     * Add website to queue
     * @param url
     * @return {Promise<void>}
     */
    async addToQueue(url) {
        let productHistoryCrawlerQueueRepository = new ProductHistoryCrawlerQueueRepository();

        await productHistoryCrawlerQueueRepository.addToQueue(url);
    }
}

import axios from "axios";
import WebsiteRepository from "../repository/websiteRepository.js";

import cheerio from "cheerio";
import ProductHistoryCrawlerQueueRepository from "../repository/ProductHistoryCrawlerQueueRepository.js";

export default class ProductHistoryCrawlerQueueService {
  async addToQueue(url) {
    let productHistoryCrawlerQueueRepository =
      new ProductHistoryCrawlerQueueRepository();

    await productHistoryCrawlerQueueRepository.addToQueue(url);
  }
}

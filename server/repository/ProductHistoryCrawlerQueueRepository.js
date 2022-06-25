import MongoClient, { ObjectId } from "mongodb";
import IsNotValidUrlException from "../exception/isNotValidUrlException.js";
import OccurredUnknownErrorException from "../exception/occurredUnknownErrorException.js";
import { urlFormatter } from "../utility/stringUtility.js";
import { collections } from "../database.config.js";
import WebsiteService from "../service/websiteService.js";

export default class ProductHistoryCrawlerQueueRepository {
  /***
   * update or insert url
   * @param website website
   */
  async addToQueue(website) {
    let query = { website: website };
    let newRecord = { $set: { website: website } };

    await collections.productHistoryCrawlerQueueModel
      .updateOne(query, newRecord, { upsert: true })
      .then((r) => r)
      .catch((e) => e);
  }
}

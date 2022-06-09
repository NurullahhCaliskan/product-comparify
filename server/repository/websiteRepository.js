import { collections } from "../database.config.js";

export default class WebsiteRepository {
  async upsertWebSitesAllCollections(url, collection) {
    let query = { url: url };
    let newRecord = { $set: { url: url, collection: collection } };
    await collections.websitesModel.updateOne(query, newRecord, {
      upsert: true,
    });
  }

  async upsertWebSitesFavicon(url, faviconUrl) {
    let query = { url: url };
    let newRecord = { $set: { url: url, faviconUrl: faviconUrl } };
    await collections.websitesModel.updateOne(query, newRecord, {
      upsert: true,
    });
  }

  async upsertWebSitesCart(url, cart) {
    let query = { url: url };
    let newRecord = { $set: { url: url, cart: cart } };
    await collections.websitesModel.updateOne(query, newRecord, {
      upsert: true,
    });
  }
}

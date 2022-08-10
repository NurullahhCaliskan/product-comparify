import * as mongoDB from 'mongodb';
import dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const client = new mongoDB.MongoClient(process.env.DBHOST);

client.connect().then((r) => r);

const db = client.db(process.env.DBNAME);

export let collections = {
    storeWebsitesRelationModel: db.collection('store-websites-relation'),
    websitesModel: db.collection('websites'),
    productHistoryModel: db.collection('product-history'),
    userSessionModel: db.collection('user-session'),
    mailHistoryModel: db.collection('mail-history'),
    contactSupportModel: db.collection('contact-support'),
    productHistoryCrawlerQueueModel: db.collection('product-history-crawler-queue'),
    storeModel: db.collection('store'),
    storeUserModel: db.collection('store-user'),
    productMailHistoryModel: db.collection('product-mail-history'),
    logHistoryModel: db.collection('log-history'),
};

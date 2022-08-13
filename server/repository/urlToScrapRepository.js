import { ObjectId } from 'mongodb';
import IsNotValidUrlException from '../exception/isNotValidUrlException.js';
import OccurredUnknownErrorException from '../exception/occurredUnknownErrorException.js';
import { urlFormatter } from '../utility/stringUtility.js';
import { collections } from '../database.config.js';
import WebsiteService from '../service/websiteService.js';

export default class UrlToScrapRepository {
    /***
     * delete user's url
     * @param id id
     * @return {Promise<void>}
     */
    async deleteUrlToScrapRepository(id) {
        await collections.storeWebsitesRelationModel
            .findOneAndDelete({ _id: ObjectId(id) })
            .then((r) => r)
            .catch((e) => {
                throw new OccurredUnknownErrorException(JSON.stringify({ data: 'Occured unknown error' }));
            });
    }

    /***
     * add new url
     * @param url url
     * @param storeId storeId
     */
    async addUrlToScrapRepository(url, storeId) {
        let insertingData = {
            storeId: storeId,
            website: url,
            alarm: true,
            value: 10,
        };

        await collections.storeWebsitesRelationModel
            .insertOne(insertingData)
            .then((res) => res)
            .catch((e) => e);

        //update webservice collection
        let websiteService = new WebsiteService();
        let collectionResponse = await websiteService.getCollectionByWebsiteNameFromWeb(url);
        if (collectionResponse.length > 0) {
            await websiteService.upsertWebSitesAllCollections(url, collectionResponse);
        }

        let faviconResponse = await websiteService.getFaviconUrlByWebsiteNameFromWeb(url);
        await websiteService.upsertWebSitesFavicon(url, faviconResponse);

        let cartResponse = await websiteService.getCartByWebsiteNameFromWeb(url);
        await websiteService.upsertWebSitesCart(url, cartResponse);
    }

    /***
     * update or insert url
     * @param body request body
     * @param storeId storeId
     */
    async upsertUrlRepository(body, storeId) {
        body.url = urlFormatter(body.url);

        let query = { storeId: storeId, website: body.url };
        let newRecord = {
            $set: {
                storeId: storeId,
                website: body.url,
                alarm: body.alarm,
                value: body.value,
            },
        };

        await collections.storeWebsitesRelationModel
            .updateOne(query, newRecord, { upsert: true })
            .then((r) => r)
            .catch((e) => e);
    }

    /***
     * user url relation exists check
     * @param url url
     * @param storeId storeId
     * @return {Promise<void>}
     */
    async isExistsUserToUrlRelation(url, storeId) {
        let insertingData = { storeId: storeId, website: url };

        let response = [];
        await collections.storeWebsitesRelationModel
            .find(insertingData)
            .toArray()
            .then((resp) => {
                response = resp;

                if (response.length > 0) {
                    throw new IsNotValidUrlException(JSON.stringify({ data: 'This url is already exists' }));
                }
            })
            .catch((e) => {
                throw new IsNotValidUrlException(JSON.stringify({ data: 'This url is already exists' }));
            });
    }

    /***
     * user url relation exists check
     * @param url url
     * @param storeId storeId
     * @return {Promise<void>}
     */
    async storeMaximumLimitCheck(storeId) {
        let response = 0;
        await collections.storeWebsitesRelationModel
            ?.count({ storeId: storeId })
            .then((resp) => {
                response = resp;

                if (response >= 30) {
                    throw new IsNotValidUrlException(JSON.stringify({ data: 'Maximum 30 website monitor up' }));
                }
            })
            .catch((e) => {
                throw new IsNotValidUrlException(JSON.stringify({ data: 'Maximum 30 website monitor up' }));
            });
    }

    /**
     * get user's url
     * @param storeId storeId
     * @return {Promise<*[]|*>}
     */
    async getUserToUrlRelation(storeId) {
        let result = [];
        let aggregateJson = [
            {
                $lookup: {
                    from: 'websites', // other table name
                    localField: 'website', // name of users table field
                    foreignField: 'url', // name of userinfo table field
                    as: 'websites', // alias for userinfo table
                },
            },
            { $unwind: '$websites' },
            {
                $lookup: {
                    from: 'product-history-crawler-queue', // other table name
                    localField: 'website', // name of users table field
                    foreignField: 'website', // name of userinfo table field
                    as: 'queueWebsites', // alias for userinfo table
                },
            },
            {
                $match: {
                    $and: [{ storeId: storeId }],
                },
            },
            { $project: { id: 1, storeId: 1, website: 1, alarm: 1, value: 1, 'websites.faviconUrl': 1, queueWebsites: 1 } },
        ];

        await collections.storeWebsitesRelationModel
            .aggregate(aggregateJson)
            .toArray()
            .then((resp) => {
                result = resp;
            })
            .catch((e) => {
                result = [];
            });

        const newArrayOfObj = result.map(({ _id: id, ...rest }) => ({
            id,
            ...rest,
        }));

        return newArrayOfObj;
    }
}

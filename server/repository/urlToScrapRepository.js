import MongoClient, { ObjectId } from "mongodb";
import IsNotValidUrlException from "../exception/isNotValidUrlException.js";
import OccurredUnknownErrorException from "../exception/occurredUnknownErrorException.js";
import { urlFormatter } from "../utility/stringUtility.js";
import { collections } from "../database.config.js";
import WebsiteService from "../service/websiteService.js";

export default class UrlToScrapRepository {

    /***
     * delete user's url
     * @param id id
     * @return {Promise<void>}
     */
    async deleteUrlToScrapRepository(id) {

        await collections.userWebsitesRelationModel.findOneAndDelete({_id: ObjectId(id)}).then(r => r).catch(e => {
            throw new OccurredUnknownErrorException(JSON.stringify({data: "Occured unknown error"}))
        });

    }

    /***
     * add new url
     * @param url url
     * @param userid userid
     */
    async addUrlToScrapRepository(url, userid) {
        let insertingData = {userId: userid, website: url, alarm: true, value: 10}

        await collections.userWebsitesRelationModel.insertOne(insertingData).then(res => res).catch(e => e)

        //update webservice collection
        let websiteService = new WebsiteService()
        let collectionResponse = await websiteService.getCollectionByWebsiteNameFromWeb(url);
        if (collectionResponse.length > 0) {
            await websiteService.upsertWebSitesAllCollections(url, collectionResponse)
        }

        let faviconResponse = await websiteService.getFaviconUrlByWebsiteNameFromWeb(url);
        await websiteService.upsertWebSitesFavicon(url, faviconResponse);


    }

    /***
     * update or insert url
     * @param body request body
     * @param userid userid
     */
    async upsertUrlRepository(body, userid) {

        body.url = urlFormatter(body.url)

        let query = {userId: userid, website: body.url};
        let newRecord = {$set: {userId: userid, website: body.url, alarm: body.alarm, value: body.value}}

        await collections.userWebsitesRelationModel.updateOne(query, newRecord, {upsert: true}).then(r => r).catch(e => e);
    }

    /***
     * user url relation exists check
     * @param url url
     * @param userid userid
     * @return {Promise<void>}
     */
    async isExistsUserToUrlRelation(url, userid) {
        let insertingData = {userId: userid, website: url}

        let response = []
        await collections.userWebsitesRelationModel.find(insertingData).toArray().then(resp => {
            response = resp;

            if (response.length > 0) {
                throw new IsNotValidUrlException(JSON.stringify({data: 'This url has already exists'}))
            }
        }).catch(e => {
            throw new IsNotValidUrlException(JSON.stringify({data: 'This url has already exists'}))
        })


    }

    /**
     * get user's url
     * @param userid userid
     * @return {Promise<*[]|*>}
     */
    async getUserToUrlRelation(userid) {

        let result = []
        let aggregateJson = [{
            $lookup: {
                from: "websites",       // other table name
                localField: "website",   // name of users table field
                foreignField: "url", // name of userinfo table field
                as: "websites"         // alias for userinfo table
            }
        },
            {$unwind: "$websites"},

            {
                $match: {
                    $and: [{userId: userid}]
                }
            }
        ]

        await collections.userWebsitesRelationModel.aggregate(aggregateJson).toArray().then(resp => {
            result = resp
        }).catch(e => {
            result = []
        })

        return result
    }
}

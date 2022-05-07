import MongoClient from "mongodb";
import IsNotValidUrlException from "../exception/isNotValidUrlException.js";
import { collections } from "../database.config.js";

export default class MailRepository {

    /***
     * get user's mail
     * @param userid userid
     * @return {Promise<(Document & {_id: InferIdType<Document>})|{mail: null}>} mail
     */
    async getMailByUserid(userid) {

        let insertingData = {userId: userid}

        const options = {projection: {_id: 1, mail: 1}};
        let result = {}

        await collections.userModel.findOne(insertingData, options).then(resp => {
            result = resp;
        }).catch(e => {
            result = {mail: null}
        })

        return result;
    }

    /***
     * update or insert user's mail
     * @param mail mail
     * @param userid userid
     * @return {Promise<void>} void
     */
    async upsertMailByUserid(mail, userid) {

        let query = {userId: userid};
        let newRecord = {$set: {userId: userid, mail: mail}};


        collections.userModel.updateOne(query, newRecord).then(r => r).cache(e => e)

    }
}

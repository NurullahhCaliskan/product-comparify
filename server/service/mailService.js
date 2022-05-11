import MongoClient from "mongodb";
import MailRepository from "../repository/mailRepository.js";

export default class MailService {

    /***
     * update or insert mail
     * @param mail mail
     * @param userid userid
     * @return {Promise<void>}
     */
    async upsertUserMail(mail, userid) {
        let mailRepository = new MailRepository();

        await mailRepository.upsertMailByUserid(mail, userid);
    }

    /***
     * get user id
     * @param userid userid
     * @return {Promise<(Document&{_id: InferIdType<Document>})|{mail: null}>}
     */
    async getUserMail(userid) {
        let mailRepository = new MailRepository();

        return await mailRepository.getMailByUserid(userid);

    }

}

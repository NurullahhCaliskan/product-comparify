import { collections } from '../database.config.js';

export default class ContactSupportRepository {
    /***
     * save contact
     * @param userId
     * @param email
     * @param message
     * @param topic
     * @return {Promise<void>}
     */
    async saveContactRepository(userId, email, message, topic) {
        let resultJson = { userId: userId, email: email, message: message, topic: topic, create_date_time: new Date() };

        await collections.contactSupportModel
            .insertOne(resultJson)
            .then((res) => res)
            .catch((e) => e);
    }
}

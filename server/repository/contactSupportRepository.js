import { collections } from '../database.config.js';

export default class ContactSupportRepository {
    /***
     * save contact
     * @param userId
     * @param subject
     * @param message
     * @param topic
     * @return {Promise<void>}
     */
    async saveContactRepository(userId, subject, message, topic) {
        let resultJson = { userId: userId, subject: subject, message: message, topic: topic, create_date_time: new Date() };

        await collections.contactSupportModel
            .insertOne(resultJson)
            .then((res) => res)
            .catch((e) => e);
    }
}

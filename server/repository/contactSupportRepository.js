import { collections } from '../database.config.js';

export default class ContactSupportRepository {
    async saveContactRepository(userId, subject, message, topic) {
        let resultJson = { userId: userId, subject: subject, message: message, topic: topic };

        await collections.contactSupportModel
            .insertOne(resultJson)
            .then((res) => res)
            .catch((e) => e);
    }
}

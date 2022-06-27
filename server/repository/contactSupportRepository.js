import { collections } from '../database.config.js';

export default class ContactSupportRepository {
    async saveContactRepository(userId, subject, message) {
        let resultJson = { userId: userId, subject: subject, message: message };

        await collections.contactSupportModel
            .insertOne(resultJson)
            .then((res) => res)
            .catch((e) => e);
    }
}

import ContactSupportRepository from '../repository/contactSupportRepository.js';

export default class ContactSupportService {
    /***
     * save contact
     * @param userId
     * @param subject
     * @param message
     * @param topic
     * @return {Promise<void>}
     */
    async saveContactSupportService(userId, subject, message, topic) {
        let contactSupportRepository = new ContactSupportRepository();
        await contactSupportRepository.saveContactRepository(userId, subject, message, topic);
    }
}

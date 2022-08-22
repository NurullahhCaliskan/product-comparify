import ContactSupportRepository from '../repository/contactSupportRepository.js';

export default class ContactSupportService {
    /***
     * save contact
     * @param userId
     * @param email
     * @param message
     * @param topic
     * @return {Promise<void>}
     */
    async saveContactSupportService(userId, email, message, topic) {
        let contactSupportRepository = new ContactSupportRepository();
        await contactSupportRepository.saveContactRepository(userId, email, message, topic);
    }
}

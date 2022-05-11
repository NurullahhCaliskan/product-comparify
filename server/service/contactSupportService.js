import ContactSupportRepository from "../repository/contactSupportRepository.js";

export default class ContactSupportService {
    async saveContactSupportService(userId, subject, message) {
        let contactSupportRepository = new ContactSupportRepository()
        await contactSupportRepository.saveContactRepository(userId, subject, message)
    }
}

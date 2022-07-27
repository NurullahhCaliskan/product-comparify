import MailRepository from '../repository/mailRepository.js';

export default class MailService {
    /***
     * update or insert mail
     * @param mail mail
     * @param storeId storeId
     * @return {Promise<void>}
     */
    async upsertUserMail(mail, storeId) {
        let mailRepository = new MailRepository();

        await mailRepository.upsertMailByStoreId(mail, storeId);
    }

    /***
     * get user id
     * @param storeId storeId
     * @return {Promise<(Document&{_id: InferIdType<Document>})|{mail: null}>}
     */
    async getStoreMailByStoreId(storeId) {
        let mailRepository = new MailRepository();

        return await mailRepository.getStoreMailByStoreId(storeId);
    }
}

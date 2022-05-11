import MailHistoryRepository from "../repository/mailHistoryRepository.js";

export default class MailHistoryService {

    async getMailHistoryByUserid(userid) {
        let project =   { mailBody: 0 }

        let mailHistoryRepository = new MailHistoryRepository()

       return  await mailHistoryRepository.getMailHistoryByUserBy(userid,project);
    }
}

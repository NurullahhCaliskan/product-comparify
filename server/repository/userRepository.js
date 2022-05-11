import { collections } from "../database.config.js";

export default class UserRepository {

    async getUser(userId){
        let findJson = {userId: userId}

        let result = {}

        await collections.userModel.findOne(findJson).then(resp => {
            result = resp;
        }).catch(e => {
            result = {}
        })

        return result;

    }
}

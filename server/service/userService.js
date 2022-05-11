import { collections } from "../database.config.js";
import UserRepository from "../repository/userRepository.js";

export default class UserService {
    async getUser(userId){
        let userRepository = new UserRepository()

        await userRepository.getUser(userId)
    }
}

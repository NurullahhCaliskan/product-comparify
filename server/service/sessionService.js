import SessionRepository from '../repository/sessionRepository.js';

export default class SessionService {
    /***
     * save session
     * @param client
     * @param session
     * @return {Promise<void>}
     */
    async saveSession(client, session) {
        let sessionRepository = new SessionRepository();
        await sessionRepository.saveSession(client, session);
    }
}

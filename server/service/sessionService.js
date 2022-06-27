import SessionRepository from '../repository/sessionRepository.js';

export default class SessionService {
    async saveSession(client, session) {
        let sessionRepository = new SessionRepository();
        await sessionRepository.saveSession(client, session);
    }
}


import SessionRepository from "../repository/session.js";

export default class SessionService {
    session (session){
        let sessionRepository = new SessionRepository();
        sessionRepository.session(session);
    }
}

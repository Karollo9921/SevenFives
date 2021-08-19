import { SessionData } from 'express-session';
import User from './user';


declare module 'express-session' {
    interface SessionData {
        user: User,
        isLoggedIn: boolean
    }
};



export default SessionData;
import User from './user';

declare global {
  namespace Express {
    export interface Session {
      user: User,
      isLoggedIn: boolean
    }
  }
};


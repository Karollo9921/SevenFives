import { Router } from 'express';
import AuthController from '../controllers/authController'


class AuthRoute {
    public router: Router;
    public path: string;

    constructor() {
        this.path = '/auth'
        this.router = Router();
        this.initRoutes();
    }

    private initRoutes() {
        this.router.post('/register', new AuthController().register);
        this.router.post('/login', new AuthController().login);
        this.router.post('/logout', new AuthController().logout);
    };

};

export default AuthRoute;
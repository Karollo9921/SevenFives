import { Router } from 'express';
import AuthController from '../controllers/authController';
import RouteModel from './routeModel/routeModel';


class AuthRoute extends RouteModel {
    public router: Router;

    constructor(path: string) {
        super('/');
        this.path = path;
        this.router = Router();
        this.initRoutes();
    }

    initRoutes() {
        this.router.post('/register', new AuthController().register);
        // this.router.post('/login', new AuthController().login);
        // this.router.post('/logout', new AuthController().logout);
    };

};

export default AuthRoute;
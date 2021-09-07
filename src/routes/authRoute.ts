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

    protected initRoutes() {
        this.router.get('/register', new AuthController().getRegister);
        this.router.post('/register', new AuthController().postRegister);
        this.router.get('/login', new AuthController().getLogin);
        this.router.post('/login', new AuthController().postLogin);
        this.router.post('/logout', new AuthController().logout);
    };

};

export default AuthRoute;
import { Router } from 'express';
import UserController from '../controllers/userController';
import RouteModel from './routeModel/routeModel';


class UserRoute extends RouteModel {
    public router: Router;

    constructor(path: string) {
        super('/');
        this.path = path;
        this.router = Router();
        this.initRoutes();
    }

    initRoutes() {
        this.router.get('/user/:id', new UserController().getUser);
    };

};

export default UserRoute;
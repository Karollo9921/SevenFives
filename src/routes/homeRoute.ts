import { Router } from 'express';
import HomeController from '../controllers/homeController'
import RouteModel from './routeModel/routeModel';


class HomeRoute extends RouteModel {
    public router: Router;

    constructor(path: string) {
        super('/');
        this.path = path;
        this.router = Router();
        this.initRoutes();
    }

    initRoutes() {
        this.router.get('/', new HomeController().getHome)
    };

};

export default HomeRoute;

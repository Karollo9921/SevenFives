import { Router } from 'express';
import HomeController from '../controllers/homeController'
import RouteModel from './routeModel/routeModel';


class HomeRoute extends RouteModel {
    public router: Router;

    constructor() {
        super();
        this.router = Router();
        this.initRoutes();
    }

    protected initRoutes() {
        this.router.get('/', new HomeController().getHome)
    };

};

export default HomeRoute;

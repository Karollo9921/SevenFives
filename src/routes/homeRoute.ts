import { Router } from 'express';
import HomeController from '../controllers/homeController'


class HomeRoute {
    public router: Router;
    public path: string;

    constructor() {
        this.path = '/'
        this.router = Router();
        this.initRoutes();
    }

    private initRoutes() {
        this.router.get('/', new HomeController().getHome)
    };

};

export default HomeRoute;

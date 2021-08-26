import { Router } from 'express';
import PlayController from '../controllers/playController'
import RouteModel from './routeModel/routeModel';


class PlayRoute extends RouteModel {
    public router: Router;

    constructor(path: string) {
        super('/');
        this.path = path;
        this.router = Router();
        this.initRoutes();
    }

    initRoutes() {
        this.router.get('/play', new PlayController().getSelectGame)
    };

};

export default PlayRoute;
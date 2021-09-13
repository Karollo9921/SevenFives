import { Router } from 'express';
import PlayController from '../controllers/playController'
import RouteModel from './routeModel/routeModel';


class PlayRoute extends RouteModel {
    public router: Router;

    constructor() {
        super();
        this.router = Router();
        this.initRoutes();
    }

    protected initRoutes() {
        this.router.get('/play', new PlayController().getSelectGame)
    };

};

export default PlayRoute;
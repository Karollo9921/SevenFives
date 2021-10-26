import { Router } from 'express';
import MultiPlayerController from '../controllers/multiPlayerController'
import RouteModel from './routeModel/routeModel';


class MultiPlayer extends RouteModel {
    public router: Router;

    constructor() {
        super();
        this.router = Router();
        this.initRoutes();
    }

    protected initRoutes() {
        this.router.get('/play/multi-player-lobby/:id', new MultiPlayerController().getMultiPlayer)
    };

};

export default MultiPlayer;
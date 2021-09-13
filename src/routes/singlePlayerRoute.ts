import { Router } from 'express';
import SinglePlayerController from '../controllers/singlePlayerController'
import RouteModel from './routeModel/routeModel';


class SinglePlayer extends RouteModel {
    public router: Router;

    constructor() {
        super();
        this.router = Router();
        this.initRoutes();
    }

    protected initRoutes() {
        this.router.get('/play/single-player', new SinglePlayerController().getSinglePlayer)
    };

};

export default SinglePlayer;
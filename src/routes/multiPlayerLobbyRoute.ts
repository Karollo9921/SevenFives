import { Router } from 'express';
import MultiPlayerLobbyController from '../controllers/multiPlayerLobbyController'
import RouteModel from './routeModel/routeModel';


class MultiPlayerLobby extends RouteModel {
    public router: Router;

    constructor() {
        super();
        this.router = Router();
        this.initRoutes();
    }

    protected initRoutes() {
        this.router.get('/play/multi-player-lobby', new MultiPlayerLobbyController().getMultiPlayerLobby)
    };

};

export default MultiPlayerLobby;
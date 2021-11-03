import { Router } from 'express';
import TableIsFullController from '../controllers/tableIsFullController'
import RouteModel from './routeModel/routeModel';


class TableIsFullRoute extends RouteModel {
    public router: Router;

    constructor() {
        super();
        this.router = Router();
        this.initRoutes();
    }

    protected initRoutes() {
        this.router.get('/play/table-is-full', new TableIsFullController().getTableIsFull)
    };

};

export default TableIsFullRoute;
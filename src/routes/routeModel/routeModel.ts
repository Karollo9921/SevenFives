import { Router } from 'express';

export default abstract class RouteModel {
    public router: Router;
    public path: string;

    constructor(path: string) {
        this.path = path;
        this.router = Router();
        this.initRoutes();
    }

    abstract initRoutes(): void;

}
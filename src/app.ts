import express, { Request, Response, NextFunction } from 'express';
import { Application } from 'express';
import HomeRoute from '../src/routes/homeRoute';
import dotenv from 'dotenv';
import connectDB from './config/db';
import RouteModel from './routes/routeModel/routeModel';


class App {
    public port: number;
    public app: Application;

    constructor(appSetup: { port: number; middlewares: any, routes: RouteModel[]} ) {
        this.app = express();
        this.port = +process.env.PORT! || appSetup.port;
        this.useMiddlewares(appSetup.middlewares);
        this.useRoutes(appSetup.routes);
        dotenv.config();
        connectDB();
    };

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`This server is listening on port ${this.port}`);
        })
    };

    private useMiddlewares(middlewares: any) {
        middlewares.forEach((middleware: any) => {
            console.log(middleware);
            this.app.use(middleware);
        });
    };

    private useRoutes(routes: HomeRoute[]) {
        routes.forEach((route: HomeRoute) => {
            this.app.use(route.path, this.allowCrossDomain, route.router);
        });
    };

    public allowCrossDomain(req: Request, res: Response, next: NextFunction) {
        res.header('Access-Control-Allow-Origin', "*");
        res.header('Access-Control-Allow-Headers', "*");
        next();
      }
};

export default App;
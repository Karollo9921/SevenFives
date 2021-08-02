import express, { Request, Response } from 'express';
import { Application } from 'express';
import HomeRoute from '../src/routes/homeRoute';


class App {
    public port: number;
    public app: Application;

    constructor(appSetup: { port: number; middlewares: any, routes: HomeRoute[]} ) {
        this.app = express();
        this.port = appSetup.port;
        this.useRoutes(appSetup.routes);
        this.useMiddlewares(appSetup.middlewares);
    };

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`This server is listening on port ${this.port}`);
        })
    };

    private useMiddlewares(middlewares: any) {
        middlewares.forEach((middleware: any) => {
            this.app.use(middleware);
        });
    };

    private useRoutes(routes: HomeRoute[]) {
        routes.forEach((route: HomeRoute) => {
            this.app.use(route.path, this.allowCrossDomain, route.router);
        });
    };

    public allowCrossDomain(req: Request, res: Response, next: any) {
        res.header('Access-Control-Allow-Origin', "*");
        res.header('Access-Control-Allow-Headers', "*");
        next();
      }
};

export default App;
import express, { Request, Response, NextFunction } from 'express';
import RouteModel from './routes/routeModel/routeModel';
import { Application } from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db';


class App {
    public port: number;
    public app: Application;

    constructor(appSetup: { port: number; middlewares: any, routes: RouteModel[] }) {
        this.app = express();
        this.port = +process.env.PORT! || appSetup.port;
        dotenv.config();
        connectDB();
        this.app.enable('trust proxy');
        this.useMiddlewares(appSetup.middlewares);
        this.useRoutes(appSetup.routes);
    };

    public listen() {
        return this.app.listen(this.port, () => {
            console.log(`This server is listening on port ${this.port}`);
        })
    };

    private useMiddlewares(middlewares: any) {
        middlewares.forEach((middleware: any) => {
            this.app.use(middleware);
        });
    };

    private useRoutes(routes: RouteModel[]) {
        routes.forEach((route: RouteModel) => {
            this.app.use('/', this.allowCrossDomain, route.router);
        });
    };

    public allowCrossDomain(req: Request, res: Response, next: NextFunction) {
        res.header("Access-Control-Allow-Origin", "http://localhost:5000");
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
      }

    
};

export default App;
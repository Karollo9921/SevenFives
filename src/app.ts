import express, { Request, Response, NextFunction } from 'express';
import RouteModel from './routes/routeModel/routeModel';
import { Application } from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import * as socketio from 'socket.io';
import Lobby from './models/lobby';
import path from 'path';
import url from './config/url';


class App {
    public port: number;
    public app: Application;

    constructor(appSetup: { port: number; middlewares: any, routes: RouteModel[] }) {
        this.app = express();
        this.port = +process.env.PORT! || appSetup.port;

        dotenv.config();
        connectDB();

        this.app.set('trust proxy', 1);

        this.useMiddlewares(appSetup.middlewares);
        this.useRoutes(appSetup.routes);
        this.createLobby();
        this.buildFrontendOnProd();
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
            this.app.use('/api', this.allowCrossDomain, route.router);
        });
    };

    private async createLobby() {
        let isLobbyExists = await Lobby.findOne({});
        if (!isLobbyExists) {
            const newLobby = new Lobby({
                chat: [],
                activePlayers: [],
                createdGames: []
            });

            newLobby.save();
        }
    };

    public allowCrossDomain(req: Request, res: Response, next: NextFunction) {
        res.header("Access-Control-Allow-Origin", url.url);
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
      }

      buildFrontendOnProd() {
        if (process.env.NODE_ENV === 'production') {
            this.app.use(express.static(path.join(__dirname, '/../../Frontend/client')));
    
            this.app.get('/*', (req, res) =>
              res.sendFile(path.resolve(__dirname, '..', 'Frontend', 'client', 'index.html'))
            );
          } 
    };
    

    
};

export default App;
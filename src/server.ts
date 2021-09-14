import HomeRoute from '../src/routes/homeRoute';
import AuthRoute from '../src/routes/authRoute';
import UserRoute from '../src/routes/userRoute';
import PlayRoute from './routes/playRoute';
import SinglePlayer from './routes/singlePlayerRoute';
import MultiPlayerLobby from './routes/multiPlayerLobbyRoute';


import App from './app';
import express from 'express';
import * as http from 'http';
import cors from 'cors';
import session from 'express-session';
import { store } from './config/db';
import cookieParser from 'cookie-parser';
import SessionData from './interfaces/userSession';


import * as socketio from 'socket.io';
const io: socketio.Server = new socketio.Server({
    cors: {
        origin: "http://localhost:5000"
    }
});


const app = new App({
    port: 3000,
    middlewares: [
        cors({ 
            origin: "http://localhost:5000",
            methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
            credentials: true 
        }),
        cookieParser(),
        session({ 
            secret: 'my secret', 
            resave: true,
            saveUninitialized: false,
            store: store,
        }),
        express.json({ type: "application/json" }),
        express.urlencoded({ extended: true }),
    ],
    routes: [
        new HomeRoute(),
        new AuthRoute(),
        new UserRoute(),
        new PlayRoute(),
        new SinglePlayer(),
        new MultiPlayerLobby(),
    ]
});


const server: http.Server = app.listen();
io.attach(server);

// io.of('/play/multi-player-lobby').on('connection', (socket: socketio.Socket) => {
//     socket.emit('messageFromServer', { data: "req.session.user!.login" });
//     socket.on('dataToServer', (dataFromClient: object) => {
//         console.log(dataFromClient)
//     });
// });


app.app.set('socketio', io);



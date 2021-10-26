import HomeRoute from '../src/routes/homeRoute';
import AuthRoute from '../src/routes/authRoute';
import UserRoute from '../src/routes/userRoute';
import PlayRoute from './routes/playRoute';
import SinglePlayer from './routes/singlePlayerRoute';
import MultiPlayer from './routes/multiPlayerRoute';
import MultiPlayerLobby from './routes/multiPlayerLobbyRoute';


import App from './app';
import express from 'express';
import * as http from 'http';
import cors from 'cors';
import session from 'express-session';
import { store } from './config/db';
import url from './config/url';
import SessionData from './interfaces/userSession';


import * as socketio from 'socket.io';
const io: socketio.Server = new socketio.Server({
    cors: {
        origin: url.url
    }
});


const app = new App({
    port: 3000,
    middlewares: [
        cors({ 
            origin: url.url,
            methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
            credentials: true 
        }),
        session({ 
            secret: 'my secret', 
            resave: url.url === 'http://localhost:5000' ? true : false,
            saveUninitialized: url.url === 'http://localhost:5000' ? false : true,
            store: store,
            cookie: {
                secure: url.url === 'http://localhost:5000' ? false : true
            }
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
        new MultiPlayer(),
        new MultiPlayerLobby(),
    ]
});


const server: http.Server = app.listen();
io.attach(server);


var users: { user: string, sid: string }[] = [];

io.of('/api/play/multi-player-lobby').on('connection', (socket: socketio.Socket) => {

    socket.on('dataToServer', (dataFromClient: object) => {

        let userToAdd = { user: Object.values(dataFromClient)[0], sid: socket.id }
        if (!users.find(user => user === userToAdd)) {
            users.push(userToAdd)
        }
        
        io.of('/api/play/multi-player-lobby').emit('updateUsersList', users);
    });

    socket.on('send-chat-message', (data: object) => {
        io.of('/api/play/multi-player-lobby').emit('display-chat-message', data)
    });

    socket.on('create-a-game', (data: object) => {
        io.of('/api/play/multi-player-lobby').emit('display-created-game', data)
    });

    socket.on('disconnect', () => {
        users = users.filter((user) => user.sid !== socket.id)
        io.of('/api/play/multi-player-lobby').emit('updateUsersList', users);
    });

});


// app.app.set('socketio', io);







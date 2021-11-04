import HomeRoute from '../src/routes/homeRoute';
import AuthRoute from '../src/routes/authRoute';
import UserRoute from '../src/routes/userRoute';
import PlayRoute from './routes/playRoute';
import SinglePlayer from './routes/singlePlayerRoute';
import MultiPlayer from './routes/multiPlayerRoute';
import MultiPlayerLobby from './routes/multiPlayerLobbyRoute';
import TableIsFullRoute from './routes/tableIsFullRoute';


import App from './app';
import express from 'express';
import * as http from 'http';
import cors from 'cors';
import session from 'express-session';
import { store } from './config/db';
import url from './config/url';
import SessionData from './interfaces/userSession';
import Game from './models/game';


import * as socketio from 'socket.io';
import { isConstructorDeclaration } from 'typescript';
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
        new TableIsFullRoute()
    ]
});


const server: http.Server = app.listen();
io.attach(server);

var usersInTheGame: { namespace: string, user: string, sid: string, position: number }[] = [];

const socketsToGame = async () => {
    try {
        var namespaces = await Game.find({ status: 'waiting' }, {_id: 1});    
        namespaces.forEach(async (ns) => {

            try {
                var numOfPlayers = await Game.find({ _id: ns._id }, {_id: 0, numOfPlayers: 1});
                // console.log(numOfPlayers[0].numOfPlayers);
            } catch (error) {
                console.log(`Error: ${error}`)
            }

            io.of('/api/play/multi-player-lobby/' + ns._id).on('connection', async (nsSocket) => {
                // var game = await Game.findById(ns._id).exec();
                if (io.of('/api/play/multi-player-lobby/' + ns._id).sockets.size > numOfPlayers[0].numOfPlayers) {
                    // io.of('/api/play/multi-player-lobby/' + ns._id).emit('full', 'Sorry, table is full');
                    io.of('/api/play/multi-player-lobby/' + ns._id).in(nsSocket.id).emit('full', 'Sorry, table is full');
                }

                io.of('/api/play/multi-player-lobby/' + ns._id).emit('hello', 'Hello');

                nsSocket.on('data-to-server', (dataFromClient: object) => {
                    var position = 0;
                    usersInTheGame.forEach((user) => {
                        if (user.position === position) {
                            position += 1;
                        }
                    });
                    console.log(dataFromClient);
                    let userToAdd = { namespace: ns._id, user: Object.values(dataFromClient)[0], sid: nsSocket.id, position: position }
                    if (!usersInTheGame.find(user => user.user == userToAdd.user)) {
                        usersInTheGame.push(userToAdd)
                    }
                    console.log(usersInTheGame);
                    io.of('/api/play/multi-player-lobby/' + ns._id).emit('updateUsersList', usersInTheGame);
                });
                nsSocket.on('send-chat-message', (data: object) => {
                    io.of('/api/play/multi-player-lobby/' + ns._id).emit('display-chat-message', data)
                });
                nsSocket.on('disconnect', () => {
                    usersInTheGame = usersInTheGame.filter((user) => user.sid !== nsSocket.id);
                    io.of('/api/play/multi-player-lobby/' + ns._id).emit('updateUsersList', usersInTheGame);
                });
            })
        })
    } catch (error) {
        console.log(`Error: ${error}`)
    }
};


var usersInLobby: { user: string, sid: string }[] = [];

io.of('/api/play/multi-player-lobby').on('connection', async (socket: socketio.Socket) => {

    socket.on('dataToServer', (dataFromClient: object) => {
        
        let userToAdd = { user: Object.values(dataFromClient)[0], sid: socket.id }
        if (!usersInLobby.find(user => user === userToAdd)) {
            usersInLobby.push(userToAdd)
        }
        
        io.of('/api/play/multi-player-lobby').emit('updateUsersList', usersInLobby);
    });
    
    socket.on('send-chat-message', (data: object) => {
        io.of('/api/play/multi-player-lobby').emit('display-chat-message', data)
    });
    
    socket.on('create-a-game', (data) => {
        socketsToGame();
        io.of('/api/play/multi-player-lobby').emit('display-created-game', data);
    });
    
    socket.on('get-num-of-players-in-game', (gamesId) => {
        var dataToClient = gamesId.map((gameId: string) => {
            console.log()
            return { [gameId]: io.of('/api/play/multi-player-lobby/' + gameId).sockets.size }
        });
        io.of('/api/play/multi-player-lobby').emit('refresh-num-of-players-data', dataToClient);
    })

    socket.on('disconnect', () => {
        usersInLobby = usersInLobby.filter((user) => user.sid !== socket.id)
        io.of('/api/play/multi-player-lobby').emit('updateUsersList', usersInLobby);

        setTimeout(async () => {
            try {
                var gamesId = await Game.find({ status: 'waiting' }, {_id: 1});
                var dataToClient = gamesId.map((gameId) => {
                    return { [gameId._id]: io.of('/api/play/multi-player-lobby/' + gameId._id).sockets.size }
                });
                console.log(dataToClient)
                io.of('/api/play/multi-player-lobby').emit('refresh-num-of-players-data', dataToClient);
            } catch (error) {
                console.log(`Error: ${error}`)
            }
        }, 2000)
    });



});


socketsToGame();

// app.app.set('socketio', io);







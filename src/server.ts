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
import { GameStatus } from './utilities/gameStatus';


import * as socketio from 'socket.io';
import { isConstructorDeclaration } from 'typescript';
import { resourceLimits } from 'worker_threads';
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


const socketsToGame = async () => {
    try {
        var namespaces = await Game.find({ status: GameStatus.Waiting }, {_id: 1});    
        namespaces.forEach(async (ns) => {
            
            let usersInTheGame: { namespace: string, user: string, sid: string, position: number }[] = [];
            try {
                var game = await Game.findById(ns._id).exec();
                var numOfPlayers = await Game.find({ _id: ns._id }, {_id: 0, numOfPlayers: 1});
            } catch (error) {
                console.log(`Error: ${error}`)
            }

            io.of('/api/play/multi-player-lobby/' + ns._id).on('connection', async (nsSocket) => {
                if (io.of('/api/play/multi-player-lobby/' + ns._id).sockets.size > numOfPlayers[0].numOfPlayers) {
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

                    let userToAdd = { namespace: ns._id, user: Object.values(dataFromClient)[0], sid: nsSocket.id, position: position }
                    if (!usersInTheGame.find(user => user.user == userToAdd.user)) {
                        usersInTheGame.push(userToAdd)
                    }

                    io.of('/api/play/multi-player-lobby/' + ns._id).emit('updateUsersList', usersInTheGame);
                });

                nsSocket.on('send-chat-message', (data: object) => {
                    io.of('/api/play/multi-player-lobby/' + ns._id).emit('display-chat-message', data)
                });

                nsSocket.on('clicked-start', (user) => {
                    io.of('/api/play/multi-player-lobby/' + ns._id).emit('is-ready', user);
                });

                nsSocket.on('clicked-cast-dices', async (data) => {
                    console.log(data.dices);

                    try {
                        game!.allDices = game!.allDices.concat(data.dices);
                        await game!.save();
                    } catch (error) {
                        console.log(`Error: ${error}`)
                    }

                    io.of('/api/play/multi-player-lobby/' + ns._id).emit('the-die-is-cast', data.user);
                });

                nsSocket.on('game-started-players', async (players: { login: string, numOfDices: number }[]) => {
                    console.log(players);
                    console.log(game!.players.length);
                    try {
                        if (game!.players.length === 0) {
                            players.forEach((player: { login: string, numOfDices: number }) => {
                                game!.players.push(player)
                            });
                            game!.playerTurn = game!.players[Math.ceil(Math.random() * game!.players.length) - 1].login;
                            game!.status = GameStatus.Started;
                            await game!.save();
                        }
                    } catch (error) {
                        console.log(`Error: ${error}`)
                    }
                })

                nsSocket.on('start-the-round', (data) => {
                    if (game!.players.filter((player) => player.numOfDices > 5).map((player) => { return player.login }).includes(game!.playerTurn)) {
                        let playerIndex = usersInTheGame.findIndex((player => player.user === data.playerTurn));

                        let i = 1;
                        while (
                            game!.players
                                .filter((player) => player.numOfDices > 5)
                                .map((player) => { return player.login })
                                .includes(usersInTheGame[(playerIndex + i) % game!.numOfPlayers].user) && i < 10
                            ) {

                            i += 1;
                        };

                        game!.playerTurn = usersInTheGame[(playerIndex + i) % game!.numOfPlayers].user;
                    }

                    io.of('/api/play/multi-player-lobby/' + ns._id).emit('start-the-new-round', { 
                        players: game!.players,
                        playerTurn: game!.playerTurn,
                        round: game!.round,
                        turn: game!.turn,
                        playerPreviousTurn: game!.playerPreviousTurn,
                        numOfAllDices: game!.numOfAllDices,
                        currentBid: game!.currentBid
                    });
                });

                nsSocket.on('next-turn', async (data) => {
                    try {
                            
                        game!.playerTurn = data.playerTurn;
                        game!.playerPreviousTurn = data.playerPreviousTurn;
                        game!.currentBid = data.currentBid;
                        game!.turn += 1;
                        game!.fullBacklog.push(data.fullBacklog);

                        console.log(game!.allDices);

                        await game!.save();

                        io.of('/api/play/multi-player-lobby/' + ns._id).emit('continue-the-round', {  
                            players: game!.players,
                            playerTurn: game!.playerTurn,
                            round: game!.round,
                            turn: game!.turn,
                            playerPreviousTurn: game!.playerPreviousTurn,
                            numOfAllDices: game!.numOfAllDices,
                            currentBid: game!.currentBid,
                            backlogMessage: data.backlogMessage,
                            allDices: game!.allDices,
                            lastMove: data.lastMove
                        });

                    } catch (error) {
                        console.log(`Error: ${error}`)
                    }
                });

                nsSocket.on('end-of-the-round', async (data) => {
                    try {
                        let playerIndex = game!.players.findIndex((player => player.login === data.playerTurn));
                        game!.players[playerIndex].numOfDices += 1;

                        if (game!.players[playerIndex].numOfDices > 5) {
                            game!.result.push({ 
                                place: game!.numOfPlayers - game!.result.length,
                                player: game!.players[playerIndex].login
                            });
                            game!.numOfAllDices -= 5;
                        } else {
                            game!.numOfAllDices += 1;
                        }

                        game!.playerTurn = data.playerTurn;
                        game!.playerPreviousTurn = data.playerPreviousTurn;
                        game!.currentBid = data.currentBid;
                        game!.round += 1;
                        game!.turn = 1;
                        game!.fullBacklog.push(data.fullBacklog);
                        game!.allDices = [];

                        await game!.save();

                        io.of('/api/play/multi-player-lobby/' + ns._id).emit('summary', { 
                            result: game!.result,
                            players: game!.players,
                            numOfPlayers: game!.numOfPlayers,
                            numOfAllDices: game!.numOfAllDices,
                            playerTurn: data.playerTurn,
                            backlogMessages: data.backlogMessages,
                        });


                    } catch (error) {
                        console.log(`Error: ${error}`)
                    }
                });

                nsSocket.on('game-end', async (winner) => {
                    try {
                        game!.result.push({ place: 1, player: winner });
                        game!.status = GameStatus.Finished;
                        await game!.save();
                    } catch (error) {
                        console.log(`Error: ${error}`)
                    };
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
            return { [gameId]: io.of('/api/play/multi-player-lobby/' + gameId).sockets.size }
        });
        io.of('/api/play/multi-player-lobby').emit('refresh-num-of-players-data', dataToClient);
    })

    socket.on('disconnect', () => {
        usersInLobby = usersInLobby.filter((user) => user.sid !== socket.id)
        io.of('/api/play/multi-player-lobby').emit('updateUsersList', usersInLobby);

        setTimeout(async () => {
            try {
                var gamesId = await Game.find({ status: GameStatus.Waiting }, {_id: 1});
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







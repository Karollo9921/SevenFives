import { Request, Response } from 'express';
import * as socketio from 'socket.io';
import Lobby from '../models/lobby';
import Game from '../models/game';
import { GameStatus } from '../utilities/gameStatus';
import url from '../config/url';


class MultiPlayerLobbyController {

    constructor() {
        
    }

    getMultiPlayerLobby(req: Request, res: Response) {
        res.json({ isLoggedIn: req.session.isLoggedIn, user: req.session.user })
    }

    async postCreateMultiPlayerGame(req: Request, res: Response) {

        console.log(req.body);
        
        try {
            const game = new Game({
                numOfPlayers: req.body.numOfPlayers,
                players: [ req.session.user?.login ],
                status: GameStatus.Waiting,
                backlog: [],
                result: []
            });

            await game.save();

            console.log(game);

            return res.status(201).json({
                succes: true,
                url: url.url + '/play/multi-player-lobby/' + game._id,
                user: req.session.user,
                game: game
            });

        } catch (error) {
            return res.status(400).json({
                succes: false,
                message: `Error: ${error}`
            })
        }
    }

};


export default MultiPlayerLobbyController;
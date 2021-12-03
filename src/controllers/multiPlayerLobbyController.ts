import { Request, Response } from 'express';
import * as socketio from 'socket.io';
import Lobby from '../models/lobby';
import Game from '../models/game';
import User from '../models/user';
import { GameStatus } from '../utilities/gameStatus';
import url from '../config/url';


class MultiPlayerLobbyController {

    constructor() {
        
    }

    async getMultiPlayerLobby(req: Request, res: Response) {

        const waitingGames = await Game.find({ status: GameStatus.Waiting }, { _id: 1, creator: 1, creator_uid: 1, numOfPlayers: 1 });
        const user = await User.findById(req.session.user?._id).exec();

        res.json({ 
            isLoggedIn: req.session.isLoggedIn, 
            user: user,
            waitingGames: waitingGames
        })
    }

    async postCreateMultiPlayerGame(req: Request, res: Response) {
        
        try {
            const game = new Game({
                numOfPlayers: req.body.numOfPlayers,
                players: [],
                status: GameStatus.Waiting,
                backlog: [],
                result: [],
                creator: req.session.user?.login,
                creator_uid: req.session.user?.uid,
                playerTurn: '',
                playerPreviousTurn: '',
                currentBid: [],
                allDices: [],
                numOfAllDices: req.body.numOfPlayers,
                round: 1,
                turn: 1,
            });

            await game.save();

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
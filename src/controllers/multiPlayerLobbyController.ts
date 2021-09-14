import { Request, Response } from 'express';
import * as socketio from 'socket.io';
import Lobby from '../models/lobby';


class MultiPlayerLobbyController {

    constructor() {

    }

    getMultiPlayerLobby(req: Request, res: Response) {
        var io = req.app.get('socketio');
        io.of('/play/multi-player-lobby').on('connection', (socket: socketio.Socket) => {
            socket.emit('messageFromServer', { data: req.session.user!.login });
            socket.on('dataToServer', (dataFromClient: object) => {
                console.log(dataFromClient)
            });
        });
        
        res.json({ isLoggedIn: req.session.isLoggedIn, user: req.session.user })
    }

};


export default MultiPlayerLobbyController;
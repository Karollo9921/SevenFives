import { Request, Response } from 'express';
import * as socketio from 'socket.io';
import Lobby from '../models/lobby';


class MultiPlayerLobbyController {

    constructor() {
        
    }

    getMultiPlayerLobby(req: Request, res: Response) {
                
        res.json({ isLoggedIn: req.session.isLoggedIn, user: req.session.user })
        
    }

};


export default MultiPlayerLobbyController;
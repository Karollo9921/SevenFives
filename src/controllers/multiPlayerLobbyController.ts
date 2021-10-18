import { Request, Response } from 'express';
import * as socketio from 'socket.io';
import Lobby from '../models/lobby';


class MultiPlayerLobbyController {

    constructor() {
        
    }

    getMultiPlayerLobby(req: Request, res: Response) {
        
        let socket_id: string[] = [];
        var io = req.app.get('socketio');

        io.of('/api/play/multi-player-lobby').on('connection', (socket: socketio.Socket) => {
            socket_id.push(socket.id);
            if (socket_id[0] === socket.id) {
              socket.removeAllListeners('connection'); 
            }

            console.log('User is connected !');

            socket.emit('updateUsersList', { user: req.session.user!.login });

            socket.on('dataToServer', (dataFromClient: object) => {
                console.log(dataFromClient)
            });

            socket.on('disconnect', () => {
                socket.emit('updateUsersList', { user: req.session.user!.login });
                console.log('User: ' + req.session.user!.login + ' is disconnected');
            })

        });
        
        res.json({ isLoggedIn: req.session.isLoggedIn, user: req.session.user })
        
    }

};


export default MultiPlayerLobbyController;
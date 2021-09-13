import { Request, Response } from 'express';


class MultiPlayerLobbyController {

    constructor() {

    }

    getMultiPlayerLobby(req: Request, res: Response) {
        res.json({ isLoggedIn: req.session.isLoggedIn, user: req.session.user })
    }

};


export default MultiPlayerLobbyController;
import { Request, Response } from 'express';


class PlayController {

    constructor() {

    }

    getSelectGame(req: Request, res: Response) {
        res.json({ isLoggedIn: req.session.isLoggedIn, user: req.session.user })
    }

};


export default PlayController;
import { Request, Response } from 'express';


class SinglePlayerController {

    constructor() {

    }

    getSinglePlayer(req: Request, res: Response) {
        res.json({ isLoggedIn: req.session.isLoggedIn, user: req.session.user })
    }

};


export default SinglePlayerController;
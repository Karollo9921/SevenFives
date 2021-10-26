import { Request, Response } from 'express';
import Game from '../models/game';


class MultiPlayerController {

    constructor() {

    }

    getMultiPlayer(req: Request, res: Response) {

        try {
            
            res.json({ 
                isLoggedIn: req.session.isLoggedIn, 
                user: req.session.user
            })

        } catch (error) {
            
        }

    }

};


export default MultiPlayerController;
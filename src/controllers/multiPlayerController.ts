import { Request, Response } from 'express';
import Game from '../models/game';


class MultiPlayerController {

    constructor() {

    }

    async getMultiPlayer(req: Request, res: Response) {

        // console.log(req.params.id);

        try {
            
            let gameId = req.params.id

            const game = await Game.findById(gameId).exec();
            
            res.json({ 
                isLoggedIn: req.session.isLoggedIn, 
                user: req.session.user,
                game: game
            })

        } catch (error) {
            console.log(`Error: ${error}`);
        }

    }

};


export default MultiPlayerController;
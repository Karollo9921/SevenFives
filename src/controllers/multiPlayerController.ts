import { Request, Response } from 'express';
import Game from '../models/game';
import User from '../models/user';
import mongoose from 'mongoose';

class MultiPlayerController {

    constructor() {

    }

    async getMultiPlayer(req: Request, res: Response) {

        // console.log(req.params.id);

        try {
            
            let gameId = req.params.id

            // Game.findByIdAndUpdate(
            //     gameId,
            //     { $push: { 
            //         "players": req.session.user?.login 
            //         } 
            //     }
            // );

            const game = await Game.findById(gameId).exec();
            const user = await User.findById(req.session.user?._id).exec();

            // console.log(game!.players)

            // if (!(game!.players.includes(req.session.user?.login!))) {
            //     game!.players.push(req.session.user?.login!)
            //     await game!.save();
            // }
            
            
            res.json({
                isLoggedIn: req.session.isLoggedIn, 
                user: user,
                game: game
            })

        } catch (error) {
            console.log(`Error: ${error}`);
        }

    }

};


export default MultiPlayerController;
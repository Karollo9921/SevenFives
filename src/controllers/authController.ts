import { Request, Response } from 'express';
import User from '../models/user';
import bcrypt from 'bcrypt';


class AuthController {

    constructor() {

    }

    register(req: Request, res: Response) {
        let uid = +User.find().sort({uid:-1}).limit(1) + 1 || 1;
        let { login, pswd, pswd2 } = req.body;
        console.log(req.body);
        if (pswd !== pswd2) {
            return res.redirect('/register');
        }
    
        // check if that user exists
        User.findOne({ login })
            .then((user) => {
                if (user) {
                    return res.redirect('/');
                };

            });
        
        // creating a new user
        const newUser = new User({
            uid: uid,
            login: login,
            password: bcrypt.hash(pswd, 12)
        });

        // saving user to database 
        return newUser.save()
        .then((user) => {
            res.redirect('/')
            res.status(201).json({
                message: `User ${user} has been registered`
            })
        })
    };


    login(req: Request, res: Response) {
        
    }


    logout(req: Request, res: Response) {
        
    }


    
};


export default AuthController;
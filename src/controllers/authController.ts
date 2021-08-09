import { Request, Response } from 'express';
import User from '../models/user';
import bcrypt from 'bcrypt';


class AuthController {

    constructor() {

    }

    async register(req: Request, res: Response) {
        //uid
        let uidMax: number[] = [];
        (await User.find({}, {uid: 1, _id: 0} ).sort({uid:-1}).limit(1)).forEach((u) => uidMax.push(+u.uid + 1));
        let uid = uidMax[0] || 1;

        //req.body
        let { login, password, password2 } = req.body;

        //check password confirmation
        if (password !== password2) {
            return res.status(400).json({
                message: "Password do not match"
            });
        }
    
        // check if that user exists
        await User.findOne({ 
            login: login 
        }).then(user => {
            if (user) {
                return res.status(400).json({
                    message: "That User already exists"
                }); 
            }
        })
        
        // creating a new user
        const newUser = new User({
            uid: uid,
            login: login,
            password: await bcrypt.hash(password, 10)
        });

        // saving user to database 
        await newUser.save().then(user => {
            return res.status(201).json({
                success: true,
                message: "User has been created"
                })
        });


        
    };


    login(req: Request, res: Response) {
        
    }


    logout(req: Request, res: Response) {
        
    }


    
};


export default AuthController;
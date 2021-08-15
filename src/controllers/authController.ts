import { Request, Response } from 'express';
import User from '../models/user';
import bcrypt from 'bcrypt';


class AuthController {

    constructor() {

    }

    async postRegister(req: Request, res: Response) {
        //uid
        let uidMax: number[] = [];
        (await User.find({}, {uid: 1, _id: 0} ).sort({uid:-1}).limit(1)).forEach((u) => uidMax.push(+u.uid + 1));
        let uid = uidMax[0] || 1;
        console.log(req.body);
        // console.log(uid);

        //req.body
        let { login, password, password2 } = req.body;

        //check password confirmation
        if (password !== password2) {
            return res.status(400).json({
                success: false,
                message: "Password do not match",
                url: "/client/components/register/register.html"
            });
        }
    
        // check if that user exists
        await User.findOne({ 
            login: login 
        }).then(async (user) => {
            if (!user) {
                 // creating a new user
                const newUser = new User({
                    uid: uid,
                    login: login,
                    password: await bcrypt.hash(password, 10)
                });
                // saving user to database 
                newUser.save().then(user => {
                    return res.status(201).json({
                        success: true,
                        message: "User has been created",
                        url: "/client/components/login/login.html"
                        }).end();
                }).catch((err) => res.json({
                    success: false,
                    message: `Catch-Save error: ${err}`,
                    url: "/client/components/register/register.html"
                }));
            } else {
                return res.status(400).json({
                    success: false,
                    message: "That User already exists",
                    url: "/client/components/register/register.html"
                }); 
            }
        })
        .catch((err) => res.json({
            message: `Catch-FindOne error: ${err}`
        }));
    };


    async login(req: Request, res: Response) {
        //declaring body
        let { login, password } = req.body;
        
        //checking that User exists
        await User.findOne({ login })
        .then((user) => {
            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: `User ${req.body.login} does not exists`
                })
            } else {
                bcrypt
                    .compare(password, user.password)
                    .then(compareResult => {
                        if (compareResult) {
                            return res.status(201).json({
                                success: true,
                                message: "You are logged in !",
                                url: "/client/home.html"
                            }).end();
                        } else {
                            return res.status(401).json({
                                success: false,
                                message: "Password do not match",
                                url: "/client/components/login/login.html"
                            })
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        return res.status(400).json({
                            succes: false,
                            message: `Error: ${err}`,
                            url: "/client/components/login/login.html"
                        })
                    })
            }
        })
        .catch(err => {
            return res.status(401).json({
                success: false,
                message: `Error: ${err}`
            })
        });
    };


    logout(req: Request, res: Response) {
        
    }


    
};


export default AuthController;
import { Request, Response } from 'express';
import User from '../models/user';


class UserController {

    constructor() {

    }

    async getUser(req: Request, res: Response) {

        // checking if User is logged in
        if (!req.session.isLoggedIn) {
            return res.json({
                url: "http://localhost:5000/"
            });
        };

        // finding current User using param from the url
        await User.find()
            .then((users) => {
                let user = users.find((item) => { return item.uid == +req.params.id });
                if (!user) {
                    return res.status(404).json({
                        succes: false,
                        url: "http://localhost:5000/404"
                    });
                }

                return res.status(200).json({
                    success: true,
                    uid: user.uid,
                    login: user.login,
                    isLoggedIn: req.session.isLoggedIn
                });
            })
            .catch((err) => {
                return res.status(400).json({
                    succes: false,
                    message: `Error: ${err}`
                })
            });
    }
};


export default UserController;
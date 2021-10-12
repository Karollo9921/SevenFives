import { Request, Response } from 'express';
import User from '../models/user';
import url from '../config/url';


class UserController {

    constructor() {

    }

    async getUser(req: Request, res: Response) {

        // checking if User is logged in
        if (!req.session.isLoggedIn) {
            return res.json({
                url: url.url
            });
        };

        // finding current User using param from the url
        await User.find()
            .then((users) => {
                let user = users.find((item) => { return item.uid == +req.params.id });
                if (!user) {
                    return res.status(404).json({
                        succes: false,
                        isLoggedIn: req.session.isLoggedIn,
                        url: url.url + "/404"
                    });
                }

                return res.status(200).json({
                    success: true,
                    uid: user.uid,
                    login: user.login,
                    isLoggedIn: req.session.isLoggedIn,
                    user: req.session.user
                });
            })
            .catch((err) => {
                return res.status(400).json({
                    succes: false,
                    isLoggedIn: req.session.isLoggedIn,
                    message: `Error: ${err}`
                })
            });
    }
};


export default UserController;
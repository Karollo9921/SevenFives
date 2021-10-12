import { Request, Response } from 'express';


class HomeController {

    constructor() {

    }

    getHome(req: Request, res: Response) {
        res.json({ isLoggedIn: req.session.isLoggedIn, user: req.session.user })
    }

};


export default HomeController;
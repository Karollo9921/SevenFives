import { Request, Response } from 'express';


class HomeController {

    constructor() {

    }

    getHome(req: Request, res: Response) {
        console.log(req.session);   
        res.json({ isLoggedId: req.session.isLoggedIn, user: req.session.user })
    }

};


export default HomeController;
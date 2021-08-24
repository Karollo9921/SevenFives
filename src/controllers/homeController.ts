import { Request, Response } from 'express';


class HomeController {

    constructor() {

    }

    getHome(req: Request, res: Response) {
        console.log(req.sessionID);   
        res.json({ isLoggedIn: req.session.isLoggedIn, user: req.session.user })
        // res.json({ value1: "home11", value2: "home21" })
    }

};


export default HomeController;
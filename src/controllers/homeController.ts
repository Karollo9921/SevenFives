import { Request, Response } from 'express';


class HomeController {

    constructor() {

    }

    getHome(req: Request, res: Response) {
        // res.send('<h1>Hello!</h1>')
        res.json({ value1: "home11", value2: "home21" })
    }

};


export default HomeController;
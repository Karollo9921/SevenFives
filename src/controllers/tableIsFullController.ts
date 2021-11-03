import { Request, Response } from 'express';


class TableIsFullController {

    constructor() {

    }

    getTableIsFull(req: Request, res: Response) {
        res.json({ isLoggedIn: req.session.isLoggedIn, user: req.session.user })
    }

};


export default TableIsFullController;
import App from './app';
import express from 'express';
import cors from 'cors';
import session from 'express-session';

import HomeRoute from '../src/routes/homeRoute';
import AuthRoute from '../src/routes/authRoute';



const app = new App({
    port: 3000,
    middlewares: [
        express.json({ type: "application/json" }),
        express.urlencoded({ extended: true }),
        cors(),
        session({ secret: 'my secret', resave: false, saveUninitialized: false }),
    ],
    routes: [
        new HomeRoute('/'),
        new AuthRoute('/')
    ]
});


app.listen();


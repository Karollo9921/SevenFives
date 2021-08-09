import App from './app';
import express from 'express';
import cors from 'cors';

import HomeRoute from '../src/routes/homeRoute';
import AuthRoute from '../src/routes/authRoute';



const app = new App({
    port: 3000,
    middlewares: [
        express.json({
            type: "*/*"
        }),
        express.urlencoded({ extended: true }),
        cors(),
    ],
    routes: [
        new HomeRoute('/'),
        new AuthRoute('/')
    ]
});


app.listen();


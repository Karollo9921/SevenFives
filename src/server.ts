import HomeRoute from '../src/routes/homeRoute';
import AuthRoute from '../src/routes/authRoute';

import App from './app';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import { store } from './config/db';
import cookieParser from 'cookie-parser';
import SessionData from './interfaces/userSession';


const app = new App({
    port: 3000,
    middlewares: [
        cors(
            { 
                origin: "http://localhost:5000",
                methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
                credentials: true 
            }
        ),
        cookieParser(),
        session(
            { 
                secret: 'my secret', 
                resave: true,
                saveUninitialized: false,
                store: store,
            }),
        express.json({ type: "application/json" }),
        express.urlencoded({ extended: true }),
    ],
    routes: [
        new HomeRoute('/'),
        new AuthRoute('/')
    ]
});


app.listen();


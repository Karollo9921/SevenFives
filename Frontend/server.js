const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require("path");

const app = express();

app.use("/static", express.static(path.resolve(__dirname, "client", "static")));
app.use(cors({ origin: "http://127.0.0.1:3000", credentials: true }));
app.use(session({
    secret: 'my secret', 
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 10,
        secure: false
      }
}));

app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "index.html"))
});

app.listen(process.env.PORT || 5000, () => {
    console.log('Client server is running on PORT 5000');
});
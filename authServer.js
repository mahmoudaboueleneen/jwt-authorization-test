// This server is responsible for handling JWT create, delete
// and refresh.

require('dotenv').config();
const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();
app.use(express.json());

// Should be stored in a DB or cache, but for
// simplicity's sake, it's stored here.
let refreshTokens = [];

app.post('/token', (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401);
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        const accessToken = generateAccessToken(
            {
                username: user.username,
                scopes: user.scopes,
                otherStuff: user.otherStuff,
            }
        );
        res.json({ accessToken: accessToken });
    });
});


app.post("/login", (req, res) => {

    // authenticate user credentials against DB here...

    const username = req.body.username
    const user = {
        username: username,
        scopes: "",
        otherStuff: "",
    }
    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(refreshToken);

    res.json({ accessToken: accessToken, refreshToken: refreshToken });
});


app.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token);
    res.sendStatus(204);
});


function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m'});
}


app.listen(4000);
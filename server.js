require('dotenv').config();
const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();
app.use(express.json());


const posts = [
    {username: "Mahmoud", title: "Post 1"}, {username: "Mohammed", title: "Post 2"}
];


app.get("/posts", authenticateToken, (req, res) => {
    res.json(
        posts.filter(post => post.username === req.user.username)
    );
})


function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];    // Format of auth header: Bearer TOKEN
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

app.listen(3000);
require('dotenv').config();

const express = require('express');
const app = express();

const jwt = require('jsonwebtoken');
app.use(express.json());


const posts = [
    {
        username: "Mahmoud",
        title: "Post 1"
    },
    {
        username: "Mohammed",
        title: "Post 2"
    }
]


app.get("/posts", authenticateToken, (req, res) => {
    res.json(
        posts.filter(post => post.username === req.user.name)
    );
});


app.post("/login", (req, res) => {
   // TODO: Authenticate user

    const username = req.body.username
    const user = { name: username }

    // User object is serialized into the access token
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    res.json({ accessToken: accessToken });
});

function authenticateToken(req, res, next) {
    // Bearer TOKEN
    //  [0]    [1]

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split[' '][1];

    if (token == null)
        res.sendStatus(401);

    // User object is deserialized from the access token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err)
            return res.sendStatus(403);
        req.user = user;
        next();
    } )
}

app.listen(3000);
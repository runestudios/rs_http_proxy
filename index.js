const express = require('express')
const morgan = require("morgan")
const rateLimit = require("express-rate-limit")
const { createProxyMiddleware } = require('http-proxy-middleware')
const key = require("./conf/apikey.json")

const app = new express();

const PORT = 4000
const HOST = "localhost"
const API_SERVICE_URL = key.key

const limiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 10,
    message: "To many request retry in 5 minuteds."
})


app.use(morgan('dev'))

app.use(limiter)

app.get("/info", (req, res, next) => {
    res.send("This is the runestudios api Proxy for our official Website")
})


app.use('', (req, res, next) => {
    next()
    /*   if (req.headers.authorization) {
        next()
    } else {
        res.sendStatus(403)
    }*/
})

app.use('/wh_dc', createProxyMiddleware({
    target: API_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        [`^/wh_dc`]: '',
    },
}));

app.listen(PORT, HOST, () => {
    console.log(`Starting Proxy at ${HOST}:${PORT}`);
});
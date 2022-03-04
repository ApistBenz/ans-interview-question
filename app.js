const express = require('express')
const router = require('./router/myRouter')
const dotenv = require('dotenv').config()

const app = express()


app.use(express.json());
app.use(express.urlencoded({extended :false}))
app.use(router);

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log("connect port"+PORT);
});
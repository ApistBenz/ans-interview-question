const mongoose = require('mongoose')
const { Decimal128 } = require("bson")
const dotenv = require('dotenv').config()

mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.DB_NAME,
    user: process.env.DB_USERNAME,
    pass: process.env.DB_PASSWORD,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true
})
    .then(() => console.log("MongoDB connected..."))
    .catch((err) => console.log("Connect MongoDB fail", err));

// Date format ISO Datetime
let myDateTime = new Date();
myDateTime.setTime(myDateTime.getTime() - myDateTime.getTimezoneOffset() * 60 * 1000);




// Schema bet
const betSchema = mongoose.Schema({
    playerUsername: {
        type: String,
        require: true,
    },
    betId: {
        type: String,
        require: true,
        unique: true,
    },
    betAmount: {
        type: Decimal128,
        require: true,
    },

    status: {
        type: String,
        default: "RUNNING"
    },

    winLoseAmount: {
        type: Decimal128,
        require: true,
    },

    gameDate: {
        type: Date,
        default: myDateTime
    },

    settledDate: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: myDateTime
    }
});

const Bet = mongoose.model("bettransactions", betSchema)


// Schema player
const playerSchema = mongoose.Schema({
    playerUsername: {
        type: String,
        require: true,
        unique: true,
    },
    balance: {
        type: Decimal128,
        require: true,
    }
});
const Player = mongoose.model("members", playerSchema)

module.exports = { Bet, Player, myDateTime }

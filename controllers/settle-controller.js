const { model } = require('mongoose')
const { Bet, Player, myDateTime } = require('../database')
const settle  = (req,res,getBettran) =>{
    const data = req.body
    const playerUsername = data.playerUsername
    const betId = data.betId
    const prizeAmount = data.prizeAmount

    async function getBettran(betId, err) {
        const bettran = await Bet.findOne({ betId: betId })
        const player = await Player.findOne({ playerUsername: playerUsername })
        const user = player.playerUsername
        const balance = Number(player.balance)
        const bettranId = bettran.betId
        const betAmount = Number(bettran.betAmount)
        const status = bettran.status

        if (!bettranId && bettranId !== betId && bettranId === null) {
            res.status(404).send("Bet Id not found")
        }
        //calculation
        const sumPrizeAmount = Number(prizeAmount - betAmount).toFixed(2)
        const x = Number(sumPrizeAmount)
        const sumBalanceWin = Number(balance + x).toFixed(2)
        const sumBalanceDraw = Number(balance + betAmount).toFixed(2)

        if (status !== "DONE") {
            if (prizeAmount !== null && prizeAmount >= 0) {
                if (user === playerUsername) {

                    // bet Draw
                    if (prizeAmount === betAmount) {
                        await Bet.updateOne({ betId: betId },
                            {
                                $set: {
                                    winLoseAmount: 0,
                                    status: "DONE",
                                    settledDate: myDateTime
                                }
                            })
                        await Player.updateOne({ playerUsername: playerUsername },
                            {
                                $set: { balance: sumBalanceDraw }
                            })
                        res.status(200).send("response success = DRAW").end()
                        console.log(sumBalanceDraw)
                    }
                    //bet Win
                    if (sumPrizeAmount > 0) {
                        await Bet.updateOne({ betId: betId },
                            {
                                $set: {
                                    winLoseAmount: sumPrizeAmount,
                                    status: "DONE",
                                    settledDate: myDateTime
                                }
                            })
                        await Player.updateOne({ playerUsername: playerUsername },
                            {
                                $set: { balance: sumBalanceWin }
                            })
                        res.status(200).send("response success = WIN").end()
                        console.log(sumBalanceWin)
                    }
                    //bet Lose
                    if (prizeAmount === 0) {
                        await Bet.updateOne({ betId: betId },
                            {
                                $set: { status: "DONE" },
                                settledDate: myDateTime
                            })

                        res.status(200).send("response success = LOSE").end()
                    }

                } else {
                    res.send(player + " not found").end
                }

            } else {
                res.send(err).end()
            }
        }else{
            res.send(betId + " calculated.").end()
        }
    }
    getBettran(betId)
}
module.exports.settle = settle
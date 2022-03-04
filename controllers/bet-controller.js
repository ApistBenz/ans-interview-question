const { Bet, Player, myDateTime } = require('../database')

const bet  = (req,res,getPlayer) =>{
    const data = req.body
    const playerUsername = data.playerUsername
    const betId = data.betId

    async function getPlayer(playerUsername, err) {
        const player = await Player.findOne({ playerUsername: playerUsername })
        const betAmount = data.betAmount
        const bettransactions = await Bet.findOne({ betId: betId })
        console.log(player)
        if (!player && player !== playerUsername) {
            res.status(404).send("Player not found")
        } else {
            let balance = Number(player.balance)

            if (balance > 0 && balance >= betAmount && betAmount > 0) {
                balance = balance - betAmount
                let winLoseAmount = betAmount - (betAmount * 2)

                if (winLoseAmount < 0) {
                    await Player.updateOne({ playerUsername: playerUsername },
                        {
                            $set: { balance: balance }
                        })
                    // Bet data
                    if (!bettransactions || bettransactions.betId !== betId) {
                        const bettran = new Bet({
                            playerUsername: data.playerUsername,
                            betId: data.betId,
                            betAmount: data.betAmount,
                            winLoseAmount: winLoseAmount

                        })
                        console.log(bettran)
                        await bettran.save()
                        res.status(201).send("Saving bettransaction").end()
                    } else {
                        res.status(404).send("BetId duplicate").end()
                    }
                }
            } res.send(err)
        }
    }
    getPlayer(playerUsername)
}
module.exports.bet = bet
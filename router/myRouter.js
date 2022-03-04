const express = require('express');
const router = express.Router()
const betController = require('../controllers/bet-controller')
const settleController = require('../controllers/settle-controller')

router.post("/bet",betController.bet)
router.post("/settle", settleController.settle)

module.exports = router;
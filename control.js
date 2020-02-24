const fs = require('fs');
const request = require('request')
const readline = require('readline')
const chalk = require('chalk')
const Excel = require('exceljs')

const router = require('./router')
const userInterface = require('./user-interface')(readline, chalk)
const parser = require('./parser')(fs, chalk, Excel)
const points = require('./points')()
const utils = require('./utils')()
const clashApi = require('./clash-api')(request, utils, points)
const services = require('./services')(clashApi)
const webApi = require('./web-api')(services, parser, utils, chalk)

// ROUTES REGISTERS
router.register(1, "Leaderboard", webApi.getLeaderboard)
router.register(2, "Donations", webApi.getDonations)
router.register(3, "Trophies", webApi.getTrophies)
router.register(4, "Win rates", webApi.getWinRate)
router.register(5, "Participations", webApi.getParticipations)
router.register(6, "Average of collected cards", webApi.getCollectedCards)

var handlers = router.handlers
userInterface.startUI(handlers)
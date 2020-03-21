const chalk = require('chalk') // this one stays because it's common to 3 modules

const router = require('./router')
const userInterface = require('./user-interface')(chalk)
const parser = require('./parser')(chalk)
const points = require('./points')()
const utils = require('./utils')()
const clashApi = require('./clash-api')(utils, points, parser)
const services = require('./services')(clashApi)
const webApi = require('./web-api')(services, parser, utils, chalk)

// Routing 
router.register(1, "Leaderboard", webApi.getLeaderboard)
router.register(2, "Donations", webApi.getDonations)
router.register(3, "Trophies", webApi.getTrophies)
router.register(4, "Win rates", webApi.getWinRate)
router.register(5, "Participations", webApi.getParticipations)
router.register(6, "Average of collected cards", webApi.getCollectedCards)
router.register(7, "Missed collections or wars", webApi.getMissedCollectionsOrWars)
router.register(8, "Add a point to players that won the last war", webApi.addPointForWinningWar)

var handlers = router.handlers
userInterface.startUI(handlers)
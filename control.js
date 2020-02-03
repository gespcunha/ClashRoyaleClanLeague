const fs = require('fs')
const { exec } = require('child_process');
const request = require('request')
const parser = require('./parser')(fs, './csv')
const points = require('./points')()
const utils = require('./utils')()
const clashApi = require('./clash-api')(request, utils, points)
const services = require('./services')(clashApi)
const webApi = require('./web-api')(services, parser, utils, exec)

// ROUTING
var handlers = {}
function register(criteria, handler) {
    handlers[criteria] = handler;
}

// ROUTES REGISTERS
register("leaderboard", webApi.getLeaderboard)
register("donations", webApi.getDonations)
register("trophies", webApi.getTrophies)
register("win_rates", webApi.getWinRate)
register("participations", webApi.getParticipations)
register("collected_cards", webApi.getCollectedCards)

var criteria = process.argv[2]
var readWrite = process.argv[3]

if (!checkUserInput())
    return

handlers[criteria](readWrite)

function checkUserInput() {
    
    if (!handlers[criteria]) {
        console.log("Command doesn't exist.")
        return false 
    }
    
    if (!readWrite) {
        console.log("Specify if you want to read or write.")
        return false
    }

    if  (readWrite != "read" && readWrite != "write") {
        console.log("Read / Write parameter not recognized.")
        return false
    }

    return true
}
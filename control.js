const fs = require('fs');
const request = require('request')
const utils = require('./utils')()
const parser = require('./parser')(fs)
const api = require('./clash-web-api')(utils, parser, request)

// ROUTING
var handlers = {}
function register(criteria, handler) {
    handlers[criteria] = handler;
}

// ROUTES REGISTERS
register("leaderboard", api.leaderboard)
register("win_rates", api.getWarsWinRate)
register("last_wars", api.getLastWarsParticipations)
register("donations", api.getDonations)
register("collected_cards", api.getCollectedCards)

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

    return true
}
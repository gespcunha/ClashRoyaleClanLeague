const fs = require('fs');
const utils = require('./utils')
const parser = require('./parser')(fs)
const api = require('./clash-requests')(utils, parser)

// ROUTING
var handlers = {}
function register(criteria, handler) {
    handlers[criteria] = handler;
}

// ROUTES REGISTERS
register("leaderboard", api.leaderboard)
register("last_wars", api.getLastWars)
register("donations", api.getDonations)
register("collected_cards", api.getCollectedCards)

var criteria = process.argv[2]

// values 
var readWrite = process.argv[3]

if (!handlers[criteria]) {
    console.log("Command doesn't exist.")
    return
}

if (!readWrite) {
    console.log("Specify if you want to read or write.")
    return 
}

handlers[criteria](readWrite)
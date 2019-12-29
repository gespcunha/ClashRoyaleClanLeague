const fs = require('fs');
const utils = require('./utils')()
const parser = require('./parser')(fs)
const api = require('./clash-web-api')(utils, parser)

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

var clanTag = process.argv[2]
var criteria = process.argv[3]
var readWrite = process.argv[4]

if (checkUserInput()) {
    utils.CLAN_TAG = clanTag
    handlers[criteria](readWrite)
}

function checkUserInput() {
    if (!clanTag) {
        console.log("Please insert the tag of a clan.")
        return false
    }

    api.checkClanExists(clanTag)
        .then()
        .catch((message) => {
            console.log(message) 
            return false
        })
    
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
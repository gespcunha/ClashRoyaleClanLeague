module.exports = function(request, utils, pointsConfig) {

    if (!request) 
        throw "Invalid request."

    if (!utils) 
        throw "Invalid utils."

    if (!pointsConfig)
        throw "Invalid points."
    
    return {
        getDonations: getDonations,
        getTrophies: getTrophies,
        getLeaderboard: getLeaderboard,
        getWinRate: getWinRate,
        getParticipations: getParticipations,
        getCollectedCards: getCollectedCards
    }

    // Number of wars played by each player in the last 10 wars
    function getParticipations() {
        return new Promise(function(resolve, reject) {
            var options = utils.options(utils.CLAN_LAST_WARS_URL)

            request.get(options, (err, res, body) => {
                if (err != null) {  
                    reject("Error - Something went wrong.")
                    return
                }
                fillParticipantsTimes(body.items).then(result => resolve(result))
            })

            // data = Array of arrays representing each war
            // Each war contains an array of participants
            function fillParticipantsTimes(items) {
                var wars = []
                var participantsTimes = []
                items.forEach(war => {
                    var participants = []
                    war.participants.forEach(participant => {
                        var name = participant.name
                        participants.push({"name": name})
                        if (participantsTimes[name]) 
                            participantsTimes[name] += 1
                        else
                            participantsTimes[name] = 1
                    })
                    wars.push(participants)
                })
                
                var final = []
                for (const [name, wars] of Object.entries(participantsTimes)) {
                    var points =  pointsConfig.getPoints("participations", wars)

                    final.push({
                        "name": name, 
                        "wars": wars,
                        "points": points
                    })
                }
                final.sort(function(a, b){return b.wars - a.wars});
                return removeNotInClan(final)
            }
        })
    }

    // Collected cards by each player over the last 10 wars
    function getCollectedCards() {
        return new Promise(function(resolve, reject) {
            const options = utils.options(utils.CLAN_LAST_WARS_URL)

            request.get(options, (err, res, body) => {
                if (err != null) {  
                    reject("Error - Something went wrong.")
                    return
                }
                fillParticipantsCollectedCards(body.items).then(result => resolve(result))
            })

            function fillParticipantsCollectedCards(items) {
                var result = []
                items.forEach(war => {
                    var participants = war.participants
                    for (var i = 0; i < participants.length; i++) {
                        var player = participants[i]
                        var found = false
                        for (var j = 0; j < result.length; j++) {
                            if (player.name == result[j].name) {
                                result[j].cardsEarned += player.cardsEarned
                                result[j].warsPlayed++
                                found = true
                                break
                            }
                        }
                        if (!found) {
                            result.push({
                                "name": player.name,
                                "cardsEarned": player.cardsEarned,
                                "warsPlayed": 1
                            })
                        }
                    }
                })
                var final = []
                result.forEach(player => {
                    
                    var cardsEarned = parseInt(player.cardsEarned / player.warsPlayed)
                    var points = pointsConfig.getPoints("cardsEarned", cardsEarned)

                    final.push({
                        "name": player.name, 
                        "warsPlayed": player.warsPlayed,
                        "cardsEarned": cardsEarned,
                        "points": points
                    })
                })
                final.sort(function(a, b){return b.cardsEarned - a.cardsEarned || b.warsPlayed - a.warsPlayed})
                return removeNotInClan(final)
            }
        })
    }

    // War win rate over the last 10 wars
    function getWinRate() {
        return new Promise(function(resolve, reject) {
            var options = utils.options(utils.CLAN_LAST_WARS_URL)
            request.get(options, (err, res, body) => {
                if (err != null) {  
                    reject("Error - Something went wrong.")
                    return
                }
                fillParticipantsWinRate(body.items).then(result => resolve(result))
            })

            // res = Array of arrays representing each war
            // Each war contains an array of participants
            function fillParticipantsWinRate(items) {
                var result = []
                items.forEach(war => {
                    var participants = war.participants
                    for (var i = 0; i < participants.length; i++) {
                        var player = participants[i]
                        var found = false
                        for (var j = 0; j < result.length; j++) {
                            if (player.name == result[j].name) {
                                result[j].numberOfBattles += player.numberOfBattles
                                result[j].wins += player.wins
                                found = true
                                break
                            }
                        }
                        if (!found) {
                            var playerInfo = {
                                "name": player.name,
                                "numberOfBattles": player.numberOfBattles,
                                "wins": player.wins
                            }
                            result.push(playerInfo)
                        }
                    }
                })
                
                var participantsWinRates = []
                result.forEach(player => {
                    
                    var winRate = Math.round(player.wins/ player.numberOfBattles * 100)

                    var points = pointsConfig.getPoints("win_rate", winRate)

                    participantsWinRates.push({
                        "name": player.name, 
                        "winRate": winRate,
                        "points": points
                    })
                })
                participantsWinRates.sort(function(a, b){return b.winRate - a.winRate})
                return removeNotInClan(participantsWinRates)
            }
        })
    }

    // Initiates the leaderboard
    function getLeaderboard() {
        return new Promise(function(resolve, reject) {
            var options = utils.options(utils.CLAN_URL)
            var members = []

            request.get(options, (err, res, body) => {
                if (err != null) {
                    reject("Error - Something went wrong.")
                    return
                } 
                
                var i = 1
                body.memberList.forEach(member => {
                    members.push({
                        "rank": i++,
                        "name": member.name,
                        "points": 0,
                        "games": 0,
                        "wins": 0,
                        "draws": 0,
                        "losses": 0
                    })
                })
                    
                resolve(members)
            })
        })
    }

    // Trophies
    function getTrophies() {
        return new Promise(function(resolve, reject) {
            var options = utils.options(utils.CLAN_URL)

            var players = []

            request.get(options, (err, res, body) => {
                if (err != null) {
                    reject("Error - Something went wrong.")
                    return
                }

                res.body.memberList.forEach(member => {
                    player = {
                        "name": member.name,
                        "trophies": member.trophies
                    }
                    players.push(player)
                })

                players.sort(function(a, b){return b.trophies - a.trophies})

                for (let i = 0; i < players.length; i++) {
                    var points = pointsConfig.getPoints("trophies", i) 
                    players[i]["points"] = points
                }

                removeNotInClan(players).then(result => resolve(result))
            })
        })
    }

    // Each player donations during the season
    function getDonations() {
        return new Promise(function(resolve, reject) {
            const options = utils.options(utils.CLAN_URL)
            var players = []
            
            request.get(options, (err, res, body) => {
                if (err != null) {
                    reject("Error - Something went wrong.")
                    return
                }    

                res.body.memberList.forEach(member => {
                    player = {
                        "name": member.name,
                        "donations": member.donations                    
                    }
                    players.push(player)
                })

                players.sort(function(a, b){return b.donations - a.donations});
                for (let i = 0; i < players.length; i++) {
                    var points = pointsConfig.getPoints("donations", i) 
                    players[i]["points"] = points
                }
                
                removeNotInClan(players).then(result => resolve(result))  
            });
        })
    }

    // removes players that aren't in the clan
    function removeNotInClan(allPlayers) {
        return new Promise(function(resolve, reject) {
            var options = utils.options(utils.CLAN_URL)
            var inClan = []

            request.get(options, (err, res, body) => {
                if (err != null) {
                    console.log(err)
                    return
                } 

                res.body.memberList.forEach(member => {
                    inClan.push({
                        "name": member.name
                    })
                })
                
                for (var i = allPlayers.length-1; i >= 0; i--) {
                    var found = false
                    for (var j = 0; j < inClan.length; j++) {
                        if (allPlayers[i].name == inClan[j].name) {
                            found = true
                            break
                        }            
                    }
                    if (!found)
                        allPlayers.splice(i,1)
                }

                resolve(allPlayers)
            })
        })        
    }
}
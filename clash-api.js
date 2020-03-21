module.exports = function(utils, pointsConfig, parser) {

    const request = require('request')
    
    return {
        getDonations: getDonations,
        getTrophies: getTrophies,
        getLeaderboard: getLeaderboard,
        getWinRate: getWinRate,
        getParticipations: getParticipations,
        getCollectedCards: getCollectedCards,
        getMissedCollectionsOrWars: getMissedCollectionsOrWars,
        addPointForWinningWar: addPointForWinningWar
    }

    // Number of wars played by each player in the last 10 wars
    async function getParticipations() {
        var competingPlayers = await leaderboardPlayers()
        
        return new Promise(function(resolve, reject) {
            var options = utils.requestOptions(utils.CLAN_LAST_WARS_URL)

            request.get(options, (err, res, body) => {
                if (err != null) {  
                    reject("Error - Something went wrong.")
                    return
                }
                
                fillParticipantsTimes(body.items).then(result => resolve(result))
            })
            function fillParticipantsTimes(items) {
                var wars = []
                var participantsTimes = []
                items.forEach(war => {
                    var participants = []
                    war.participants.forEach(participant => {
                        var name = participant.name
                        if (!competingPlayers.includes(name)) 
                            return // skips the iteration
                        
                        participants.push({"name": name})
                        let elem = participantsTimes.find(e => e.name === name )
                        if (elem) 
                            elem.wars += 1
                        else
                            participantsTimes.push({name: name, wars: 1})
                    })
                    wars.push(participants)
                })
                return utils.removeNotInClan(participantsTimes).then(function(participantsTimes) {
                    return new Promise(function(resolve, reject) {
                        var final = []
                        participantsTimes.forEach(participant => {
                            var points =  pointsConfig.getPoints("participations", participant.wars)

                            final.push({
                                "name": participant.name, 
                                "wars": participant.wars,
                                "points": points
                            })
                        })
                        final.sort(function(a, b){return b.wars - a.wars})
                        resolve(final)
                    })
                })
            }
        })
    }

    // Collected cards by each player over the last 10 wars
    async function getCollectedCards() {
        var competingPlayers = await leaderboardPlayers()

        return new Promise(function(resolve, reject) {
            const options = utils.requestOptions(utils.CLAN_LAST_WARS_URL)

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
                
                return utils.removeNotInClan(result).then(function(result) {
                    return new Promise(function(resolve, reject) {

                        var final = []
                        
                        result.forEach(player => {
                            if (!competingPlayers.includes(player.name))
                                return
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
                        resolve(final)
                    })
                })
            }
        })
    }

    // Initiates the leaderboard
    function getLeaderboard() {
        return new Promise(function(resolve, reject) {
            var options = utils.requestOptions(utils.CLAN_URL)
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
    async function getTrophies() {
        var competingPlayers = await leaderboardPlayers()

        return new Promise(function(resolve, reject) {
            var options = utils.requestOptions(utils.CLAN_URL)

            var players = []

            request.get(options, (err, res, body) => {
                if (err != null) {
                    reject("Error - Something went wrong.")
                    return
                }

                res.body.memberList.forEach(member => {
                    if (!competingPlayers.includes(member.name))
                        return
                    player = {
                        "name": member.name,
                        "trophies": member.trophies
                    }
                    players.push(player)
                })

                players.sort(function(a, b){return b.trophies - a.trophies})

                utils.removeNotInClan(players)
                    .then(function(result) {
                        
                        var threePoints = players.length / 3 
                        var onePoint = (players.length / 3) * 2

                        for (let i = 0; i < players.length; i++) {
                            var points = pointsConfig.getPoints("trophies", i, threePoints, onePoint) 
                            players[i]["points"] = points
                        }
                        resolve(result)
                    }
                )      
            })
        })
    }

    // Each player's donations during the season
    async function getDonations() {
        var competingPlayers = await leaderboardPlayers()
        
        return new Promise(function(resolve, reject) {
            const options = utils.requestOptions(utils.CLAN_URL)
            var players = []
            
            request.get(options, (err, res, body) => {
                if (err != null) {
                    reject("Error - Something went wrong.")
                    return
                }    

                res.body.memberList.forEach(member => {
                    if (!competingPlayers.includes(member.name))
                        return
                    player = {
                        "name": member.name,
                        "donations": member.donations                    
                    }
                    players.push(player)
                })

                players.sort(function(a, b){return b.donations - a.donations})

                utils.removeNotInClan(players)
                    .then(function(result) {
                        var threePoints = players.length / 3 
                        var onePoint = (players.length / 3) * 2

                        for (let i = 0; i < players.length; i++) {
                            var points = pointsConfig.getPoints("donations", i, threePoints, onePoint) 
                            players[i]["points"] = points
                        }
                        resolve(result)
                    }
                )                  
            })
        })
    }

    // Adds 1 point to players that won the last war
    async function addPointForWinningWar() {
        var competingPlayers = await leaderboardPlayers()

        return new Promise(function(resolve, reject) {
            const options = utils.requestOptions(utils.CLAN_LAST_WARS_URL)
            var players = []
            
            request.get(options, (err, res, body) => {
                if (err != null) {
                    reject("Error - Something went wrong.")
                    return
                }       

                body.items[0].participants.forEach(member => {
                    if (!competingPlayers.includes(member.name))
                        return
                    player = {
                        "name": member.name,
                        "won": (member.wins >= 1) ? "Yes" : "No",
                        "points": pointsConfig.getPoints("winningWar", member.wins)     
                    }
                    players.push(player)
                })

                players.sort(function(a, b){return b.points - a.points}) 
                
                resolve(players)  
            })
        }) 
    }

    // War win rate over the last 10 wars
    async function getWinRate() {
        var competingPlayers = await leaderboardPlayers()

        return new Promise(function(resolve, reject) {
            var options = utils.requestOptions(utils.CLAN_LAST_WARS_URL)
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
                
                return utils.removeNotInClan(result).then(function(result) {
                    return new Promise(function(resolve, reject) {
                        var participantsWinRates = []
                        result.forEach(player => {
                            if (!competingPlayers.includes(player.name))
                                return
                            var winRate = Math.round(player.wins/ player.numberOfBattles * 100)

                            var points = pointsConfig.getPoints("win_rate", winRate)

                            participantsWinRates.push({
                                "name": player.name, 
                                "winRate": winRate,
                                "points": points
                            })
                        })
                        participantsWinRates.sort(function(a, b){return b.points - a.points || b.winRate - a.winRate})
                        resolve(participantsWinRates)
                    })
                })
            }
        })
    }

    // Each player's number of missed collection day battles or war day battle
    // over the last 10 wars
    async function getMissedCollectionsOrWars() {
        var competingPlayers = await leaderboardPlayers()
        
        return new Promise(function(resolve, reject) {
            const options = utils.requestOptions(utils.CLAN_LAST_WARS_URL)

            request.get(options, (err, res, body) => {
                if (err != null) {  
                    reject("Error - Something went wrong.")
                    return
                }
                fillParticipantsMissedCollectionsOrWars(body.items).then(result => resolve(result))
            })

            // res = Array of arrays representing each war
            // Each war contains an array of participants
            function fillParticipantsMissedCollectionsOrWars(items) {
                var players = []
                items.forEach(war => {
                    var participants = war.participants
                    for (var i = 0; i < participants.length; i++) {
                        var player = participants[i]
                        var found = false
                        for (var j = 0; j < players.length; j++) {
                            if (player.name == players[j].name) {
                                players[j].missedCollections += (3 - player.collectionDayBattlesPlayed)
                                players[j].missedBattles += (player.numberOfBattles - player.battlesPlayed)
                                players[j].total = players[j].missedCollections + players[j].missedBattles
                                found = true
                                break
                            }
                        }
                        if (!found) {
                            var missedCollections = 3 - player.collectionDayBattlesPlayed
                            var missedBattles = player.numberOfBattles - player.battlesPlayed
                            var playerInfo = {
                                "name": player.name,
                                "missedCollections": missedCollections,
                                "missedBattles": missedBattles,
                                "total": missedCollections + missedBattles
                            }
                            if (competingPlayers.includes(playerInfo.name))
                                players.push(playerInfo)
                        }
                    }
                })

                for (let i = 0; i < players.length; i++) {
                    var points = pointsConfig.getPoints("missedBattles", players[i].total) 
                    players[i]["points"] = points
                }
                players.sort(function(a, b){return b.points - a.points || a.total - b.total})

                return utils.removeNotInClan(players)   
            }
        })
    }

    function leaderboardPlayers() {
        return new Promise(function(resolve, reject) {
            parser.readFile(utils.CLAN_TAG + "Leaderboard.xlsx", function (data) {
                var result = data.map(ele => ele.name) // string array
                resolve(result)
            })   
        })
    }
}
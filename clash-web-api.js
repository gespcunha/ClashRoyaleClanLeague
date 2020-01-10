/** 
 * Wars win rate - 10 wars
 * Donations - Current season
 * Number of wars played - 10 wars
 * Collected cards - 10 wars
 */

module.exports = function(utils, parser, request) {

    if (!utils)
        throw "Invalid utils."

    if (!parser)
        throw "Invalid parser."

    // 3 points consts
    const MAX_WIN_RATE = 65
    const MAX_LAST_WARS_PARTICIPATIONS = 10
    const MAX_DONATIONS_RANKING = 12
    const MAX_COLLECTED_CARDS = 2100

    // 1 point consts
    const MEDIUM_WIN_RATE = 45
    const MEDIUM_LAST_WARS_PARTICIPATIONS = 7
    const MEDIUM_DONATIONS_RANKING = 24
    const MEDIUM_COLLECTED_CARDS = 1900

    return {
        leaderboard: leaderboard,
        getWarsWinRate: getWarsWinRate,
        getLastWarsParticipations: getLastWarsParticipations,
        getDonations: getDonations,
        getCollectedCards: getCollectedCards
    }

    // Initiates the leaderboard
    function leaderboard(readWrite) {
        if (readWrite == "read") {
            showLeaderboard()
            return
        }
        var options = utils.options(utils.CLAN_URL)
        var members = []

        request.get(options, (err, res, body) => {
            if (err != null) {
                console.log(err)
                return
            } 

            var i = 1
            res.body.members.forEach(member => {
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
                
            var data = parser.arrayToCsv(members, "RANKING,NAME,POINTS,GAMES,WINS,DRAWS,LOSSES\n")
            parser.createFile(data, utils.CLAN_TAG + "Leaderboard.csv") 
        });
    }

    // Leaderboard
    function showLeaderboard() {
        parser.readFile(utils.CLAN_TAG + "Leaderboard.csv", function (data) {
            leaderboard = parser.csvToArray(data.toString().split("\n"))
            console.table(leaderboard)
        })
    }

    // War win rate over the last 10 wars
    function getWarsWinRate(readWrite) {

        var options = utils.options(utils.CLAN_LAST_WARS_URL)

        request.get(options, (err, res, body) => {
            if (err != null) {  
                console.log(err)
                return
            }
            fillParticipantsWinRate(res).then(function(result) {
                if (readWrite == "write")
                    updateLeaderboardFile(result)
                else 
                    console.table(result)
            })
        });

        // res = Array of arrays representing each war
        // Each war contains an array of participants
        function fillParticipantsWinRate(res) {
            var result = []
            res.body.forEach(war => {
                var participants = war.participants
                for (var i = 0; i < participants.length; i++) {
                    var player = participants[i]
                    var found = false
                    for (var j = 0; j < result.length; j++) {
                        if (player.name == result[j].name) {
                            result[j].battleCount += player.battleCount
                            result[j].wins += player.wins
                            found = true
                            break
                        }
                    }
                    if (!found) {
                        var playerInfo = {
                            "name": player.name,
                            "battleCount": player.battleCount,
                            "wins": player.wins
                        }
                        result.push(playerInfo)
                    }
                }
            })
            
            var participantsWinRates = []
            result.forEach(player => {
                
                var winRate = parseInt(((player.wins / player.battleCount) * 100).toFixed(1))

                var points = getPoints("win_rate", winRate)

                participantsWinRates.push({
                    "name": player.name, 
                    "winRate": winRate,
                    "points": points
                })
            })
            participantsWinRates.sort(function(a, b){return b.winRate - a.winRate});
            return removeNotInClan(participantsWinRates)
        }
    }

    // Number of wars played by each player in the last 10 wars
    function getLastWarsParticipations(readWrite) {
        var options = utils.options(utils.CLAN_LAST_WARS_URL)

        request.get(options, (err, res, body) => {
            if (err != null) {  
                console.log(err)
                return
            }
            fillParticipantsTimes(res).then(function(result) {
                if (readWrite == "write")
                    updateLeaderboardFile(result)
                else 
                    console.table(result)
            })   
        });

        // data = Array of arrays representing each war
        // Each war contains an array of participants
        function fillParticipantsTimes(data) {
            var wars = []
            var participantsTimes = []
            data.body.forEach(war => {
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
                var points =  getPoints("participations", wars)

                final.push({
                    "name": name, 
                    "wars": wars,
                    "points": points
                })
            }
            final.sort(function(a, b){return b.wars - a.wars});
            return removeNotInClan(final)
        }
    }
    
    // Each player donations during the season
    function getDonations(readWrite) {
        const options = utils.options(utils.CLAN_URL)
        var players = []

        request.get(options, (err, res, body) => {
            if (err != null) {
                console.log(err)
                return
            }    
            
            res.body.members.forEach(member => {
                player = {
                    "name": member.name,
                    "donations": member.donations                    
                }
                players.push(player)
            })
            players.sort(function(a, b){return b.donations - a.donations});
            for (let i = 0; i < players.length; i++) {
                var points = getPoints("donations", i)
                
                players[i]["points"] = points
            }
            
            removeNotInClan(players).then(function(result) {
                if (readWrite == "write")
                    updateLeaderboardFile(result)
                else 
                    console.table(result)
            })  
        });
    }

    // Collected cards by each player over the last 10 wars
    function getCollectedCards(readWrite) {

        const options = utils.options(utils.CLAN_LAST_WARS_URL)

        request.get(options, (err, res, body) => {
            if (err != null) {  
                console.log(err)
                return
            }
            fillParticipantsCollectedCards(res).then(function(result) {
                if (readWrite == "write")
                    updateLeaderboardFile(result)
                else 
                    console.table(result)
            })
        });

        function fillParticipantsCollectedCards(data) {
            var result = []
            data.body.forEach(war => {
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
                        var playerInfo = {
                            "name": player.name,
                            "cardsEarned": player.cardsEarned,
                            "warsPlayed": 1
                        }
                        result.push(playerInfo)
                    }
                }
            })
            var final = []
            result.forEach(player => {
                
                var cardsEarned = parseInt(player.cardsEarned / player.warsPlayed)
                var points = getPoints("cardsEarned", cardsEarned)

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

                res.body.members.forEach(member => {
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

    function updateLeaderboardFile(participantsTimes) {
        parser.readFile(utils.CLAN_TAG + "Leaderboard.csv", function (data) {
            leaderboard = parser.csvToArray(data.toString().split("\n"))
            updatedLeaderboard = updateMembersInfo(participantsTimes, leaderboard)
            updatedLeaderboard = parser.arrayToCsv(updatedLeaderboard, "RANKING,NAME,POINTS,GAMES,WINS,DRAWS,LOSSES\n")
            parser.createFile(updatedLeaderboard, utils.CLAN_TAG + "Leaderboard.csv")
        })
    }

    function updateMembersInfo(content, objToUpdate) {
        
        content.forEach(newData => {
            objToUpdate.forEach(member => {
                if (newData.name == member.name) {
                    member.points = parseInt(member.points)
                    member.points += newData.points
                    switch(newData.points) {
                        case 3: member.wins++; break
                        case 1: member.draws++; break
                        default: member.losses++; 
                    }
                    member.games = parseInt(member.wins) + parseInt(member.draws) + parseInt(member.losses)
                }
            })
        });
        // Sort by points
        objToUpdate.sort(function(a, b){return b.points - a.points || b.games - a.games})

        // Set the ranking in each player
        var i = 1
        objToUpdate.forEach(member => member.ranking = i++)
        return objToUpdate
    }

    function getPoints(criteria, value) {
        switch (criteria) {
            case "win_rate": switch (true) {
                case value >= MAX_WIN_RATE:    return 3
                case value >= MEDIUM_WIN_RATE: return 1
                default:                       return 0
            }
            case "participations": switch (true) {
                case value == MAX_LAST_WARS_PARTICIPATIONS:    return 3
                case value >= MEDIUM_LAST_WARS_PARTICIPATIONS: return 1
                default:                                       return 0
            } 
            case "donations": switch(true) {
                case value <= MAX_DONATIONS_RANKING:    return 3
                case value <= MEDIUM_DONATIONS_RANKING: return 1
                default:                                return 0
            }
            case "cardsEarned": switch (true) {
                case value >= MAX_COLLECTED_CARDS:    return 3
                case value >= MEDIUM_COLLECTED_CARDS: return 1
                default:                              return 0
            }
        }
    }
}
/**
 * To implement
 * 
 * Wars win rate
 * donations
 * Number of wars played in the last 10
 * Collected cards in the last war
 */

module.exports = function(utils, parser) {

    if (!utils)
        throw "Invalid utils."

    if (!parser)
        throw "Invalid parser."

    // 3 points consts
    const MAX_WIN_RATE = 65
    const MAX_LAST_WARS_PARTICIPATIONS = 10
    const MAX_DONATIONS_RANKING = 12 
    const MAX_COLLECTED_CARDS = 2000

    // 1 point consts
    const MEDIUM_WIN_RATE = 45
    const MEDIUM_LAST_WARS_PARTICIPATIONS = 7
    const MEDIUM_DONATIONS_RANKING = 24
    const MEDIUM_COLLECTED_CARDS = 1900

    return {
        checkClanExists: checkClanExists,
        leaderboard: leaderboard,
        getWarsWinRate: getWarsWinRate,
        getLastWarsParticipations: getLastWarsParticipations,
        getDonations: getDonations,
        getCollectedCards: getCollectedCards
    }

    // Checks if clan exists
    function checkClanExists() {
        return new Promise(function(resolve, reject) {
            var options = utils.options(utils.CLAN_URL)

            utils.request.get(options, (err, res, body) => {
                if (err != null)
                    reject("Please insert a valid clan tag.")
                resolve()
            });
        })
    }

    // Initiates the leaderboard
    function leaderboard(readWrite) {
        if (readWrite == "read") {
            showLeaderboard()
            return
        }
        else if (readWrite != "write") {
            console.log("This command doesn't have a definition for " + readWrite)
            return
        }
        var options = utils.options(utils.CLAN_URL)
        var members = []

        utils.request.get(options, (err, res, body) => {
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
            parser.createFile(data, "Leaderboard.csv") 
        });
    }

    // Leaderboard
    function showLeaderboard() {
        parser.readFile("Leaderboard.csv", function (data) {
            leaderboard = parser.csvToArray(data.toString().split("\n"))
            console.table(leaderboard)
        })
    }

    // War win rate over the last 10 wars
    function getWarsWinRate(readWrite) {
        var options = utils.options(utils.CLAN_LAST_WARS_URL)

        utils.request.get(options, (err, res, body) => {
            if (err != null) {  
                console.log(err)
                return
            }
            var participantsWinRates = fillParticipantsWinRate(res)
            if (readWrite == "write")
                updateLeaderboardFile(participantsWinRates)
            else if (readWrite == "read")
                console.table(participantsWinRates)    
            else 
                console.log("This command doesn't have a definition for " + readWrite)        
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
            return participantsWinRates
        }
    }

    // Number of wars played by each player in the last 10 wars
    function getLastWarsParticipations(readWrite) {
        var options = utils.options(utils.CLAN_LAST_WARS_URL)

        utils.request.get(options, (err, res, body) => {
            if (err != null) {  
                console.log(err)
                return
            }
            var participantsTimes = fillParticipantsTimes(res)
            if (readWrite == "write")
                updateLeaderboardFile(participantsTimes)
            else if (readWrite == "read")
                console.table(participantsTimes)    
            else 
                console.log("This command doesn't have a definition for " + readWrite)        
        });

        // res = Array of arrays representing each war
        // Each war contains an array of participants
        function fillParticipantsTimes(res) {
            var wars = []
            var participantsTimes = []
            res.body.forEach(war => {
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
            return final
        }
    }
    
    // Each player donations during the season
    function getDonations(readWrite) {
        const options = utils.options(utils.CLAN_URL)
        var players = []

        utils.request.get(options, (err, res, body) => {
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
            
            if (readWrite == "write")
                updateLeaderboardFile(players)
            else if (readWrite == "read")
                console.table(players)    
            else 
                console.log("This command doesn't have a definition for " + readWrite)      
        });
    }

    // Collected cards by each player in the last war
    function getCollectedCards(readWrite) {

        const options = utils.options(utils.CLAN_LAST_WAR_URL)
        var players = []

        utils.request.get(options, (err, res, body) => {
            if (err != null) { 
                console.log(err)
                return
            } 
            res.body.participants.forEach(member => {
                var cards = member.cardsEarned
                var points = getPoints("collected_cards", cards)

                player = {
                    "name": member.name,
                    "collectedCards": cards,
                    "points": points
                }
                players.push(player)
            })
            players.sort(function(a, b){return b.collectedCards - a.collectedCards});
            if (readWrite == "write")
                updateLeaderboardFile(players)
            else if (readWrite == "read")
                console.table(players)    
            else 
                console.log("This command doesn't have a definition for " + readWrite)
        });
    }

    function updateLeaderboardFile(participantsTimes) {
        parser.readFile("Leaderboard.csv", function (data) {
            leaderboard = parser.csvToArray(data.toString().split("\n"))
            updatedLeaderboard = updateMembersInfo(participantsTimes, leaderboard)
            updatedLeaderboard = parser.arrayToCsv(updatedLeaderboard, "RANKING,NAME,POINTS,GAMES,WINS,DRAWS,LOSSES\n")
            parser.createFile(updatedLeaderboard, "Leaderboard.csv")
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
            case "collected_cards": switch (true) {
                case value >= MAX_COLLECTED_CARDS:    return 3
                case value >= MEDIUM_COLLECTED_CARDS: return 1
                default:                              return 0
            }
        }
    }

    function getPlayerInfo() {
        const options = utils.options(utils.PLAYER_URL)

        utils.request.get(options, (err, res, body) => {
            if (err == null) {  
                console.log(res.body)     
            } else {
                console.log(err)
            }
        });
    }
}
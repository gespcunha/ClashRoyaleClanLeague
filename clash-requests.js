/**
 * To implement
 * 
 * Wars win rate
 * donations - check
 * Number of wars played in the last 10 - check
 * Collected cards in the last war - check
 */

module.exports = function(utils, parser) {

    return {
        leaderboard: leaderboard,
        getLastWars: getLastWars,
        getDonations: getDonations,
        getCollectedCards: getCollectedCards
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
        var options = utils().options(utils().CLAN_URL)
        var members = []

        utils().request.get(options, (err, res, body) => {
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

    // Number of wars played by each player in the last 10 wars
    function getLastWars(readWrite) {
        var options = utils().options(utils().CLAN_LAST_WARS_URL)

        utils().request.get(options, (err, res, body) => {
            if (err != null) {  
                console.log(err)
                return
            }
            var participantsTimes = fillParticipantsTimes(res)
            if (readWrite == "write")
                updatedLeaderboardFile(participantsTimes)
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
                    if (participantsTimes[name]) {
                        participantsTimes[name] += 1
                    } else {
                        participantsTimes[name] = 1
                    }
                })
                wars.push(participants)
            })
            
            var final = []
            for (const [name, wars] of Object.entries(participantsTimes)) {
                var points = null
                switch (wars) {
                    case 10:        points = 3; break;
                    case wars >= 7: points = 1; break;
                    default:        points = 0; break;
                }

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
        const options = utils().options(utils().CLAN_URL)
        var players = []

        utils().request.get(options, (err, res, body) => {
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
                var points = null
                switch (true) {
                    case i <= 12: points = 3; break;
                    case i <= 24: points = 1; break;
                    default:      points = 0; break;
                }
                
                players[i]["points"] = points
            }
            
            if (readWrite == "write")
                updatedLeaderboardFile(players)
            else if (readWrite == "read")
                console.table(players)    
            else 
                console.log("This command doesn't have a definition for " + readWrite)      
        });
    }

    // Collected cards by each player in the last war
    function getCollectedCards(readWrite) {

        const options = utils().options(utils().CLAN_WAR_CARDS_EARNED_URL)
        var players = []

        utils().request.get(options, (err, res, body) => {
            if (err != null) { 
                console.log(err)
                return
            } 
            res.body.participants.forEach(member => {
                var points = null
                var cards = member.cardsEarned
                switch (true) {
                    case cards >= 2000: points = 3; break;
                    case cards >= 1900: points = 1; break;
                    default:            points = 0; break;
                }

                player = {
                    "name": member.name,
                    "collectedCards": cards,
                    "points": points
                }
                players.push(player)
            })
            players.sort(function(a, b){return b.collectedCards - a.collectedCards});
            if (readWrite == "write")
                updatedLeaderboardFile(players)
            else if (readWrite == "read")
                console.table(players)    
            else 
                console.log("This command doesn't have a definition for " + readWrite)
        });
    }

    function updatedLeaderboardFile(participantsTimes) {
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

    function getPlayerInfo() {
        const options = utils().options(utils().PLAYER_URL)

        utils().request.get(options, (err, res, body) => {
            if (err == null) {  
                console.log(res.body)     
            } else {
                console.log(err)
            }
        });
    }
}
module.exports = function(services, parser, utils, chalk) {
    
    if (!services)
        throw "Invalid services."

    if (!parser)
        throw "Invalid parser."    

    if (!utils)
        throw "Invalid utils."

    if (!chalk) 
        throw "Invalid chalk."

        
    return {
        getDonations: getDonations,
        getTrophies: getTrophies,
        getLeaderboard: getLeaderboard,
        getWinRate: getWinRate,
        getParticipations: getParticipations,
        getCollectedCards: getCollectedCards
    }

    function getLeaderboard(readWrite) {
        if (readWrite == "Read") {
            console.log(chalk.green("Just open the file ...Leaderboard (if exists)."))
            return
        }
        services.getLeaderboard()
            .then(function (result) {
                parser.createLeaderboard(result, utils.CLAN_TAG + "Leaderboard.xlsx")
            })
            .catch(function (errMsg) {
                console.log(chalk.red.bold(errMsg))
            })
    }

    function getWinRate(readWrite) {
        services.getWinRate()
            .then(function (result) {
                if (readWrite == "Read") {
                    parser.createFixture(result, "Fixture.xlsx")
                }
                else {
                    updateLeaderboardFile(result)
                }
            })
            .catch(function (errMsg) {
                console.log(chalk.red.bold(errMsg))
            })
    }

    function getTrophies(readWrite) {
        services.getTrophies()
            .then(function (result) {
                if (readWrite == "Read") {
                    parser.createFixture(result, "Fixture.xlsx")
                }
                else {
                    updateLeaderboardFile(result)
                }
            })
            .catch(function (errMsg) {
                console.log(chalk.red.bold(errMsg))
            })
    }

    function getDonations(readWrite) {
        services.getDonations()
            .then(function (result) {
                if (readWrite == "Read") {
                    parser.createFixture(result, "Fixture.xlsx")
                }
                else {
                    updateLeaderboardFile(result)
                }
            })
            .catch(function (errMsg) {
                console.log(chalk.red.bold(errMsg))
            })
    }

    function getParticipations(readWrite) {
        services.getParticipations()
            .then(function (result) {
                if (readWrite == "Read") {
                    parser.createFixture(result, "Fixture.xlsx")
                }
                else {
                    updateLeaderboardFile(result)
                }
            })
            .catch(function (errMsg) {
                console.log(chalk.red.bold(errMsg))
            })
    }

    function getCollectedCards(readWrite) {
        services.getCollectedCards()
            .then(function (result) {
                if (readWrite == "Read") {
                    parser.createFixture(result, "Fixture.xlsx")
                }
                else {
                    updateLeaderboardFile(result)
                }
            })
            .catch(function (errMsg) {
                console.log(chalk.red.bold(errMsg))
            })
    }

    function updateLeaderboardFile(obj) {
        parser.readFile(utils.CLAN_TAG + "Leaderboard.xlsx", function (data) {
            let updatedLeaderboard = updateMembersInfo(obj, data)
            parser.createLeaderboard(updatedLeaderboard, utils.CLAN_TAG + "Leaderboard.xlsx")
        })
    }

    function updateMembersInfo(content, objToUpdate) {
        content.forEach(newData => {
            objToUpdate.forEach(member => {
                if (newData.name == member.name) {
                    member.points = parseInt(member.points)
                    member.points += newData.points
                    switch (newData.points) {
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
        insertRanking(objToUpdate)
        return objToUpdate
    }

    // Set the ranking in each player
    function insertRanking(obj) {
        var i = 1
        obj.forEach(member => member.rank = i++)
    }
}
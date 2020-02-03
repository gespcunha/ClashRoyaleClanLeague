module.exports = function(services, parser, utils, exec) {
    
    if (!services)
        throw "Invalid services."

    if (!parser)
        throw "Invalid parser."    
  
    const leaderboardPath = `${utils.CLAN_TAG}Leaderboard.csv`
    const fixturePath     = `Fixture.csv`

    return {
        getDonations: getDonations,
        getTrophies: getTrophies,
        getLeaderboard: getLeaderboard,
        getWinRate: getWinRate,
        getParticipations: getParticipations,
        getCollectedCards: getCollectedCards
    }

    function getLeaderboard(readWrite) {
        if (readWrite == "read") {
            exec(`start ${leaderboardPath}`, (err, stdout, stderr) => {
                if (err != null)
                    console.log(`File ${parser.dir + leaderboardPath} doesn't exist or is opened.`)
            })
            return
        }
        services.getLeaderboard()
            .then(function (result) {
                var headers = parser.getHeadersUpperCased(result)
                var data = parser.arrayToCsv(result, headers)
                parser.createFile(data, leaderboardPath)
                    .then(msg => {
                        console.log(msg)
                        exec(`start ${parser.dir + leaderboardPath}`, (err, stdout, stderr) => {
                            if (err != null)
                                console.log(`File ${parser.dir + leaderboardPath} doesn't exist or is opened.`)
                        })
                    })
                    .catch(msg => {
                        console.log(msg)
                        return
                    })
            })
            .catch(function (errMsg) {
                console.log(errMsg)
            })
    }

    function getWinRate(readWrite) {
        services.getWinRate()
            .then(function (result) {
                if (readWrite == "read") {
                    var headers = parser.getHeadersUpperCased(result)
                    var data = parser.arrayToCsv(result, headers)
                    parser.createFile(data, fixturePath)
                        .then(msg => {
                            console.log(msg)
                            exec(`start ${parser.dir + fixturePath}`, (err, stdout, stderr) => {
                                if (err != null)
                                    console.log(`File ${parser.dir + fixturePath} doesn't exist or is opened.`)
                            })
                        })
                        .catch(msg => {
                            console.log(msg)
                            return
                        })
                }
                else {
                    updateLeaderboardFile(result)
                }
            })
            .catch(function (errMsg) {
                console.log(errMsg)
            })
    }

    function getTrophies(readWrite) {
        services.getTrophies()
            .then(function (result) {
                if (readWrite == "read") {
                    var headers = parser.getHeadersUpperCased(result)
                    var data = parser.arrayToCsv(result, headers)
                    parser.createFile(data, fixturePath)
                        .then(msg => {
                            console.log(msg)
                            exec(`start ${parser.dir + fixturePath}`, (err, stdout, stderr) => {
                                if (err != null)
                                    console.log(`File ${parser.dir + fixturePath} doesn't exist or is opened.`)
                            })
                        })
                        .catch(msg => {
                            console.log(msg)
                            return
                        })
                }
                else {
                    updateLeaderboardFile(result)
                }
            })
            .catch(function (errMsg) {
                console.log(errMsg)
            })
    }

    function getDonations(readWrite) {
        services.getDonations()
            .then(function (result) {
                if (readWrite == "read") {
                    var headers = parser.getHeadersUpperCased(result)
                    var data = parser.arrayToCsv(result, headers)
                    parser.createFile(data, fixturePath)
                        .then(msg => {
                            console.log(msg)
                            exec(`start ${parser.dir + fixturePath}`, (err, stdout, stderr) => {
                                if (err != null)
                                    console.log(`File ${parser.dir + fixturePath} doesn't exist or is opened.`)
                            })
                        })
                        .catch(msg => {
                            console.log(msg)
                            return
                        })
                }
                else {
                    updateLeaderboardFile(result)
                    //console.table(result)
                }
            })
            .catch(function (errMsg) {
                console.log(errMsg)
            })
    }

    function getParticipations(readWrite) {
        services.getParticipations()
            .then(function (result) {
                if (readWrite == "read") {
                    var headers = parser.getHeadersUpperCased(result)
                    var data = parser.arrayToCsv(result, headers)
                    parser.createFile(data, fixturePath)
                        .then(msg => {
                            console.log(msg)
                            exec(`start ${parser.dir + fixturePath}`, (err, stdout, stderr) => {
                                if (err != null)
                                    console.log(`File ${parser.dir + fixturePath} doesn't exist or is opened.`)
                            })
                        })
                        .catch(msg => {
                            console.log(msg)
                            return
                        })
                }
                else {
                    updateLeaderboardFile(result)
                }
            })
            .catch(function (errMsg) {
                console.log(errMsg)
            })
    }

    function getCollectedCards(readWrite) {
        services.getCollectedCards()
            .then(function (result) {
                if (readWrite == "read") {
                    var headers = parser.getHeadersUpperCased(result)
                    var data = parser.arrayToCsv(result, headers)
                    parser.createFile(data, fixturePath)
                        .then(msg => {
                            console.log(msg)
                            exec(`start ${parser.dir + fixturePath}`, (err, stdout, stderr) => {
                                if (err != null)
                                    console.log(`File ${parser.dir + fixturePath} doesn't exist or is opened.`)
                            })
                        })
                        .catch(msg => {
                            console.log(msg)
                            return
                        })
                }
                else {
                    updateLeaderboardFile(result)
                }
            })
            .catch(function (errMsg) {
                console.log(errMsg)
            })
    }

    function updateLeaderboardFile(obj) {
        parser.readFile(utils.CLAN_TAG + "Leaderboard.csv")
            .then(data => {
                leaderboard = parser.csvToArray(data.toString().split("\n"))
                updatedLeaderboard = updateMembersInfo(obj, leaderboard)
                updatedLeaderboard = parser.arrayToCsv(updatedLeaderboard, "RANK,NAME,POINTS,GAMES,WINS,DRAWS,LOSSES\n")
                parser.createFile(updatedLeaderboard, utils.CLAN_TAG + "Leaderboard.csv")
                    .then(msg => {
                        console.log(msg)
                        exec(`start ${parser.dir + fixturePath}`, (err, stdout, stderr) => {
                            if (err != null)
                                console.log(`File ${parser.dir + fixturePath} doesn't exist or is opened.`)
                        })
                    })
                    .catch(msg => {
                        console.log(msg)
                        return
                    })
            })
            .catch(msg => console.log(msg))
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
module.exports = function(services, parser, utils, chalk) {
        
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

    function getLeaderboard(readWrite) {
        if (readWrite == "Read") {
            console.log(chalk.green("Just open the file ...Leaderboard (if exists)."))
            return
        }
        services.getLeaderboard()
            .then(function (result) { parser.createLeaderboard(result, utils.CLAN_TAG + "Leaderboard.xlsx") })
            .catch(function(errMsg) { showErrMsg(errMsg) })
    }

    function getWinRate(readWrite) {
        services.getWinRate()
            .then(function (result) { processServicesResult(result, readWrite) })
            .catch(function(errMsg) { showErrMsg(errMsg) })
    }

    function getTrophies(readWrite) {
        services.getTrophies()
            .then(function (result) { processServicesResult(result, readWrite) })
            .catch(function(errMsg) { showErrMsg(errMsg) })
    }

    function getDonations(readWrite) {
        services.getDonations()
            .then(function (result) { processServicesResult(result, readWrite) })
            .catch(function(errMsg) { showErrMsg(errMsg) })
    }

    function getParticipations(readWrite) {
        services.getParticipations()
            .then(function (result) { processServicesResult(result, readWrite) })
            .catch(function(errMsg) { showErrMsg(errMsg) })
    }

    function getCollectedCards(readWrite) {
        services.getCollectedCards()
            .then(function (result) { processServicesResult(result, readWrite) })
            .catch(function(errMsg) { showErrMsg(errMsg) }) 
    }

    function getMissedCollectionsOrWars(readWrite) {
        services.getMissedCollectionsOrWars()
            .then(function (result) { processServicesResult(result, readWrite) })
            .catch(function(errMsg) { showErrMsg(errMsg) })
    }

    function addPointForWinningWar(readWrite) {
        services.addPointForWinningWar()
            .then(function (result) { processServicesResult(result, readWrite) })
            .catch(function(errMsg) { showErrMsg(errMsg) })
    }

    function processServicesResult(result, readWrite) {
        if (readWrite == "Read") {
            parser.createFixture(result, "Fixture.xlsx")
        }
        else {
            updateLeaderboardFile(result)
        }
    }

    function showErrMsg(errMsg) {
        console.log(chalk.red.bold(errMsg))
    }

    function updateLeaderboardFile(obj, isGame = true) {
        parser.readFile(utils.CLAN_TAG + "Leaderboard.xlsx", function (data) {
            let updatedLeaderboard = updateMembersInfo(obj, data, isGame)
            parser.createLeaderboard(updatedLeaderboard, utils.CLAN_TAG + "Leaderboard.xlsx")
        })
    }

    function updateMembersInfo(content, objToUpdate, isGame = true) {
        content.forEach(newData => {
            objToUpdate.forEach(member => {
                if (newData.name == member.name) {
                    member.points = parseInt(member.points)
                    member.points += newData.points
                    if (isGame) {
                        switch (newData.points) {
                            case 3: member.wins++; break
                            case 1: member.draws++; break
                            default: member.losses++; 
                        }
                        member.games = parseInt(member.wins) + parseInt(member.draws) + parseInt(member.losses)
                    }
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
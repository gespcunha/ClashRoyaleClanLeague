module.exports = function(api) {

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

    function getLeaderboard() {
        return api.getLeaderboard()
    }

    function getDonations() {
        return api.getDonations()
    }

    function getTrophies() {
        return api.getTrophies()
    }

    function getWinRate() {
        return api.getWinRate()
    }

    function getParticipations() {
        return api.getParticipations()
    }

    function getCollectedCards() {
        return api.getCollectedCards()
    }

    function getMissedCollectionsOrWars() {
        return api.getMissedCollectionsOrWars()
    }

    function addPointForWinningWar() {
        return api.addPointForWinningWar()
    }
}
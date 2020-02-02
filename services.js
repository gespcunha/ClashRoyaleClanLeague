module.exports = function(api) {

    if (!api) 
        throw "Invalid api."

    return {
        getDonations: getDonations,
        getTrophies: getTrophies,
        getLeaderboard: getLeaderboard,
        getWinRate: getWinRate,
        getParticipations: getParticipations,
        getCollectedCards: getCollectedCards
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
}
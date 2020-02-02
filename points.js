module.exports = function() {
    /**
     * Points to each criteria
     */

    // 3 points
    const MAX_WIN_RATE = 65                     // (percentage) this or higher
    const MAX_TROPHIES = 12                     // (position)   from 1 to this
    const MAX_DONATIONS_RANKING = 12            // (position)   from 1 to this
    const MAX_LAST_WARS_PARTICIPATIONS = 10     // (Number)     this
    const MAX_COLLECTED_CARDS = 2100            // (Number)     this or higher
    
    // 1 point
    const MEDIUM_WIN_RATE = 45                  // (percentage) this or higher
    const MEDIUM_TROPHIES = 24                  // (position)   from this to max number of members
    const MEDIUM_DONATIONS_RANKING = 24         // (position)   from this to max number of members
    const MEDIUM_LAST_WARS_PARTICIPATIONS = 7   // (Number)     this or higher
    const MEDIUM_COLLECTED_CARDS = 1900         // (Number)     this or higher
    
    return {
        getPoints: getPoints
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
            case "trophies":  switch (true) {
                case value <= MAX_TROPHIES:    return 3
                case value <= MEDIUM_TROPHIES: return 1
                default:                       return 0
            }
        }
    }
}
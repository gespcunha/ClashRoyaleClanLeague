module.exports = function() {
    /**
     * Points to each criteria
     */

    // 3 points
    const MAX_WIN_RATE = 65                     // (Percentage) this or higher
    const MAX_LAST_WARS_PARTICIPATIONS = 9      // (Number)     this or higher
    const MAX_COLLECTED_CARDS = 2100            // (Number)     this or higher
    const MAX_MISSED_BATTLES = 1                // (Number)     from 0 to this
    const WON_WAR_BATTLE = 1                    // (Number)     1 or 2 wins 
    
    // 1 point
    const MEDIUM_WIN_RATE = 45                  // (Percentage) this or higher
    const MEDIUM_LAST_WARS_PARTICIPATIONS = 7   // (Number)     this or higher
    const MEDIUM_COLLECTED_CARDS = 1900         // (Number)     this or higher
    const MEDIUM_MISSED_BATTLES = 3             // (Number)     from max missed battles to this
    
    return {
        getPoints: getPoints
    }
    
    function getPoints(criteria, value, threePoints = null, onePoint = null) {
        switch (criteria) {
            case "win_rate": switch (true) {
                case value >= MAX_WIN_RATE:    return 3
                case value >= MEDIUM_WIN_RATE: return 1
                default:                       return 0
            }
            case "participations": switch (true) {
                case value >= MAX_LAST_WARS_PARTICIPATIONS:    return 3
                case value >= MEDIUM_LAST_WARS_PARTICIPATIONS: return 1
                default:                                       return 0
            } 
            case "donations": switch(true) {
                case value <= threePoints:  return 3
                case value <= onePoint:     return 1
                default:                    return 0
            }
            case "cardsEarned": switch (true) {
                case value >= MAX_COLLECTED_CARDS:    return 3
                case value >= MEDIUM_COLLECTED_CARDS: return 1
                default:                              return 0
            }
            case "trophies":  switch (true) {
                case value <= threePoints:  return 3
                case value <= onePoint:     return 1
                default:                    return 0
            }
            case "missedBattles": switch(true) {
                case value <= MAX_MISSED_BATTLES:    return 3
                case value <= MEDIUM_MISSED_BATTLES: return 1
                default:                             return 0
            }
            case "winningWar": switch(true) {
                case value >= WON_WAR_BATTLE:  return 1
                default:                       return 0
            }
        }
    }
}
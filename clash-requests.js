/**
 * To implement
 * 
 * Wars win rate
 * donations - check
 * Number of wars played in the last 10 - check
 * Collected cards in the last war - check
 */

const utils = require('./utils')
const csvParser = require('./csv-parser')

getLastWars()
getCollectedCards()
getClanPlayersDonations()
//getPlayerInfo()

function getLastWars() {
    var options = utils().options(utils().CLAN_LAST_WARS_URL)
    var parserFileName = 'wars.csv'
    var parserHeader = [
        {id: 'name', title: 'Name'},
        {id: 'wars', title: 'Wars'}
    ]

    var wars = []

    utils().request.get(options, (err, res, body) => {
        if (err == null) {  
            var participantsTimes = fillParticipantsTimes(res)
            csvParser().parse(participantsTimes, parserHeader, parserFileName)       
        } else {
            console.log(err)
        }
    });

    function fillParticipantsTimes(res) {
        var participantsTimes = []
        res.body.forEach(war => {
            var participants = []
            war.participants.forEach(participant => {
                participants.push({"name": participant.name})
                if (participantsTimes[participant.name]) {
                    participantsTimes[participant.name] += 1
                } else {
                    participantsTimes[participant.name]
                    participantsTimes[participant.name] = 1
                }
            })
            wars.push(participants)
        })
        
        var final = []
        for (const [key, value] of Object.entries(participantsTimes)) {
            final.push({
                "name": key, 
                "wars": value
            })
        }
        final.sort(function(a, b){return b.wars - a.wars});
        return final
    }
}

function getCollectedCards() {
    const options = utils().options(utils().CLAN_WAR_CARDS_EARNED_URL)
    var parserFileName = 'collectedCards.csv'
    var parserHeader = [
        {id: 'name', title: 'Name'},
        {id: 'collectedCards', title: 'Collected Cards'}
    ]
    var players = []

    utils().request.get(options, (err, res, body) => {
        if (err == null) {  
            res.body.participants.forEach(member => {
                player = {
                    "name": member.name,
                    "collectedCards": member.cardsEarned
                }
                players.push(player)
            })
            players.sort(function(a, b){return b.cardsEarned - a.cardsEarned});
            csvParser().parse(players, parserHeader, parserFileName)           
        } else {
            console.log(err)
        }
    });
}

function getClanPlayersDonations() {
    const options = utils().options(utils().CLAN_URL)
    var parserFileName = 'donations.csv'
    var parserHeader = [
        {id: 'name', title: 'Name'},
        {id: 'donations', title: 'Donations'}
    ]
    var players = []

    utils().request.get(options, (err, res, body) => {
        if (err == null) {  
            res.body.members.forEach(member => {
                player = {
                    "name": member.name,
                    "donations": member.donations
                }
                players.push(player)
            })
            players.sort(function(a, b){return b.donations - a.donations});
            csvParser().parse(players, parserHeader, parserFileName)              
        } else {
            console.log(err)
        }
    });
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
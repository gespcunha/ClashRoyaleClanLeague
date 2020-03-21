module.exports = function() {
    
    const request = require('request')

    const CLAN_TAG = "9LU2Y8LU"

    const CLAN_URL = "https://cr-api-proxy.herokuapp.com/v1/clans/%23" + CLAN_TAG
    const CLAN_LAST_WARS_URL = CLAN_URL + "/warlog" // last 10 wars
    const USERNAME = ""
    const PASSWORD = "Jj7UY.gu-QhC4npjZPhyxDgeE@hd8nzEX7HW"
    const AUTH = "Basic " + new Buffer.from(USERNAME + ":" + PASSWORD).toString("base64")

    return {
        requestOptions: requestOptions,
        CLAN_TAG: CLAN_TAG,
        CLAN_URL: CLAN_URL,
        CLAN_LAST_WARS_URL: CLAN_LAST_WARS_URL,
        removeNotInClan: removeNotInClan
    }
    
    function requestOptions(uri, method = 'GET', headers = {Authorization: AUTH}, json = true) {
        return {
            method: method,
            headers: headers,
            uri: uri,
            json: json
        }
    }

    // removes players that aren't in the clan
    function removeNotInClan(allPlayers) {
        return new Promise(function(resolve, reject) {
            var options = requestOptions(CLAN_URL)
            var inClan = []

            request.get(options, (err, res, body) => {
                if (err != null) {
                    console.log(err)
                    return
                } 

                res.body.memberList.forEach(member => {
                    inClan.push({
                        "name": member.name
                    })
                })
                
                for (var i = allPlayers.length-1; i >= 0; i--) {
                    var found = false
                    for (var j = 0; j < inClan.length; j++) {
                        if (allPlayers[i].name == inClan[j].name) {
                            found = true
                            break
                        }            
                    }
                    if (!found)
                        allPlayers.splice(i,1)
                }

                resolve(allPlayers)
            })
        })        
    }
}








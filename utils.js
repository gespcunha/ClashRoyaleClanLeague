module.exports = function() {
    
    const CLAN_TAG = "9LU2Y8LU"

    const CLAN_URL = "https://cr-api-proxy.herokuapp.com/v1/clans/%23" + CLAN_TAG
    const CLAN_LAST_WARS_URL = CLAN_URL + "/warlog" // last 10 wars
    const USERNAME = ""
    const PASSWORD = "Jj7UY.gu-QhC4npjZPhyxDgeE@hd8nzEX7HW"
    const AUTH = "Basic " + new Buffer.from(USERNAME + ":" + PASSWORD).toString("base64")

    return {
        options: options,  
        CLAN_TAG: CLAN_TAG,
        CLAN_URL: CLAN_URL,
        CLAN_LAST_WARS_URL: CLAN_LAST_WARS_URL
    }
    
    function options(uri, method = 'GET', headers = {Authorization: AUTH}, json = true) {
        return {
            method: method,
            headers: headers,
            uri: uri,
            json: json
        }
    }
}








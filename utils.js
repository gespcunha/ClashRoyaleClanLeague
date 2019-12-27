module.exports = function() {

    const request = require('request')

    const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzM4OSwiaWRlbiI6IjM3OTU1NjM4Njg3MjQ5MjA0MiIsIm1kIjp7InVzZXJuYW1lIjoiUC5OZXNzIiwiZGlzY3JpbWluYXRvciI6IjA5NzIiLCJrZXlWZXJzaW9uIjozfSwidHMiOjE1NzczOTQwNTU0NjF9.hTys4wKd2UCKPOSPjb3mZrLbndDf_KdMNZ5SP21wIXU"
    const HOTEL_TAG = "9LU2Y8LU"
    const PNESS_TAG = "PG8VRVU9P"

    const CLAN_URL = "https://api.royaleapi.com/clan/" + HOTEL_TAG
    const CLAN_WAR_CARDS_EARNED_URL = "https://api.royaleapi.com/clan/" + HOTEL_TAG + "/war" // just the last war
    const CLAN_LAST_WARS_URL = "https://api.royaleapi.com/clan/" + HOTEL_TAG + "/warlog"     // last 10 wars

    const PLAYER_URL = "https://api.royaleapi.com/player/" + PNESS_TAG
    
    return {
        options: options,
        request: request,
        CLAN_URL: CLAN_URL,
        CLAN_LAST_WARS_URL: CLAN_LAST_WARS_URL,
        CLAN_WAR_CARDS_EARNED_URL:CLAN_WAR_CARDS_EARNED_URL,
        PLAYER_URL: PLAYER_URL
    }
    
    function options(uri, method = 'GET', headers = {'auth': API_KEY}, json = true) {
        return {
            method: method,
            headers: headers,
            uri: uri,
            json: json
        }
    }
}
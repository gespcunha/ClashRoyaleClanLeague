module.exports = function() {
    
    const CLAN_TAG = "9LU2Y8LU"

    // algueirão
    const API_KEY = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6ImE4MTJkMTMwLWRkOWEtNDhhMy1hZDIzLWYwNjc3OGM4ODc1YSIsImlhdCI6MTU4MDQyODczNywic3ViIjoiZGV2ZWxvcGVyLzQ1NmNkZjQ2LWVmN2ItYTVjMy1lMjQ4LTI1ZTc0YjRjYzRhZCIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyI0Ni4xODkuMjM2LjIwOSJdLCJ0eXBlIjoiY2xpZW50In1dfQ.X2xLQQEQfguszAeM3A4E93KYdESqUrVbkpg9dX08nw5-f0-t21L0Pnjd14CB-PbxIBZL1pyeI2XVvuMw_1VSVA" 
    
    // costa
    //const API_KEY = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6ImUwM2M2MDQ5LWVjOTgtNDliMy1iMzMwLWQyMGM2NWI5YWRjMiIsImlhdCI6MTU4MTE3MjUzMCwic3ViIjoiZGV2ZWxvcGVyLzQ1NmNkZjQ2LWVmN2ItYTVjMy1lMjQ4LTI1ZTc0YjRjYzRhZCIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyIxMDkuNDguMjQ3LjEwMSJdLCJ0eXBlIjoiY2xpZW50In1dfQ.arQYrbTHjWWvDmtmWP7oaMi2LxPIvSwvd7X_L1zQuSH-DQey-T8I4XTaCouAgGH_LNM3SJN3QVeLII9l5NndcQ"

    const CLAN_URL = "https://api.clashroyale.com/v1/clans/%23" + CLAN_TAG
    const CLAN_LAST_WARS_URL = "https://api.clashroyale.com/v1/clans/%23" + CLAN_TAG + "/warlog" // last 10 wars

    return {
        options: options,
        CLAN_TAG: CLAN_TAG,
        CLAN_URL: CLAN_URL,
        CLAN_LAST_WARS_URL: CLAN_LAST_WARS_URL
    }
    
    function options(uri, method = 'GET', headers = {'Authorization': `Bearer: ${API_KEY}`}, json = true) {
        return {
            method: method,
            headers: headers,
            uri: uri,
            json: json
        }
    }
}
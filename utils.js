module.exports = function() {
    
    const CLAN_TAG = "9LU2Y8LU"

    const API_KEY = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6ImRkNzliOWQ2LTcwYTgtNDBlZS04MTk1LTA0ZjVhOTA1ZTQ0NiIsImlhdCI6MTU4MjQwNTEzOSwic3ViIjoiZGV2ZWxvcGVyLzQ1NmNkZjQ2LWVmN2ItYTVjMy1lMjQ4LTI1ZTc0YjRjYzRhZCIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyI0Ni4xODkuMjM2LjIwOSIsIjEwOS40OC4yMTYuMTgyIl0sInR5cGUiOiJjbGllbnQifV19.ltNabtn5ULxnCOMTbmPgctAHJ5YO_QEfh_VCdHFV02mN2eKFbrTETalGNXorvzN-GXRGxTyr90Those0xpka5w" 
    
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
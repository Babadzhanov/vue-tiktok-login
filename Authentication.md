===== Marketing API =====

Marketing API (https://business-api.tiktok.com/open_api/v1.3/) -> Authorization -> Send advertiser authorization URL for approval (this can be taken from the basic information in app details under 'Advertiser authorization URL') -> Advertiser agrees to permissions then need to verify by email or phone number -> Advertiser is redirected to our app -> We grab the auth_code and generate access_token by sending a request to '/oauth2/access_token/' then we need to keep it -> With access_token we can make further queries to tiktok's APIs

*You can configure up to 10 advertiser redirect URLs.
*The advertiser access token does not expire. If you want to invalidate the token, use /oauth2/revoke_token/.


===== Accounts API =====

Accounts API (https://business-api.tiktok.com/open_api/v1.3/) -> TikTok Accounts scope needs to be selected in the app's 'scope of permission' -> Authorization -> Send TikTok account holder authorization URL for approval (note it is different than advertiser one from Marketing API) (this can be taken from the basic information in app details under TikTok account holder authorization URL) -> Account holder reviews and approves the authorization request -> Account holder is redirected to our app -> We grab the auth_code and generate access_token by sending a request to '/tt_user/oauth2/token/' then we need to keep it along side the refresh token which is needed for access token renewal. Use '/tt_user/oauth2/refresh_token/' for access token renewal.


*For security reasons, you can add a unique state query parameter to the authorization URL as a mechanism to mitigate CSRF attacks. It will be echoed back to your application as a query parameter upon user redirect.
*Once a user agrees to permissions they will not be asked again unless we specify a special query parameter '&disable_auto_auth=1'.
*The TikTok Account access token is valid for one day. Once a TikTok account access token has expired, you need to make a request to this endpoint to renew the access token. Remember to pass in the refresh_token for a token renewal request.
*The TikTok account refresh token is valid for one year. If the refresh token expires, the developer needs to request the user to re-authorize their application via the user authorization workflow.
*To invalidate TikTok Account access token use '/tt_user/oauth2/revoke/'.


===== Creator Marketplace API =====


Creator Marketplace API (https://business-api.tiktok.com/open_api/v1.3/) -> The TikTok Creator Marketplace API is currently in closed Beta. Please reach out to your Partner Manager for more information. 

*Login is pretty much a combination of the Marketing API & Accounts API
*/oauth2/access_token/ (TTCM access token)
TTCM account access token: It does not expire. If you want to invalidate the token, use /oauth2/revoke_token/.
*/tt_user/oauth2/token/ (Creator access token)
Creator access token: It is valid for one day. Once an access token has expired, you need to renew the access token via /tt_user/oauth2/refresh_token/ .

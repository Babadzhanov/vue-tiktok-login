# Guide to TikTok's Authentication flow

This guide provides detailed instructions on how to authenticate with TikTok's various APIs. It covers the necessary steps to get authorization from your advertiser, TikTok accounts, or TikTok Creator Marketplace accounts.

## Prerequisites

- [Create TikTok for Business account](https://business-api.tiktok.com/portal/docs?id=1738855099573250)
- [Register as a developer](https://business-api.tiktok.com/portal/docs?id=1738855176671234)
- [Create a developer app](https://business-api.tiktok.com/portal/docs?id=1738855242728450)

After your developer application is approved, you need to get authorization to manage the accounts.

# Marketing API <a title="Link to Marketing API" href="https://business-api.tiktok.com/portal/docs?id=1781891416235009" style="text-decoration:none;">🔗</a>

### Authorization Process

- Send `Advertiser authorization URL` for approval (this can be taken from the `Basic Information` in app details).
- Advertiser agrees to permissions then needs to verify by either email or phone number.
- Advertiser is redirected back to the app.
- The callback URL contains an `auth_code` parameter that needs to be extracted and used to request an `access_token` by sending a POST request to the `/oauth2/access_token/`.
- The access token needs to be kept in db for future use.
- With `access_token` we can make further queries to TikTok's APIs.

### Access Token Request

**POST method**: `https://business-api.tiktok.com/open_api/v1.3/oauth2/access_token/`

```json
Body:
{
    "app_id": "{{app_id}}",
    "secret": "{{secret}}",
    "auth_code": "{{auth_code}}"
}

Headers:
{
    "Content-Type": "application/json"
}
```

### Notes

- You can configure up to 10 advertiser redirect URLs.
- The advertiser access token does not expire. If you want to invalidate the token, use `/oauth2/revoke_token/`.

# Accounts API <a title="Link to Accounts API" href="https://business-api.tiktok.com/portal/docs?id=1737565048641538" style="text-decoration:none;">🔗</a>

### Authorization Steps

- Send `TikTok account holder authorization URL` for approval (note it is different than the advertiser one from Marketing API). This can be taken from the basic information in app details.
- Account holder reviews and approves the authorization request.
- Account holder is redirected back to the app.
- The callback URL contains an `code` parameter that needs to be extracted and used to request an `access_token` by sending a POST request to the `/tt_user/oauth2/token/`.
- The access token needs to be kept in db for future use.
- The refresh token needs to be kept also since it is needed for access token renewal.
- Use `/tt_user/oauth2/refresh_token/` for access token renewal.

### Access Token Request

**POST**: `https://business-api.tiktok.com/open_api/v1.3/tt_user/oauth2/token/`

**Body:**

```json
Body:
{
  "client_id": "{{app_id}}",
  "client_secret": "{{secret}}",
  "grant_type": "authorization_code",
  "redirect_uri": "{{redirect_uri}}",
  "auth_code": "{{code}}"
}

Headers:
{
    "Content-Type": "application/json"
}
```

### Notes

- For security reasons, you can add a unique state query parameter to the authorization URL as a mechanism to mitigate CSRF attacks. It will be echoed back to your application as a query parameter upon user redirect.
- Once a user agrees to permissions, they will not be asked again unless we specify a special query parameter `&disable_auto_auth=1`.
- The TikTok Account access token is valid for one day. Once a TikTok account access token has expired, you need to make a request to this endpoint to renew the access token. Remember to pass in the `refresh_token` for a token renewal request.
- The TikTok account refresh token is valid for one year. If the refresh token expires, the developer needs to request the user to re-authorize their application via the user authorization workflow.
- To invalidate TikTok Account access token, use `/tt_user/oauth2/revoke/`.

# Creator Marketplace API <a title="Link to Creator Marketplace API" href="https://business-api.tiktok.com/portal/docs?id=1735827019995138" style="text-decoration:none;">🔗</a>

The TikTok Creator Marketplace API is currently in closed Beta. Please reach out to your Partner Manager for more information.

### Notes

- Login is pretty much a combination of the Marketing API & Accounts API.
- `/oauth2/access_token/` (TTCM access token)
  - TTCM account access token: It does not expire. If you want to invalidate the token, use `/oauth2/revoke_token/`.
- `/tt_user/oauth2/token/` (Creator access token)
  - Creator access token: It is valid for one day. Once an access token has expired, you need to renew the access token via `/tt_user/oauth2/refresh_token/`.

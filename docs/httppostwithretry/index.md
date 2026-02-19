---
title: "HTTPPostWithRetry"
---


Posts content to the specified URL with automatic retry logic. If the initial request fails, Marketing Cloud will retry the request up to the specified number of times. This function is useful for integrating with external APIs where transient failures may occur.

### Arguments

`HTTPPostWithRetry(1,2,3,4,5,6,7)`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | True | The URL to which the content is posted. Must use HTTP on port 80 or HTTPS on port 443. |
| 2 | String | True | The content type of the request (e.g., `application/json`, `application/x-www-form-urlencoded`). |
| 3 | String | True | The payload (body) of the POST request. |
| 4 | String | True | A variable to receive the response body from the request. |
| 5 | String | True | A variable to receive the HTTP status code returned from the request. |
| 6 | Number | True | The maximum number of retry attempts if the initial request fails. |
| 7+ | String | False | Additional header name and value pairs, appended in pairs (e.g., `headerName1`, `headerValue1`). |

> NOTE: This function only works with HTTP on port 80 and HTTPS on port 443. Basic access authentication in URLs is not supported (e.g., `https://user:pass@domain.com`).

> NOTE: This function is not available for use in emails at the time of send. It is supported on CloudPages, landing pages, and microsites.

### Example 1: Basic Use

This example posts a JSON payload to an external API endpoint with up to 3 retries.

```html
%%[

VAR @payload, @response, @statusCode, @url

SET @url = "https://api.example.com/orders"
SET @payload = '{"orderId": "10110113", "status": "shipped"}'

/* Post with retry: up to 3 retries on failure */
HTTPPostWithRetry(
  @url,
  "application/json",
  @payload,
  @response,
  @statusCode,
  3
)

IF @statusCode == "200" THEN
  Output(Concat("Success! Response: ", @response))
ELSE
  Output(Concat("Request failed with status: ", @statusCode))
ENDIF

]%%
```

### Example 2: Posting with Custom Headers and Authentication

This example sends a POST request to a REST API with a Bearer token for authentication, retrying up to 5 times on failure.

```html
%%[

VAR @endpoint, @payload, @response, @statusCode, @authToken

SET @endpoint = "https://api.example.com/v2/contacts"
SET @authToken = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

SET @payload = Concat(
  '{"email": "', _subscriberKey, '",',
  ' "firstName": "', AttributeValue("FirstName"), '",',
  ' "lastName": "', AttributeValue("LastName"), '"}'
)

/* Post with Bearer auth header and 5 retries */
HTTPPostWithRetry(
  @endpoint,
  "application/json",
  @payload,
  @response,
  @statusCode,
  5,
  "Authorization", @authToken
)

IF @statusCode == "200" OR @statusCode == "201" THEN
  Output(Concat("<p>Contact synced successfully.</p>"))
ELSE
  Output(Concat("<p>Sync failed. Status: ", @statusCode, "</p>"))
ENDIF

]%%
```

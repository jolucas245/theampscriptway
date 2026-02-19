---
title: "HTTPPost"
---


This function posts content to a defined, publicly accessible URL.

### Arguments

`HTTPPost(1,2,3,4,5,6,[7a,7b]...)`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | True | URL endpoint used to post content |
| 2 | String | True | Content-Type header value |
| 3 | String | True | Content to include in POST request |
| 4 | String | False | Variable used to return response |
| 5 | String | False | Name of additional header to include in POST request |
| 6 | String | False | Value of additional header to include in POST request |
| 7a | String | False | Name of additional header to include in POST request (see note) |
| 7b | String | False | Value of additional header to include in POST request (see note) |

> NOTE: Additional header name and value pairs can be appended as arguments.
>
> NOTE: The function only works with HTTP content on TCP/IP port 80 and HTTPS on port 443. Basic access authentication in URLs is not supported (for example, `https://username:password@https://domain.com`).

### Example 1

The following example makes an HTTP POST request with a JSON payload to an external endpoint.

```html
%%[

var @payload, @response

set @payload = '{
   "Order Number":10110113,
   "First Name":"Nora",
   "Last Name":"Taylor",
   "Amount":{
      "Order Subtotal":120,
      "VAT":20,
      "Shipping":0,
      "Order Total":120
   }
}'

set @request = HTTPPost("https://httpbin.org/post","application/json", @payload, @response)

]%%
status code: %%=v(@request)=%%
<br><br>response: %%=v(@response)=%%
```

#### Output

The request returns the response body.

```html
status code: 200

response: {"args":{}, "data":"{...}", "files":{}, "form":{  }, "headers":{...}, "json":{"Amount":{"Order Subtotal":120, "Order Total":120, "Shipping":0, "VAT":20 }, "First Name":"Nora", "Last Name":"Taylor", "Order Number":10110113 } }
```

### Example 2: POST with Custom Headers and Error Handling

This example sends a POST request with a Bearer token for authentication and processes the response.

```html
%%[

VAR @endpoint, @contentType, @payload, @response, @statusCode, @authToken

SET @endpoint = "https://api.example.com/v2/events"
SET @contentType = "application/json"
SET @authToken = "Bearer YOUR_ACCESS_TOKEN_HERE"

/* Build the JSON payload */
SET @payload = Concat(
  '{"subscriberKey": "', _subscriberKey, '",',
  ' "event": "email_opened",',
  ' "timestamp": "', Format(Now(), "yyyy-MM-ddTHH:mm:ssZ"), '"}'
)

/* HTTPPost with custom Authorization header */
SET @statusCode = HTTPPost(
  @endpoint,
  @contentType,
  @payload,
  @response,
  "Authorization", @authToken,
  "X-Custom-Header", "MarketingCloud"
)

IF @statusCode == 200 OR @statusCode == 201 THEN
  /* Success — optionally log or display confirmation */
  Output(Concat("<p>Event logged successfully.</p>"))
ELSE
  /* Handle error gracefully */
  Output(Concat("<p>Event logging failed. Status: ", @statusCode, "</p>"))
ENDIF

]%%
```
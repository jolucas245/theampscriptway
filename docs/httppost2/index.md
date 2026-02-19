---
title: "HTTPPost2"
---


The `HTTPPost2` function in AMPscript allows you to send HTTP POST requests to a specified URL. It is an enhanced version of `HTTPPost` as it provides exception handling, allowing for more robust error management within your AMPscript code. This function is crucial for integrating Marketing Cloud with external systems, enabling data exchange, triggering external processes, or updating records in third-party applications via API calls.

### Arguments

| Ordinal | Type | Required | Description |
|---|---|---|---|
| 1 | String | True | The URL endpoint to which the POST request will be sent. |
| 2 | String | True | The `Content-Type` header value for the POST request (e.g., `application/json`, `application/x-www-form-urlencoded`). |
| 3 | String | True | The content or payload to be sent in the body of the POST request. |
| 4 | Boolean | False | Determines the function's behavior upon encountering an error. If `true`, the function will produce an exception and halt execution. If `false`, the function will continue execution after an error occurs. |
| 5 | Variable | False | A variable used to store the HTTP status code or a success/failure message returned from the POST request. |
| 6 | Variable | False | A variable used to store the response body as a rowset. Note that this is an internal rowset, and its fields are not directly accessible for use within AMPscript. |
| 7 | String | False | The name of an additional HTTP header to include in the request. |
| 8 | String | False | The value corresponding to the additional HTTP header specified in argument 7. |
| 9a | String | False | Name of an additional header to include in the POST request (can be repeated for more headers). |
| 9b | String | False | Value of an additional header to include in the POST request (can be repeated for more headers). |

> NOTE: The `HTTPPost2` function only operates with HTTP on port 80 and HTTPS on port 443. Non-standard port assignments will cause the function to fail. Basic access authentication embedded directly in URLs (e.g., `https://username:password@domain.com`) is not supported.

> NOTE: You cannot modify the `Host` and `Content-Length` headers of POST requests made using this function. The `Host` header is automatically set to the domain of the target URL, and `Content-Length` is set to the length of the content being sent.

> NOTE: If the `Content-Type` header does not specify character encoding, the system defaults to WindowsCodePage 1252. To ensure proper handling of other encodings (e.g., UTF-8), explicitly include `charset=utf-8` in the `Content-Type` header (e.g., `Content-Type: application/json; charset=utf-8`).

### Example 1: Basic JSON POST Request

This example demonstrates how to send a simple JSON payload to an external endpoint using `HTTPPost2`. It includes error handling and captures the response status and body.

```html
%%[
    /* Define variables for the payload, response, and status */
    VAR @payload, @postRequest, @response, @responseRows
    VAR @statusCode, @responseContent

    /* Construct the JSON payload */
    SET @payload = '{
       "OrderNumber": 10110113,
       "FirstName": "Curt",
       "LastName": "Harris",
       "Amount": {
          "OrderSubtotal": 120,
          "VAT": 20,
          "Shipping": 0,
          "OrderTotal": 140 /* Corrected total for VAT */
       }
    }'

    /* Execute the HTTPPost2 request */
    /* Arguments: URL, Content-Type, Payload, Throw Exception on Error (true/false), Response Variable, Response Rowset Variable */
    SET @postRequest = HTTPPost2(
        "https://httpbin.org/post", /* Example URL for testing POST requests */
        "application/json; charset=utf-8", /* Specify content type and character set */
        @payload,
        TRUE, /* Set to TRUE to throw an exception on error */
        @response,
        @responseRows
    )

    /* Check if the request was successful (status code 200) */
    IF NOT EMPTY(@postRequest) THEN
        SET @statusCode = @postRequest
        SET @responseContent = @response
    ELSE
        SET @statusCode = "Error: No response or request failed."
        SET @responseContent = ""
    ENDIF
]%%

<p><b>Status Code:</b> %%=v(@statusCode)=%%</p>
<p><b>Response Content:</b> %%=v(@responseContent)=%%</p>
<p><b>Response Row Count:</b> %%=IIF(NOT EMPTY(@responseRows), RowCount(@responseRows), 0)=%%</p>
```

### Example 2: POST Request with Custom Headers

This example demonstrates how to include custom headers in an `HTTPPost2` request, which can be useful for API authentication or passing additional metadata.

```html
%%[
    /* Define variables for the payload, response, and status */
    VAR @payload, @postRequest, @response, @responseRows
    VAR @statusCode, @responseContent

    /* Construct a simple payload */
    SET @payload = '{"message": "Hello from Marketing Cloud!"}'

    /* Execute the HTTPPost2 request with custom headers */
    /* Arguments: URL, Content-Type, Payload, Throw Exception on Error, Response Variable, Response Rowset Variable, Header Name 1, Header Value 1, Header Name 2, Header Value 2 */
    SET @postRequest = HTTPPost2(
        "https://httpbin.org/post", /* Example URL for testing POST requests */
        "application/json; charset=utf-8",
        @payload,
        FALSE, /* Set to FALSE to continue execution on error */
        @response,
        @responseRows,
        "X-Custom-Header", "MyCustomValue", /* Custom header 1 */
        "Authorization", "Bearer your_api_token" /* Custom header 2 (e.g., for API authentication) */
    )

    /* Check if the request was successful */
    IF NOT EMPTY(@postRequest) THEN
        SET @statusCode = @postRequest
        SET @responseContent = @response
    ELSE
        SET @statusCode = "Error: Request failed or no response."
        SET @responseContent = ""
    ENDIF
]%%

<p><b>Status Code:</b> %%=v(@statusCode)=%%</p>
<p><b>Response Content:</b> %%=v(@responseContent)=%%</p>
```

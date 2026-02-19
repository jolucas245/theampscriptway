---
title: "Http Functions"
---


The `HttpGet()` function retrieves data from a URL using the GET method. If the URL is the same for multiple subscribers in a send, Marketing Cloud Engagement makes one call per unique URL. The response is then cached and used for each subscriber.

### Arguments

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | True | The URL to perform the HTTP GET operation on. |
| 2 | Boolean | False | If `true`, the function ignores errors that it encounters while performing the HTTP GET operation. If `false`, the function exits when it encounters an error. The default value is `false`. |
| 3 | Integer | False | Specifies how the function handles empty content. Accepted values: `0` (Allow empty content - default), `1` (Return an error), `2` (Skip sending an email). |
| 4 | Integer | False | A variable that holds the status of the function. Possible values: `0` (Success), `-1` (Not Found), `-2` (HTTP Request Error), `-3` (Empty Content). |

> NOTE: This function only works with HTTP on port 80 and HTTPS on port 443. Non-standard port assignments cause this function to fail. In older accounts, Marketing Cloud Engagement assumes that all returned data uses the WindowsCodePage 1252 character set. Recently created accounts use UTF-8. You can change this default by contacting Salesforce support.

### Example 1: Basic Use

This example demonstrates a basic `HttpGet()` call to retrieve the content of a webpage.

```html
%%[

  VAR @url, @content

  SET @url = "http://www.example.com"

  /* Retrieve the content of the specified URL */
  SET @content = HttpGet(@url)

  IF NOT EMPTY(@content) THEN

]%%

  Output of the GET request:
  %%=v(@content)=%%

%%[

  ELSE

]%%

  The request returned no content.

%%[

  ENDIF

]%%
```

### Example 2: Advanced Scenario

This example shows how to use the `HttpGet()` function with error handling and status checking.

```html
%%[

  VAR @url, @content, @status

  SET @url = "http://www.example.com/data.json"

  /* Retrieve the content of the specified URL, continue on error, and allow empty content */
  SET @content = HttpGet(@url, true, 0, @status)

  IF @status == 0 THEN

]%%

  The request was successful. Content:
  %%=v(@content)=%%

%%[

  ELSEIF @status == -1 THEN

]%%

  The specified URL was not found.

%%[

  ELSEIF @status == -2 THEN

]%%

  An HTTP request error occurred.

%%[

  ELSEIF @status == -3 THEN

]%%

  The request completed successfully but returned no content.

%%[

  ELSE

]%%

  An unknown error occurred.

%%[

  ENDIF

]%%
```
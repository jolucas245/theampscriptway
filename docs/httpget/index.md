--- 
title: "HTTPGet"
---


The `httpget` function retrieves content from a specified URL using an HTTP GET request. If the same URL is requested for multiple subscribers in a single send context, Marketing Cloud Engagement makes only one request and caches the response for subsequent subscribers.

> NOTE: This function does not support setting custom headers. For requests requiring headers, use the SSJS `HTTP.Get()` function.

### Arguments

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | Yes | The URL to retrieve data from. |
| 2 | Boolean | No | If `true`, the function continues processing even if an error occurs. Defaults to `false`. |
| 3 | Integer | No | Defines how to handle empty responses. `0` allows empty content (default), `1` raises an error, and `2` skips the subscriber in an email send. |
| 4 | String | No | An AMPscript variable that will contain the status of the function call. `0` for success, `-1` for not found, `-2` for request error, and `-3` for empty content. |

### Example 1: Basic Use

This example demonstrates a basic `httpget` request to retrieve and display content from a URL.

```html
%%[

  /* Set the URL to retrieve */
  VAR @url
  SET @url = "http://www.example.com"

  /* Retrieve the content */
  VAR @content
  SET @content = httpget(@url)

]%%

%%=v(@content)=%%
```

### Example 2: Advanced Scenario with Error Handling

This example shows how to use the `httpget` function with error handling. It checks the status of the request and displays a message if the content is not available.

```html
%%[

  /* Set the URL and status variable */
  VAR @url, @status
  SET @url = "http://www.example.com/data.json"

  /* Retrieve the content, continue on error, and allow empty content */
  VAR @content
  SET @content = httpget(@url, true, 0, @status)

  /* Check if the request was successful */
  IF @status == 0 AND NOT EMPTY(@content) THEN

    /* Process the retrieved content */
    OUTPUT(CONCAT("Successfully retrieved content: ", @content))

  ELSE

    /* Handle the error */
    OUTPUT(CONCAT("Failed to retrieve content. Status code: ", @status))

  ENDIF

]%%
```

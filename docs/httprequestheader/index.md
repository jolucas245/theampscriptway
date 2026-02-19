---
title: "HTTPRequestHeader"
---


Retrieves the specified header from an HTTP request for a landing page. This function can only be used to retrieve standard HTTP headers as outlined in [RFC 7231](https://www.ietf.org/rfc/rfc7231.txt).

### Arguments

| Ordinal | Type   | Required | Description                                  |
| :------ | :----- | :------- | :------------------------------------------- |
| 1       | String | Yes      | The name of the HTTP header to retrieve.     |

> NOTE: This function is primarily intended for use on classic landing pages. When used on CloudPages, certain headers (e.g., `X-Forwarded-For`) may return values related to the Content Delivery Network (CDN) proxy rather than the client's original request due to the nature of proxying.

### Example 1: Basic Use - Retrieving User-Agent

This example demonstrates how to retrieve the `User-Agent` header, which provides information about the client's browser and operating system.

```html
%%[
    /* Declare a variable to store the User-Agent header value */
    VAR @userAgent

    /* Retrieve the User-Agent header */
    SET @userAgent = HttpRequestHeader('User-Agent')

    /* Check if the User-Agent is not empty before displaying */
    IF NOT EMPTY(@userAgent) THEN
]%%
        <p>Your User-Agent: %%=V(@userAgent)=%%</p>
%%[
    ELSE
]%%
        <p>User-Agent header not found or empty.</p>
%%[
    END IF
]%% 
```

### Example 2: Advanced Scenario - Retrieving a Cookie Value

This example shows how to retrieve a specific cookie value from the `Cookie` header. This is useful for accessing client-side information stored in cookies.

```html
%%[
    /* Declare variables for the full Cookie header and the specific IP address cookie */
    VAR @cookieHeader, @ipAddressCookie

    /* Retrieve the entire Cookie header */
    SET @cookieHeader = HttpRequestHeader('Cookie')

    /* Check if the Cookie header is not empty */
    IF NOT EMPTY(@cookieHeader) THEN
        /* Extract the 'ipAddress' cookie value. This assumes the cookie is in the format 'ipAddress=VALUE' */
        SET @ipAddressCookie = Replace(@cookieHeader, 'ipAddress=', '')

        /* Further processing can be done here, e.g., parsing multiple cookies */

        /* Check if the specific IP address cookie was found and is not empty */
        IF NOT EMPTY(@ipAddressCookie) THEN
]%%
            <p>Retrieved IP Address from Cookie: %%=V(@ipAddressCookie)=%%</p>
%%[
        ELSE
]%%
            <p>IP Address cookie not found.</p>
%%[
        END IF
    ELSE
]%%
        <p>No Cookie header found in the request.</p>
%%[
    END IF
]%%
```
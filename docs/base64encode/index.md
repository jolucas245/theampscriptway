---
title: "Base64Encode"
---


The `base64encode` function encodes a string into a Base64-encoded string. This is useful for passing data in a URL or in other situations where you need to transmit data that might otherwise be corrupted.

### Arguments

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | Yes | The string to be encoded. |
| 2 | String | No | The character encoding to use. Valid values are `ASCII`, `UTF-7`, `UTF-8`, `UTF-16`, and `UTF-32`. The default is `UTF-8`. |

> NOTE: The `base64encode` function is only available in emails, landing pages, and SMS messages.

### Example 1: Basic Use

This example shows how to encode a simple string.

```html
%%[

/* Set the string to be encoded */
var @string
set @string = "Hello, World!"

/* Encode the string */
var @encodedString
set @encodedString = base64encode(@string)

]%%

<p>The encoded string is: %%=v(@encodedString)=%%</p>
```

### Example 2: Advanced Scenario

This example shows how to encode a URL parameter.

```html
%%[

/* Set the email address to be encoded */
var @email
set @email = AttributeValue("emailAddr")

/* Encode the email address */
var @encodedEmail
if not empty(@email) then
    set @encodedEmail = base64encode(@email)
endif

]%%

<a href="%%=RedirectTo(Concat('https://example.com?email=', @encodedEmail))=%%">Click here</a>
```
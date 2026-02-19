---
title: "Now"
---


The `Now()` function returns the current system date and time of the Salesforce Marketing Cloud server. The timestamp is based on Central Standard Time (CST) and does not account for daylight saving time adjustments.

### Arguments

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | Boolean | No | A value of `true` preserves the email send time, while `false` (the default) returns the current system time. |

> NOTE: When used in an email, `Now()` without a parameter or with the parameter set to `false` will display the time the email is opened. To display the send time, you must pass `true` as the first parameter.

### Example 1: Basic Use

This example demonstrates how to retrieve and display the current server time.

```html
%%[

/*
  This block retrieves the current server time using the Now() function
  and formats it for display.
*/

VAR @currentTime
SET @currentTime = Now()

]%%

Current Server Time: %%=FormatDate(@currentTime, "YYYY-MM-DD hh:mm:ss tt")=%%
```

### Example 2: Preserving Send Time in Emails

This example shows how to capture and display the exact time an email was sent, rather than when it was opened.

```html
%%[

/*
  This block captures the email send time by passing 'true' to the Now() function.
  This is useful for creating a timestamp that does not change each time the email is opened.
*/

VAR @sendTime
SET @sendTime = Now(true)

IF NOT EMPTY(@sendTime) THEN
  SET @formattedSendTime = FormatDate(@sendTime, "MMMM d, YYYY, h:mm tt")
ELSE
  SET @formattedSendTime = "Time not available"
ENDIF

]%%

This email was sent at: %%=v(@formattedSendTime)=%%
```
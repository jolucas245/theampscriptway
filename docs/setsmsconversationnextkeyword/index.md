---
title: "SetSmsConversationNextKeyword"
---


This function will set the keyword for the next message in a conversation. It does not create a new conversation. Rather, it sets the next conversation path similar to [CreateSmsConversation](/createsmsconversation), but for an existing conversation. The Next Keyword is set once the Contact replies to the message.

The function will return `true` if the next keyword is successfully set, or `false` if an exception occurs. The function can only be used in MobileConnect messages and will return `false` if used in a different application context, for example in Email Studio or CloudPages.

### Arguments

`SetSmsConversationNextKeyword(1,2,3)`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | Number | True | Short code or long code used by MobileConnect |
| 2 | Number | True | Contact’s mobile number with country code prefix |
| 3 | String | True | Keyword to use for Next Keyword function |

> NOTE: This function cannot be used in conversation-based templates such as Double Opt-In, Vote/Survey or Info Capture messages.

### Example

A message template includes the following code that is used in a Text Response message within an existing conversation:

```html
%%[

var @discountAmount, @nextKeyword
set @discountAmount = Lookup("SMS Offers", "Percent Discount", "Mobile Number", MOBILE_NUMBER)
set @nextKeyword = Concat(@offer,"PERCENT")

SetSmsConversationNextKeyword(61401123456, MOBILE_NUMBER, @nextKeyword)

]%%
Reply with your email address to receive %%=v(@discountAmount)=%%% percent off your next purchase.
```

The `@discountAmount` variable returns a number based on a value in the Data Extension. A matching keyword has been created for each discount; for example `10PERCENT`, `20PERCENT` and `50PERCENT`. These keywords are assigned to other Text Response messages.

#### Output

For a `@discountAmount` value of `20`, a Contact will receive the message below and the Next Keyword will be set as `20PERCENT` when they reply to the message.

```html
Reply with your email address to receive 20% off your next purchase.
```
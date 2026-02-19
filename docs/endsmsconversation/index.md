---
title: "EndSmsConversation"
---


This function will end an active conversation-based on a given short or long code and a Contact’s mobile number. Once a conversation ends, it will allow the Contact to send other MO messages related to the short or long code, otherwise the Contact will remain in the conversation until it ends, either by reaching a message template without a Next Keyword, or being ejected from the conversation by this function.

The function will return `true` if the conversation successfully ends, or `false` if an exception occurs. The function can only be used in MobileConnect messages and will return `false` if used in a different application context, for example in Email Studio or CloudPages.

### Arguments

`EndSmsConversation(1,2)`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | Number | True | Short code or long code used by MobileConnect |
| 2 | Number | True | Contact’s mobile number with country code prefix |

> NOTE: This function cannot be used in conversation-based templates such as Double Opt-In, Vote/Survey or Info Capture messages.

### Example

A conversation is created from a series of SMS messages with Next Keywords, as per the table below.

| Message Name | Message Type | Keyword | Next Keyword |
| --- | --- | --- | --- |
| Outbound Offer | Outbound |  | `RESPONSE1` |
| Response 1 | Text Response | `RESPONSE1` | `RESPONSE2` |
| Response 2 | Text Response | `RESPONSE2` | `RESPONSE3` |
| Response 3 | Text Response | `RESPONSE3` |  |

A Contact then responds `No` to the ‘Outbound Offer’ message and receives the ‘Response 1’ message.

This message contains the following code:

```html
%%[

var @response
set @response = [MSG(0).NOUNS]

if IndexOf(@response,"no") > 0 then

  EndSMSConversation(61401123456, MOBILE_NUMBER)

]%%
Thank you for participating in this survey.
%%[ else ]%%
Please reply with your first name.
%%[ endif ]%%
```

#### Output

The reply is interpreted by the ‘Response 1’ message and as the response contains the word ‘no’ (which is evaluated as case-insensitive by the [IndexOf](/indexof) function), the Contact receives the message below and they are ejected from the conversation.

```html
Thank you for participating in this survey.
```
---
title: "Mobileconnect Functions"
---


### Description
MobileConnect Functions in AMPscript are a set of functions designed to facilitate SMS conversations within Salesforce Marketing Cloud's MobileConnect. These functions enable the creation and management of message chains, allowing for interactive communication with subscribers via SMS. They are crucial for building conversational experiences where a subscriber's response can trigger subsequent messages, often by prefixing a 'Next Keyword' to their reply.

### Arguments
MobileConnect Functions represent a category of AMPscript functions rather than a single function. Therefore, this category itself does not have direct arguments. Individual functions within this category, such as `CreateSmsConversation`, `EndSmsConversation`, and `SetSmsConversationNextKeyword`, each have their own specific arguments.

| Ordinal | Type | Required | Description |
|---|---|---|---|
| 1 | String | Yes | The phone number (short code or long code) used in MobileConnect. |
| 2 | String | Yes | The contact’s phone number, including the country code. |
| 3 | String | Yes | The string to set as the next conversation keyword. |
| 4 | String | Yes | The application used in the conversation. Must be `MOBILECONNECT`. |
### Notes
> NOTE: By default, an SMS conversation remains open for 60 minutes after an outbound message is sent or a message is received from a Contact. This duration can be adjusted by contacting Salesforce Marketing Cloud Support.

### Example 1: Basic Use - CreateSmsConversation

This example demonstrates how to initiate an SMS conversation using `CreateSmsConversation`.

```html
%%[
    VAR @originationNumber, @destinationNumber, @nextKeyword, @app, @result

    SET @originationNumber = "12345" /* Replace with your short code or long code */
    SET @destinationNumber = "14155551234" /* Replace with the subscriber's phone number */
    SET @nextKeyword = "ORDERCONFIRM" /* The keyword for the next message in the conversation */
    SET @app = "MOBILECONNECT"

    /* Check if the conversation can be created */
    IF NOT EMPTY(@originationNumber) AND NOT EMPTY(@destinationNumber) AND NOT EMPTY(@nextKeyword) AND NOT EMPTY(@app) THEN
        SET @result = CreateSmsConversation(@originationNumber, @destinationNumber, @nextKeyword, @app)

        IF @result == true THEN
            /* Conversation initiated successfully */
            OutputLine(Concat("SMS conversation initiated with ", @destinationNumber, ". Next keyword: ", @nextKeyword))
        ELSE
            /* Handle potential errors, though the function typically returns true or throws an exception */
            OutputLine(Concat("Failed to initiate SMS conversation with ", @destinationNumber))
        ENDIF
    ELSE
        OutputLine("One or more required parameters are empty for CreateSmsConversation.")
    ENDIF
]%%
```

### Example 2: Advanced Scenario - EndSmsConversation

This example demonstrates how to end an active SMS conversation using `EndSmsConversation`.

```html
%%[
    VAR @originationNumber, @destinationNumber, @result

    SET @originationNumber = "12345" /* Replace with your short code or long code */
    SET @destinationNumber = "14155551234" /* Replace with the subscriber's phone number */

    /* Check if the required parameters are not empty */
    IF NOT EMPTY(@originationNumber) AND NOT EMPTY(@destinationNumber) THEN
        SET @result = EndSmsConversation(@originationNumber, @destinationNumber)

        IF @result == true THEN
            /* Conversation ended successfully */
            OutputLine(Concat("SMS conversation with ", @destinationNumber, " ended."))
        ELSE
            /* Handle potential errors, though the function typically returns true or throws an exception */
            OutputLine(Concat("Failed to end SMS conversation with ", @destinationNumber))
        ENDIF
    ELSE
        OutputLine("One or both required parameters are empty for EndSmsConversation.")
    ENDIF
]%%
```

### Example 3: Advanced Scenario - SetSmsConversationNextKeyword

This example demonstrates how to set the next keyword in an active SMS conversation using `SetSmsConversationNextKeyword`.

```html
%%[
    VAR @originationNumber, @destinationNumber, @newKeyword, @result

    SET @originationNumber = "12345" /* Replace with your short code or long code */
    SET @destinationNumber = "14155551234" /* Replace with the subscriber's phone number */
    SET @newKeyword = "SUPPORT" /* The new keyword for the next message in the conversation */

    /* Check if the required parameters are not empty */
    IF NOT EMPTY(@originationNumber) AND NOT EMPTY(@destinationNumber) AND NOT EMPTY(@newKeyword) THEN
        SET @result = SetSmsConversationNextKeyword(@originationNumber, @destinationNumber, @newKeyword)

        IF @result == true THEN
            /* Next keyword set successfully */
            OutputLine(Concat("Next keyword for conversation with ", @destinationNumber, ". New keyword: ", @newKeyword))
        ELSE
            /* Handle potential errors, though the function typically returns true or throws an exception */
            OutputLine(Concat("Failed to set next keyword for conversation with ", @destinationNumber))
        ENDIF
    ELSE
        OutputLine("One or more required parameters are empty for SetSmsConversationNextKeyword.")
    ENDIF
]%%
```
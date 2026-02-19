--- 
title: "CreateSmsConversation"
---


Creates an SMS conversation with a contact. This function is intended for use within MobileConnect.

> NOTE: You can’t use this function with conversation-based templates, including Double Opt-In and Info Capture templates.

### Arguments

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | True | The phone number (such as a short code or long code) used in MobileConnect. |
| 2 | String | True | The contact’s phone number, including the country code. |
| 3 | String | True | The string to set as the next conversation keyword. |
| 4 | String | True | The application used in the conversation. Specify `MOBILECONNECT` for this parameter. Any other value results in an error. |

### Example 1: Basic Use

This example demonstrates how to initiate a conversation with a user.

```html
%%[

  /* Set variables for the function */
  VAR @originationNumber, @destinationNumber, @nextKeyword, @app
  SET @originationNumber = "727272" /* Your short code */
  SET @destinationNumber = "15554443333" /* User's mobile number */
  SET @nextKeyword = "NEXT_KEYWORD"
  SET @app = "MOBILECONNECT"

  /* Check if all required variables are set */
  IF NOT EMPTY(@originationNumber) AND NOT EMPTY(@destinationNumber) AND NOT EMPTY(@nextKeyword) THEN

    /* Create the SMS conversation */
    CreateSmsConversation(@originationNumber, @destinationNumber, @nextKeyword, @app)

  ENDIF

]%%
```

### Example 2: Advanced Scenario

This example shows how to dynamically set the next keyword based on user attributes.

```html
%%[

  /* Assume we have a data extension with user preferences */
  VAR @userId, @userPreference, @nextKeyword
  SET @userId = AttributeValue("userId")

  IF NOT EMPTY(@userId) THEN
    SET @userPreference = LOOKUP("UserPreferences", "Preference", "UserId", @userId)
  ENDIF

  /* Set the next keyword based on the user's preference */
  IF @userPreference == "SPORTS" THEN
    SET @nextKeyword = "SPORTS_UPDATE"
  ELSEIF @userPreference == "NEWS" THEN
    SET @nextKeyword = "NEWS_UPDATE"
  ELSE
    SET @nextKeyword = "DEFAULT_KEYWORD"
  ENDIF

  /* Set other variables */
  VAR @originationNumber, @destinationNumber, @app
  SET @originationNumber = "727272" /* Your short code */
  SET @destinationNumber = AttributeValue("mobileNumber") /* Get mobile from sending context */
  SET @app = "MOBILECONNECT"

  /* Create the conversation if the destination number is available */
  IF NOT EMPTY(@destinationNumber) THEN
    CreateSmsConversation(@originationNumber, @destinationNumber, @nextKeyword, @app)
  ENDIF

]%%
```
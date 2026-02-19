---
title: "Mobileconnect Contact Data Strings"
---


This documentation describes the **MobileConnect Contact Data Strings**, which are personalization strings used in Salesforce Marketing Cloud to access demographic and behavioral data associated with a mobile subscriber within MobileConnect. These strings allow for dynamic content personalization in SMS messages and other MobileConnect interactions.

### Arguments

These are not function arguments in the traditional sense, but rather system-defined personalization strings that can be directly referenced in AMPscript to retrieve specific contact data. They do not require explicit passing of parameters.

| Ordinal | Type | Required | Description |
|---|---|---|---|
| N/A | Personalization String | No | `_CarrierID`: The ID of the mobile carrier for the contact. |
| N/A | Personalization String | No | `_Channel`: The channel through which the contact interacts (e.g., `Mobile`). |
| N/A | Personalization String | No | `_City`: The city associated with the contact's mobile number. |
| N/A | Personalization String | No | `_ContactID`: The unique identifier for the contact in Marketing Cloud. |
| N/A | Personalization String | No | `_CountryCode`: The country code associated with the contact's mobile number (e.g., `US`). |
| N/A | Personalization String | No | `_CreatedBy`: The ID of the entity that created the contact record. |
| N/A | Personalization String | No | `_CreatedDate`: The date and time when the contact record was created. |
| N/A | Personalization String | No | `_FirstName`: The first name of the contact. |
| N/A | Personalization String | No | `_IsHonorDST`: Indicates if the contact's time zone observes Daylight Saving Time (`True` or `False`). |
| N/A | Personalization String | No | `_LastName`: The last name of the contact. |
| N/A | Personalization String | No | `_MobileNumber`: The mobile number of the contact. |
| N/A | Personalization String | No | `_ModifiedBy`: The ID of the entity that last modified the contact record. |
| N/A | Personalization String | No | `_ModifiedDate`: The date and time when the contact record was last modified. |
| N/A | Personalization String | No | `_Priority`: The priority assigned for sending messages to the contact. |
| N/A | Personalization String | No | `_Source`: The source from which the contact information was obtained (e.g., `Mobile Opt-in`). |
| N/A | Personalization String | No | `_SourceObjectID`: The internal unique ID of the contact's source. |
| N/A | Personalization String | No | `_State`: The state associated with the contact's mobile number. |
| N/A | Personalization String | No | `_Status`: The send status of the contact (e.g., `-1` Unspecified, `1` Active, `2` Bounced, `3` Held, `4` Unsubscribed). |
| N/A | Personalization String | No | `_UTCOffset`: The UTC offset in hours for the contact's time zone. |
| N/A | Personalization String | No | `_ZipCode`: The zip code associated with the contact's mobile number. |

> NOTE: The `_CarrierID` field values have been reported to be inconsistent or incorrect in some instances. It is recommended to use this field with caution and validate its output if critical to your use case.

### Example 1: Basic Use

This example demonstrates how to retrieve and display basic contact information within an SMS message using MobileConnect Contact Data Strings.

```html
%%[ /* Start AMPscript block */
    /* Declare variables for defensive coding */
    VAR @firstName, @mobileNumber, @city

    /* Retrieve personalization string values */
    SET @firstName = _FirstName
    SET @mobileNumber = _MobileNumber
    SET @city = _City

    /* Check if values are not empty before displaying */
    IF NOT EMPTY(@firstName) THEN
        Output(Concat("Hello ", @firstName, ", "))
    ENDIF

    IF NOT EMPTY(@city) THEN
        Output(Concat("We see you're in ", @city, ". "))
    ENDIF

    IF NOT EMPTY(@mobileNumber) THEN
        Output(Concat("Your mobile number is ", @mobileNumber, "."))
    ENDIF

    /* Fallback message if no data is available */
    IF EMPTY(@firstName) AND EMPTY(@city) AND EMPTY(@mobileNumber) THEN
        Output("Hello! We couldn't retrieve your contact details at this time.")
    ENDIF
]%%
```

### Example 2: Advanced Scenario - Conditional Messaging Based on Status

This example shows how to use the `_Status` personalization string to send a conditional message based on the subscriber's status in MobileConnect. This can be useful for re-engagement campaigns or status updates.

```html
%%[ /* Start AMPscript block */
    /* Declare variable for defensive coding */
    VAR @status, @message

    /* Retrieve the subscriber's status */
    SET @status = _Status

    /* Determine message based on status */
    IF NOT EMPTY(@status) THEN
        IF @status == 1 THEN
            SET @message = "Great news! Your subscription is active. Stay tuned for updates!"
        ELSEIF @status == 4 THEN
            SET @message = "It looks like you've unsubscribed. Reply START to resubscribe and receive our latest offers."
        ELSEIF @status == 2 THEN
            SET @message = "We noticed an issue with your last message. Please check your device settings."
        ELSE
            SET @message = "We're unable to determine your subscription status at this moment. Please contact support."
        ENDIF
    ELSE
        SET @message = "Unable to retrieve your subscription status. Please contact support for assistance."
    ENDIF

    /* Output the determined message */
    Output(@message)
]%%
```
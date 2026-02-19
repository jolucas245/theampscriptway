---
title: "Attribute Strings"
---


The `AttributeValue()` function returns the value of an attribute associated with a Contact or Subscriber within Salesforce Marketing Cloud. This function dynamically retrieves values from various data sources, including email subscriber profiles, data extension fields, Journey Builder entry source attributes, and MobilePush attributes. It is a robust alternative to directly referencing attributes, as it gracefully returns `null` if the specified attribute is not found in the current data context, thereby preventing errors that might occur with direct attribute references.

### Arguments

| Ordinal | Type   | Required | Description                                  |
| ------- | ------ | -------- | -------------------------------------------- |
| 1       | String | True     | The name of the attribute to retrieve the value of. |

> NOTE: The `AttributeValue()` function is designed to return `null` if the requested attribute is not present in the current data context. This behavior is beneficial for handling varying data schemas and preventing script execution errors.

### Example 1: Basic Use

This example demonstrates how to retrieve and display a subscriber's `RewardTierPoints` attribute. It includes defensive coding to handle cases where the attribute might be empty or not found.

```html
%%[
VAR @rewardTierPoints, @rewardTierMessage

/* Retrieve the value of the 'RewardTierPoints' attribute */
SET @rewardTierPoints = AttributeValue("RewardTierPoints")

/* Check if the attribute value is not empty before constructing the message */
IF NOT EMPTY(@rewardTierPoints) THEN
    SET @rewardTierMessage = CONCAT("You currently have ", @rewardTierPoints, " reward tier points.")
ELSE
    /* Provide a default message if the attribute is empty or not found */
    SET @rewardTierMessage = "No reward tier points found for your account."
ENDIF
]%%

<p>Hello Subscriber,</p>
<p>%%=v(@rewardTierMessage)=%%</p>
```

### Example 2: Handling a Missing First Name Attribute

This example illustrates how to use `AttributeValue()` to retrieve a subscriber's first name and provide a fallback if the attribute is missing or empty. This prevents errors and ensures a personalized greeting.

```html
%%[
VAR @firstName, @greetingName

/* Attempt to retrieve the 'FirstName' attribute */
SET @firstName = AttributeValue("FirstName")

/* Check if the 'FirstName' attribute is not empty */
IF NOT EMPTY(@firstName) THEN
    SET @greetingName = @firstName
ELSE
    /* Use a generic greeting if 'FirstName' is empty or null */
    SET @greetingName = "Friend"
ENDIF
]%%

<p>Dear %%=v(@greetingName)=%%,</p>
<p>We have an exclusive offer just for you!</p>
```
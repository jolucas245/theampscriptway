---
title: "AttributeValue"
---


Returns the value of an attribute. The function determines this value using data sources related to the Contact or Subscriber that the message is sent to. These sources include email subscriber profiles, data extension fields, journey entry source attributes, and MobilePush attributes.

This function is a better option than making a direct reference to the attribute because it returns `null` if no data is found.

### Arguments

| Ordinal | Type   | Required | Description                                  |
| :------ | :----- | :------- | :------------------------------------------- |
| 1       | String | Yes      | The name of the attribute to return the value of. |

> NOTE: This function is context-sensitive and retrieves values based on the current subscriber or contact context. It is commonly used in email, SMS, and push messages.

### Example 1: Basic Use

This example retrieves the value of a `FirstName` attribute, which could be from a Data Extension or Subscriber Profile.

```html
%%[
    VAR @firstName
    SET @firstName = AttributeValue("FirstName")

    /* Check if the attribute value is not empty before using it */
    IF NOT EMPTY(@firstName) THEN
]%%
    Hello, %%=v(@firstName)=%%!
%%[
    ELSE
]%%
    Hello, Subscriber!
%%[
    ENDIF
]%%
```

### Example 2: Advanced Scenario with Default Value

This example demonstrates how to retrieve a `RewardTierPoints` attribute and provide a default value if it's not found or is empty, ensuring a fallback for personalization.

```html
%%[
    VAR @rewardPoints
    VAR @displayPoints

    /* Retrieve the RewardTierPoints attribute value */
    SET @rewardPoints = AttributeValue("RewardTierPoints")

    /* Set a default value if the attribute is empty or null */
    IF NOT EMPTY(@rewardPoints) THEN
        SET @displayPoints = @rewardPoints
    ELSE
        SET @displayPoints = "0"
    ENDIF
]%%

Your current reward points: %%=v(@displayPoints)=%%.

%%[
    /* Additional logic can be added here, for example, to display different messages based on points */
    IF @displayPoints > 100 THEN
]%%
    You're a VIP member!
%%[
    ELSEIF @displayPoints > 50 THEN
]%%
    Keep earning to reach VIP status!
%%[
    ENDIF
]%%
```
---
title: "Comparison Operators"
---


Comparison operators in AMPscript are used to evaluate conditions by comparing two values, resulting in a Boolean outcome (true or false). These operators are fundamental for implementing conditional logic within your Salesforce Marketing Cloud content, enabling dynamic personalization based on data.

### Arguments

| Ordinal | Type | Required | Description |
|---|---|---|---|
| 1 | Any | Yes | The first value or operand to be compared. |
| 2 | Any | Yes | The second value or operand to be compared. |

> NOTE: Comparison operators are case-insensitive when comparing string values.

### Example 1: Basic Use

This example demonstrates the basic use of comparison operators to personalize a message based on a subscriber's `MembershipLevel`.

```html
%%[
    VAR @membershipLevel, @message
    SET @membershipLevel = AttributeValue("MembershipLevel") /* Retrieve MembershipLevel from data extension */

    IF NOT EMPTY(@membershipLevel) THEN
        IF @membershipLevel == "Gold" THEN
            SET @message = "Thank you for being a valued Gold member!"
        ELSEIF @membershipLevel != "Bronze" THEN
            SET @message = "Upgrade to Gold for exclusive benefits!"
        ELSE
            SET @message = "Enjoy your Bronze membership."
        ENDIF
    ELSE
        SET @message = "Join our membership program today!"
    ENDIF
]%%


<p>%%=v(@message)=%%</p>
```

### Example 2: Advanced Scenario

This example illustrates a more advanced scenario where multiple comparison operators are combined with logical operators (`AND`, `OR`) to determine eligibility for a special offer based on `PurchaseHistory` and `LastLoginDate`.

```html
%%[
    VAR @purchaseHistory, @lastLoginDate, @eligibleForOffer
    SET @purchaseHistory = AttributeValue("PurchaseHistory") /* Numeric value representing total purchases */
    SET @lastLoginDate = AttributeValue("LastLoginDate") /* Date value of last login */

    /* Set a threshold for recent activity (e.g., last 30 days) */
    VAR @thirtyDaysAgo
    SET @thirtyDaysAgo = DateAdd(Now(), -30, "D")

    SET @eligibleForOffer = FALSE

    IF NOT EMPTY(@purchaseHistory) AND NOT EMPTY(@lastLoginDate) THEN
        /* Check if purchase history is greater than or equal to 500 AND last login was within the last 30 days */
        IF @purchaseHistory >= 500 AND @lastLoginDate > @thirtyDaysAgo THEN
            SET @eligibleForOffer = TRUE
        ENDIF
    ENDIF

    IF @eligibleForOffer == TRUE THEN
        /* Display special offer content */
        SET @message = "Congratulations! You qualify for our exclusive offer!"
    ELSE
        SET @message = "Explore our latest products."
    ENDIF
]%%


<p>%%=v(@message)=%%</p>
```
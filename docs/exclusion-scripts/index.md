---
title: "Exclusion Scripts"
---


**Description:**

Exclusion scripts in Salesforce Marketing Cloud provide a mechanism to conditionally prevent subscribers from receiving an email during a send process. Unlike traditional AMPscript functions that return a value for direct use within content, `exclusion-scripts` is a dedicated section within email activities (such as those in Journey Builder, Triggered Sends, or User-Initiated Sends) where AMPscript code is executed. If the AMPscript within this section evaluates to `true` (or a non-zero value), the current subscriber is excluded from the email send. If it evaluates to `false` (or zero), the subscriber will receive the email.

This feature is particularly useful for dynamic exclusion criteria that cannot be met by standard suppression lists or send filters, allowing for highly granular control over who receives an email.

### Arguments

| Ordinal | Type | Required | Description |
|---|---|---|---|
| N/A | N/A | N/A | The `exclusion-scripts` section does not accept direct arguments. Instead, it executes AMPscript code that must evaluate to a boolean result. |

> NOTE: Exclusion scripts are evaluated at the time of send for each individual subscriber. Therefore, complex logic or lookups against large data extensions can impact send performance. It is best practice to pre-filter audiences where possible or use suppression lists for static exclusion criteria.

> NOTE: To access Journey Data within an exclusion script, use the `AttributeValue()` function. `Personalization Strings` can access subscriber data already in All Subscribers but cannot access Journey Data within an exclusion script context.

> NOTE: If the Exclusion Script option is not visible in your Email Activity, contact Salesforce Marketing Cloud Support to enable this feature for your account.

### Example 1: Basic Use - Excluding Subscribers from a Specific Data Extension

This example demonstrates how to exclude subscribers whose email addresses are found in a designated exclusion data extension. This is a common scenario for preventing sends to unsubscribed or otherwise ineligible contacts.

```html
/*
  Check if the current subscriber's email address exists in a specific exclusion data extension.
  If found, the script evaluates to true, and the subscriber is excluded.
*/

VAR @emailAddress
SET @emailAddress = AttributeValue("EmailAddress") /* Safely retrieve the subscriber's email address */

IF NOT EMPTY(@emailAddress) THEN
    /* Perform a lookup to see if the email exists in the exclusion DE */
    VAR @rowCount
    SET @rowCount = ROWCOUNT(LOOKUPROWS("Exclusion_List_DE", "Email", @emailAddress))

    IF @rowCount > 0 THEN
        /* Email found in exclusion list, so exclude the subscriber */
        OUTPUT(True)
    ELSE
        /* Email not found, allow the send */
        OUTPUT(False)
    ENDIF
ELSE
    /* If email address is empty, default to not excluding (or handle as per business rule) */
    OUTPUT(False)
ENDIF
```

### Example 2: Advanced Scenario - Excluding Based on Multiple Conditions and Journey Data

This example shows how to exclude subscribers based on a combination of factors: if they are already active in another journey (using Journey Data) OR if their status in a separate data extension is 'Inactive'.

```html
/*
  This script excludes subscribers based on two conditions:
  1. If they are currently active in another specific journey (using Journey Data).
  2. If their status in a 'Customer_Status_DE' is 'Inactive'.

  The script will evaluate to true if either condition is met, leading to exclusion.
*/

VAR @isAlreadyInJourney, @customerStatus, @excludeSubscriber
SET @excludeSubscriber = False /* Initialize exclusion flag to false */

/* Condition 1: Check if subscriber is active in another journey */
/* Assuming 'JourneyStatus' is a field in the Journey Data Extension for the current journey */
SET @isAlreadyInJourney = AttributeValue("IsActiveInOtherJourney") /* Example: Boolean field from Journey Data */

IF NOT EMPTY(@isAlreadyInJourney) AND @isAlreadyInJourney == True THEN
    SET @excludeSubscriber = True
ENDIF

/* Condition 2: Check customer status from a separate data extension */
IF @excludeSubscriber == False THEN /* Only check if not already marked for exclusion */
    VAR @subscriberKey
    SET @subscriberKey = AttributeValue("SubscriberKey") /* Get SubscriberKey from Journey Data */

    IF NOT EMPTY(@subscriberKey) THEN
        SET @customerStatus = LOOKUP("Customer_Status_DE", "Status", "SubscriberKey", @subscriberKey)

        IF NOT EMPTY(@customerStatus) AND @customerStatus == "Inactive" THEN
            SET @excludeSubscriber = True
        ENDIF
    ENDIF
ENDIF

/* Output the final exclusion decision */
OUTPUT(@excludeSubscriber)
```
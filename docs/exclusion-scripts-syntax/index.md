---
title: "Exclusion Scripts: Syntax"
---


Exclusion scripts in Salesforce Marketing Cloud provide a powerful mechanism to prevent specific subscribers from receiving an email during a send. This is achieved by embedding AMPscript expressions within a dedicated section of the email send definition. If the AMPscript within this section evaluates to `true` (or a boolean equivalent of `1`), the subscriber will be excluded from the send. This allows for dynamic and conditional suppression of emails based on various criteria, such as data extension values, subscriber attributes, or other business logic.

### Arguments

Exclusion scripts do not accept arguments in the traditional sense of a function. Instead, this section is used to house AMPscript expressions that determine exclusion logic.

> NOTE: Exclusion scripts are evaluated for each subscriber individually at the time of send. They are available in various send contexts, including Email Studio sends, Journey Builder email activities, and Triggered Sends.

### Example 1: Basic Use - Exclude subscribers based on a Data Extension field
```html
/*
  This example demonstrates how to exclude subscribers if their 'OptOut' field
  in the sending Data Extension is set to 'true' or '1'.
*/
VAR @optOutStatus
SET @optOutStatus = Lookup("MySendingDE", "OptOut", "SubscriberKey", _subscriberkey)

IF NOT EMPTY(@optOutStatus) THEN
    IF @optOutStatus == "true" OR @optOutStatus == "1" THEN
        /* Exclude the subscriber */
        Output(true)
    ELSE
        /* Do not exclude the subscriber */
        Output(false)
    ENDIF
ELSE
    /* If the field is empty, do not exclude by default */
    Output(false)
ENDIF
```

### Example 2: Advanced Scenario - Exclude subscribers based on multiple conditions and date
```html
/*
  This example shows how to exclude subscribers who have already received a specific promotion
  within the last 30 days AND are part of a 'DoNotContact' group.
*/
VAR @lastPromotionDate, @doNotContact, @isExcluded
SET @isExcluded = false /* Initialize exclusion status */

/* Look up last promotion date from a separate Data Extension */
SET @lastPromotionDate = Lookup("PromotionHistoryDE", "LastPromotionDate", "SubscriberKey", _subscriberkey)

/* Look up Do Not Contact status */
SET @doNotContact = Lookup("SubscriberPreferencesDE", "DoNotContact", "SubscriberKey", _subscriberkey)

IF NOT EMPTY(@lastPromotionDate) AND NOT EMPTY(@doNotContact) THEN
    VAR @currentDate, @daysSincePromotion
    SET @currentDate = Now()
    SET @daysSincePromotion = DateDiff(@lastPromotionDate, @currentDate, "D")

    IF @daysSincePromotion < 30 AND (@doNotContact == "true" OR @doNotContact == "1") THEN
        SET @isExcluded = true
    ENDIF
ENDIF

/* Output the final exclusion decision */
Output(@isExcluded)
```
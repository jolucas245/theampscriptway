---
title: "Best Practice: Raiseerror"
---

## best-practices-raiseerror

The `RaiseError` function in AMPscript is a critical utility for implementing robust error handling within Salesforce Marketing Cloud email sends, landing pages, and other AMPscript-enabled contexts. It allows developers to proactively manage unexpected conditions or invalid data by either suppressing an individual subscriber's send, canceling an entire send job, or displaying a custom error message. This function is particularly useful for ensuring data integrity and preventing the delivery of incomplete or erroneous content to subscribers.

### Arguments

| Ordinal | Type | Required | Description |
|---|---|---|---|
| 1 | String | Yes | The error message to be displayed. This message will be logged in the send-time error log. |
| 2 | Boolean | No | A boolean value indicating whether to skip the current subscriber (true) or stop the entire send job (false). If not provided, the default value is false. |

> **NOTE:** When used in a landing page or microsite, this function will stop the page from loading and display the error message. When used in an email, the behavior depends on the second parameter.

### Example 1: Basic Use - Skipping a Subscriber

This example demonstrates how to use `RaiseError` to skip sending an email to a subscriber if their first name is not available in the data extension. This prevents sending emails with a generic or empty salutation.

```html
%%[

VAR @firstName
SET @firstName = AttributeValue("FirstName") /* Assumes FirstName is a column in the sending Data Extension */

IF Empty(@firstName) THEN
  /* If FirstName is empty, raise an error and skip this subscriber */
  RaiseError("First name is missing, skipping subscriber.", true)
ELSE
  /* Proceed with email personalization */
  SET @greeting = Concat("Hi ", @firstName, ",")
ENDIF

]%%

Hi %%=v(@firstName)=%%,

This is the body of your personalized email.
```

### Example 2: Advanced Scenario - Halting a Send Job

In this scenario, we check for a critical condition that affects the entire send, such as a missing or invalid campaign-wide discount code. If the condition is met, the entire send job is aborted to prevent sending out incorrect or incomplete information to all subscribers.

```html
%%[

VAR @promoCode
SET @promoCode = AttributeValue("CampaignPromoCode") /* This could be from a Data Extension or another source */

IF Empty(@promoCode) THEN
  /* If the promo code is missing, halt the entire email send. */
  RaiseError("Campaign promo code is not set. Aborting send.", false)
ENDIF

]%%

Here is your special offer! Use promo code **%%=v(@promoCode)=%%** to get 20% off.```

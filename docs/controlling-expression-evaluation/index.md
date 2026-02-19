---
title: "Controlling Expression Evaluation"
---


Controlling expression evaluation in AMPscript refers to the practice of using **parentheses `()`** to explicitly define the order in which logical and arithmetic operations are processed within an expression. This ensures that complex conditions or calculations are evaluated precisely as intended, preventing unexpected outcomes due to default operator precedence rules.

### Arguments

| Ordinal | Type | Required | Description |
|---|---|---|---|
| N/A | N/A | N/A | Controlling expression evaluation is a syntactic concept, not a function with formal arguments. Parentheses are used to group parts of an expression, dictating their evaluation order. |

> NOTE: Understanding operator precedence is crucial when not using parentheses. For instance, `AND` typically evaluates before `OR`. Using parentheses overrides this default behavior, ensuring clarity and correctness in complex logical statements.

### Example 1: Basic Use - Overriding Default Operator Precedence

This example demonstrates how parentheses can alter the outcome of a conditional statement by grouping logical operations. Without parentheses, `AND` takes precedence over `OR`.

```html
%%[
/* Declare variables for customer status and purchase amount */
VAR @statusTier, @amount, @freeShipping
SET @statusTier = "Bronze"
SET @amount = 300
SET @freeShipping = "false"

/* 
  Scenario: Offer free shipping to Bronze OR Silver members AND if amount > 500.
  Without parentheses, the expression `"Silver" AND @amount > 500` would be evaluated first.
  This would incorrectly grant free shipping to a Bronze member with amount 300.
*/
IF (@statusTier == "Bronze" OR @statusTier == "Silver") AND @amount > 500 THEN
    SET @freeShipping = "true"
ENDIF

/* Output the result */
]
<p>You %%=IIF(@freeShipping == "true", "qualify", "do not qualify")=%% for free shipping.</p>
```

### Example 2: Advanced Scenario - Combining Multiple Conditions for Dynamic Content

This example illustrates a more complex scenario where multiple conditions are combined using parentheses to control the display of dynamic content based on subscriber preferences and activity.

```html
%%[
/* Declare variables for subscriber data */
VAR @hasPremiumSubscription, @lastPurchaseDaysAgo, @isEmailVerified, @displaySpecialOffer
SET @hasPremiumSubscription = "true"
SET @lastPurchaseDaysAgo = 45
SET @isEmailVerified = "true"
SET @displaySpecialOffer = "false"

/* 
  Scenario: Display a special offer if:
  (Subscriber has premium subscription AND last purchase was within 30 days) OR
  (Subscriber does NOT have premium subscription AND email is verified AND last purchase was within 60 days)
*/
IF (@hasPremiumSubscription == "true" AND @lastPurchaseDaysAgo <= 30) OR \
   (@hasPremiumSubscription == "false" AND @isEmailVerified == "true" AND @lastPurchaseDaysAgo <= 60) THEN
    SET @displaySpecialOffer = "true"
ENDIF

/* Output dynamic content based on the evaluation */
]

%%[ IF @displaySpecialOffer == "true" THEN ]%%
    <p>Congratulations! As a valued customer, you qualify for a special limited-time offer. Click here to reveal your discount!</p>
%%[ ELSE ]%%
    <p>Stay tuned for more exciting offers and updates from us!</p>
%%[ ENDIF ]%%
```
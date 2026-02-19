---
title: "Best Practice: Modularization"
---

## Modularization

Modularization is the practice of breaking your AMPscript code into smaller, reusable content blocks rather than writing all logic in a single email or page. This approach improves readability, testability, and maintainability.

### Why Modularize?

Large AMPscript codebases embedded directly in emails become difficult to debug and update. By separating logic into Content Blocks in Content Builder, you can reuse components across multiple emails and update them from a single location.

### Example 1: Separating Header Logic into a Content Block

Create a Content Block (e.g., Customer Key: `module-header-logic`) that contains your data retrieval and variable setup:

```html
%%[
/* module-header-logic: Retrieves subscriber profile data */

VAR @firstName, @lastName, @loyaltyTier

SET @firstName = AttributeValue("FirstName")
SET @lastName = AttributeValue("LastName")
SET @loyaltyTier = Lookup("LoyaltyProgram", "Tier", "SubscriberKey", _subscriberKey)

IF EMPTY(@firstName) THEN
  SET @firstName = "Valued Customer"
ENDIF

IF EMPTY(@loyaltyTier) THEN
  SET @loyaltyTier = "Standard"
ENDIF

]%%
```

Then in your email, include it with a single line:

```html
%%=ContentBlockByKey("module-header-logic")=%%

<h1>Hello, %%=v(@firstName)=%% %%=v(@lastName)=%%!</h1>
<p>Your loyalty tier: %%=v(@loyaltyTier)=%%</p>
```

### Example 2: A Reusable Product Recommendation Module

This Content Block (Customer Key: `module-product-recs`) accepts a variable set by the calling email and renders a product recommendation table.

```html
%%[
/* module-product-recs: Displays product recommendations */
/* Expects @subscriberKey to be set by the calling email */

VAR @recs, @recCount, @i

SET @recs = LookupRows("ProductRecommendations", "SubscriberKey", @subscriberKey)
SET @recCount = RowCount(@recs)

IF @recCount > 0 THEN
]%%

<table role="presentation" width="100%" cellpadding="10" cellspacing="0">
  <tr><th>Product</th><th>Price</th></tr>
  %%[ FOR @i = 1 TO @recCount DO
    VAR @row, @productName, @price
    SET @row = Row(@recs, @i)
    SET @productName = Field(@row, "ProductName")
    SET @price = FormatCurrency(Field(@row, "Price"), "en-US")
  ]%%
  <tr>
    <td>%%=v(@productName)=%%</td>
    <td>%%=v(@price)=%%</td>
  </tr>
  %%[ NEXT @i ]%%
</table>

%%[ ELSE ]%%
<p>Check out our latest arrivals!</p>
%%[ ENDIF ]%%
```

> NOTE: Variables set in one Content Block are accessible in the calling email and other included Content Blocks because AMPscript variables are globally scoped. Use clear naming conventions (e.g., prefixing with the module name) to avoid variable collisions.

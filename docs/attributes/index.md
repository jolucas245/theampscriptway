---
title: "Attributes"
---


[Attribute Strings](/attribute-strings) and other [Personalization Strings](/personalization-strings-overview) can also be used with AMPscript. However, in this case, the double percentage delimiters (`%%`) should not be included.

If the Attribute includes a space character or hyphen, the string must be contained in brackets when used in an AMPscript function.

### Example 1: Basic Attribute References

In the example below, a Sendable Data Extension includes the fields `MemberID`, `First Name` and `Order-Amount`:

```html
%%[

VAR @memberID, @firstName, @orderAmount

/* MemberID has no spaces or hyphens, so no brackets needed */
SET @memberID = MemberID

/* 'First Name' has a space, so brackets are required */
SET @firstName = [First Name]

/* 'Order-Amount' has a hyphen, so brackets are required */
SET @orderAmount = [Order-Amount]

]%%

<p>Member: %%=v(@memberID)=%%</p>
<p>Hello, %%=v(@firstName)=%%!</p>
<p>Your order total: $%%=v(@orderAmount)=%%</p>
```

### Example 2: Using Attributes with Conditional Logic

This example demonstrates using attributes from a Sendable Data Extension inside conditional statements.

```html
%%[

VAR @loyaltyTier, @firstName, @discountMessage

SET @firstName = [First Name]
SET @loyaltyTier = [Loyalty Tier]

IF NOT EMPTY(@loyaltyTier) THEN
  IF @loyaltyTier == "Gold" THEN
    SET @discountMessage = "Enjoy 20% off as a Gold member!"
  ELSEIF @loyaltyTier == "Silver" THEN
    SET @discountMessage = "Enjoy 10% off as a Silver member!"
  ELSE
    SET @discountMessage = "Join our loyalty program for exclusive savings!"
  ENDIF
ELSE
  SET @discountMessage = "Sign up for our loyalty program today!"
ENDIF

]%%

<p>Hi %%=v(@firstName)=%%,</p>
<p>%%=v(@discountMessage)=%%</p>
```

> NOTE: It is a best practice to use the `AttributeValue()` function instead of directly referencing attribute names. `AttributeValue()` returns an empty string if the attribute does not exist, whereas a direct reference will throw an error. See the [AttributeValue](/attributevalue) documentation for details.

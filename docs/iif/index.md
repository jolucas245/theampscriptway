---
title: "IIF"
---


The `Iif()` function evaluates a given condition and returns one of two specified values based on whether the condition is true or false. It serves as a concise, inline alternative to a full `If...Then...Else...EndIf` block for simple conditional logic.

### Arguments

| Ordinal | Type   | Required | Description                                       |
|---------|--------|----------|---------------------------------------------------|
| 1       | Boolean | Yes      | The condition to be evaluated. This can be any function or expression that returns `true` or `false`. |
| 2       | String | Yes      | The value to return if the `condition` evaluates to `true`. |
| 3       | String | Yes      | The value to return if the `condition` evaluates to `false`. |

> NOTE: All arguments are required. Ensure that the condition evaluates to a boolean value.

### Example 1: Basic Use

This example demonstrates how to use `Iif()` to personalize a greeting based on whether a subscriber's first name is available. If the `FirstName` attribute is empty, a generic greeting is used; otherwise, the subscriber's first name is included.

```html
%%[
    /* Define a variable to hold the subscriber's first name. */
    VAR @firstName
    SET @firstName = AttributeValue("FirstName")

    /* Use Iif() to construct a personalized greeting. */
    VAR @greeting
    SET @greeting = Iif(NOT EMPTY(@firstName), CONCAT("Hello, ", @firstName, "!"), "Hello, valued customer!")

    /* Output the greeting. */
]
%% 
<p>%%=v(@greeting)=%%</p>
```

### Example 2: Advanced Scenario - Displaying Product Availability

This example uses `Iif()` to display different messages based on a product's stock quantity. It also includes defensive checks for null or non-numeric values.

```html
%%[
    /* Define variables for product name and stock quantity. */
    VAR @productName, @stockQuantity
    SET @productName = "Wireless Headphones"
    SET @stockQuantity = Lookup("ProductCatalog", "Stock", "ProductName", @productName)

    /* Ensure @stockQuantity is not empty and is a number before comparison. */
    VAR @displayMessage
    IF NOT EMPTY(@stockQuantity) AND ISNUMBER(@stockQuantity) THEN
        SET @stockQuantity = FormatNumber(@stockQuantity, "N0") /* Format as a whole number */
        SET @displayMessage = Iif(@stockQuantity > 0, CONCAT(@productName, " is in stock! (", @stockQuantity, " available)"), CONCAT(@productName, " is currently out of stock."))
    ELSE
        SET @displayMessage = CONCAT("Availability for ", @productName, " is unknown.")
    ENDIF

    /* Output the product availability message. */
]
%% 
<p>%%=v(@displayMessage)=%%</p>
```
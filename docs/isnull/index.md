---
title: "IsNull"
---


### Description
The `IsNull` AMPscript function evaluates whether a given variable or Data Extension field contains a null value. It returns `true` if the value is null, and `false` otherwise. This function is particularly useful for conditional logic based on the presence or absence of data, especially when dealing with Data Extension fields that may not have a value assigned.

### Arguments
| Ordinal | Type     | Required | Description                                                                 |
|---------|----------|----------|-----------------------------------------------------------------------------|
| 1       | Variable | Yes      | The variable or Data Extension field to be evaluated for a null value.      |

### Notes
> NOTE: The `IsNull` function is primarily designed and most reliable for checking null values in Data Extension fields. For evaluating whether a string variable is empty or contains no characters, it is generally recommended to use the `Empty()` function instead, as `IsNull` may not always behave as expected with non-Data Extension string variables.

### Example 1: Basic Use
This example demonstrates how to check if a Data Extension field named `FirstName` is null and display a default greeting if it is.
```html
/* Define a variable to hold the value from a Data Extension field. */
VAR @firstName
SET @firstName = AttributeValue("FirstName")

/* Check if @firstName is null using IsNull(). */
IF IsNull(@firstName) THEN
    /* If @firstName is null, display a default greeting. */
    SET @greeting = "Hello, Esteemed Customer!"
ELSE
    /* If @firstName is not null, use the actual first name. */
    SET @greeting = Concat("Hello, ", @firstName, "!")
ENDIF

/* Output the greeting. */
/* Output: Hello, Esteemed Customer! (if FirstName is null) */
/* Output: Hello, John! (if FirstName is 'John') */
%%=v(@greeting)=%%
```

### Example 2: Advanced Scenario - Conditional Content with Null and Empty Checks
This example shows how to handle both null Data Extension fields and potentially empty string variables to provide robust conditional content.
```html
/* Define variables for a Data Extension field and a content string. */
VAR @productName, @promoMessage
SET @productName = AttributeValue("ProductName")
SET @promoMessage = ""

/* Simulate setting a promo message based on some logic. */
/* In a real scenario, @promoMessage might come from another source or be dynamically generated. */
IF NOT IsNull(@productName) THEN
    IF NOT Empty(@productName) THEN
        SET @promoMessage = Concat("Special offer on ", @productName, " today!")
    ENDIF
ENDIF

/* Check if a valid promo message exists after all checks. */
IF NOT Empty(@promoMessage) THEN
    /* Display the promotional message if it's not empty. */
    /* Output: Special offer on Laptop today! (if ProductName is 'Laptop') */
    %%=v(@promoMessage)=%%
ELSE
    /* Display a general message if no specific promo is available. */
    /* Output: Check out our latest products! (if ProductName is null or empty) */
    %%=v(@promoMessage)=%%
    Check out our latest products!
ENDIF
```
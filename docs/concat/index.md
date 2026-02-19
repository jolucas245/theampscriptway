---
title: "Concat"
---


The `Concat` function in AMPscript is used to combine, or concatenate, two or more string values into a single string. This function is highly versatile and can accept an unlimited number of string arguments, appending each subsequent string to the end of the preceding one.

### Arguments

| Ordinal | Type   | Required | Description                                                              |
|---------|--------|----------|--------------------------------------------------------------------------|
| 1       | String | Yes      | The initial string value to which other strings will be appended.        |
| 2       | String | Yes      | The second string value to append to the first.                          |
| 3+      | String | No       | Additional string values to append. There is no practical limit to the number of strings you can concatenate. |

> NOTE: To include spaces or other delimiters between concatenated strings, you must explicitly include them as separate string arguments within the `Concat` function.

### Example 1: Basic Use

This example demonstrates the basic concatenation of first and last names to form a full name, including a space in between.

```html
%%[VAR @firstName, @lastName, @fullName

SET @firstName = "John"
SET @lastName = "Doe"

/* Concatenate first name, a space, and last name */
SET @fullName = Concat(@firstName, " ", @lastName)

IF NOT EMPTY(@fullName) THEN
    Output(Concat("Full Name: ", @fullName))
ELSE
    Output("Full Name could not be generated.")
END IF]
```

### Example 2: Advanced Scenario - Building a Dynamic URL

This example shows how to dynamically construct a URL using `Concat` with multiple variables and static string parts. It also includes defensive checks for empty variables.

```html
%%[VAR @baseURL, @productID, @category, @trackingID, @dynamicURL

SET @baseURL = "https://www.example.com/products/"
SET @productID = "12345"
SET @category = "electronics"
SET @trackingID = "abc-123"

/* Build the dynamic URL using Concat */
IF NOT EMPTY(@baseURL) AND NOT EMPTY(@productID) AND NOT EMPTY(@category) THEN
    SET @dynamicURL = Concat(@baseURL, @category, "/", @productID, "?tracking=", @trackingID)
    Output(Concat("Dynamic URL: ", @dynamicURL))
ELSE
    Output("Could not generate dynamic URL due to missing information.")
END IF]
```
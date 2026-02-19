---
title: "Trim"
---


The `Trim` function removes leading and trailing whitespace characters from a given string. This is particularly useful for cleaning up data that may have been imported with extraneous spaces, ensuring data consistency and proper display in emails or landing pages.

### Arguments

| Ordinal | Type   | Required | Description                                  |
|---------|--------|----------|----------------------------------------------|
| 1       | String | Yes      | The string from which to remove whitespace.  |

### Example 1: Basic Use

This example demonstrates the basic usage of the `Trim` function to clean a string with leading and trailing spaces.

```html
%%[
VAR @untrimmedString, @trimmedString

SET @untrimmedString = "   Hello, World!   "

/* Check if the string is not empty before trimming */
IF NOT EMPTY(@untrimmedString) THEN
    SET @trimmedString = Trim(@untrimmedString)
ELSE
    SET @trimmedString = ""
ENDIF

/* Output the original and trimmed strings */
]%%
Original String: "%%=v(@untrimmedString)=%%"<br>
Trimmed String: "%%=v(@trimmedString)=%%"
```

### Example 2: Advanced Scenario - Cleaning Data Extension Field

This example shows how `Trim` can be used to clean a value retrieved from a Data Extension field, ensuring it's free of leading/trailing spaces before further processing or display.

```html
%%[
VAR @emailAddress, @cleanEmailAddress

/* Assume @emailAddress is retrieved from a Data Extension */
SET @emailAddress = AttributeValue("EmailAddress") /* Example: "  user@example.com  " */

/* Check if the email address is not empty before trimming */
IF NOT EMPTY(@emailAddress) THEN
    SET @cleanEmailAddress = Trim(@emailAddress)
ELSE
    SET @cleanEmailAddress = ""
ENDIF

/* Output the cleaned email address */
]%%
Cleaned Email Address: "%%=v(@cleanEmailAddress)=%%"
```
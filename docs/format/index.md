---
title: "Format"
---


The `Format()` function is used to apply a specified format to a string value, which can include dates, numbers, or other string types. This function leverages C# compatible format strings to define the desired output presentation, and can also incorporate culture-specific formatting rules.

### Arguments

| Ordinal | Type   | Required | Description                                                              |
|---------|--------|----------|--------------------------------------------------------------------------|
| 1       | String | Yes      | The string value to which formatting rules will be applied.              |
| 2       | String | Yes      | A C# compatible format string that defines the desired output pattern.   |
| 3       | String | No       | Specifies the data format of the string. Accepted values are `Date` or `Number`. |
| 4       | String | No       | A culture code (e.g., `en-US`, `fr-FR`, `sw-KE`) to apply culture-specific formatting rules. |

> NOTE: The `outputFormat` parameter utilizes C# standard and custom format strings. Refer to Microsoft's documentation for [Standard Numeric Format Strings](https://learn.microsoft.com/en-us/dotnet/standard/base-types/standard-numeric-format-strings) and [Standard Date and Time Format Strings](https://learn.microsoft.com/en-us/dotnet/standard/base-types/standard-date-and-time-format-strings) for comprehensive details.

### Example 1: Basic Date Formatting

This example demonstrates how to format a date string into a custom `dddd, MMMM d, yyyy` pattern, including the full day name, full month name, day of the month, and year.

```html
%%[
VAR @dateString, @formattedDate
SET @dateString = "2024-02-18 10:30:00"

/* Check if the date string is not empty before formatting */
IF NOT EMPTY(@dateString) THEN
    SET @formattedDate = Format(@dateString, "dddd, MMMM d, yyyy", "Date")
ELSE
    SET @formattedDate = "Invalid Date"
ENDIF
]%%

Formatted Date: %%=v(@formattedDate)=%%
```

### Example 2: Currency Formatting with Culture Code

This example illustrates how to format a numeric value as currency, applying the Indian Rupee (`en-IN`) culture code to ensure correct currency symbol and formatting conventions.

```html
%%[
VAR @numericValue, @formattedCurrency
SET @numericValue = "12345.6789"

/* Check if the numeric value is not empty before formatting */
IF NOT EMPTY(@numericValue) THEN
    SET @formattedCurrency = Format(@numericValue, "C", "Number", "en-IN")
ELSE
    SET @formattedCurrency = "Invalid Amount"
ENDIF
]%%

Formatted Currency (Indian Rupees): %%=v(@formattedCurrency)=%%
```
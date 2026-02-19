---
title: "FormatNumber"
---
	

The `FormatNumber` function is used in AMPscript to format a numeric value into a specified numeric type, such as a decimal, currency, or percentage. It can also convert numbers stored as strings into a number data type and round numbers to a specific number of decimal places. This function is particularly useful for ensuring consistent and user-friendly number presentation in emails and other Marketing Cloud assets.

### Arguments

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | Number | Yes | The number to format. This function assumes that the input number uses a period (.) as a decimal separator. |
| 2 | String | Yes | The number type to convert the number to. Accepted values: C, D, E, F, G, N, P, R, X. You can optionally follow this code with a number to indicate the precision of the number. For example, a currency value with two decimal places uses the parameter C2. |
| 3 | String | No | A POSIX locale code, such as en_US or zh-TW. When you provide this value, the resulting number is formatted using patterns that suit the specified locale. |

> NOTE: This function is only available in Marketing Cloud Engagement emails and landing pages.

### Example 1: Basic Use

```html
%%[ 
  VAR @myNumber, @formattedNumber
  SET @myNumber = 1234.5678

  /* Format the number with commas and two decimal places */
  SET @formattedNumber = FormatNumber(@myNumber, "N2", "en-US")
]%%

Formatted Number: %%=v(@formattedNumber)=%%
```

### Example 2: Advanced Scenario

```html
%%[ 
  VAR @price, @formattedPrice
  SET @price = "19.99"

  /* Format the price as a currency value with two decimal places for the German locale */
  if not empty(@price) then
    SET @formattedPrice = FormatNumber(@price, "C2", "de-DE")
  else
    SET @formattedPrice = "Price not available"
  endif
]%%

Price: %%=v(@formattedPrice)=%%
```
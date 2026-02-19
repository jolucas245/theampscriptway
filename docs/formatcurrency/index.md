---
title: "FormatCurrency"
---


This function formats a string as a currency for the specified locale.

### Arguments

`FormatCurrency(1,2,3,4)`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | True | Currency string to format |
| 2 | String | True | ISO locale code for the currency unit |
| 3 | Number | False | Decimal places to include in the output |
| 4 | String | False | Currency symbol for output. This overrides the currency symbol specified by the ISO locale code |

> NOTE: By default, this function rounds half up to two decimal places.

### Example 1

```html
%%[

var @num
var @currency
var @locale

set @num = "123.45678"
set @locale = "en-US"
set @currency  = FormatCurrency(@num, @locale)

]%%
num: %%=v(@num)=%%
<br>locale: %%=v(@locale)=%%
<br>currency: %%=v(@currency)=%%
```

#### Output

```html
num: 123.45678
locale: en-US
currency: $123.46
```

### Example 2: Formatting with Custom Decimal Places and Locale

This example formats a currency value for the British Pound (GBP) locale with 3 decimal places.

```html
%%[

VAR @amount, @formatted

SET @amount = "2599.5"

/* Format for UK locale with 3 decimal places */
SET @formatted = FormatCurrency(@amount, "en-GB", 3)

]%%

<p>Price: %%=v(@formatted)=%%</p>
```

#### Output

```
Price: £2,599.500
```

### Example 3: Overriding the Currency Symbol

This example uses the optional 4th argument to override the default currency symbol, useful when you want to display a specific currency sign regardless of locale.

```html
%%[

VAR @price, @formatted

SET @price = "49.99"

/* Use Euro symbol with US number formatting */
SET @formatted = FormatCurrency(@price, "en-US", 2, "€")

]%%

<p>Your total: %%=v(@formatted)=%%</p>
```

#### Output

```
Your total: €49.99
```
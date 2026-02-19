---
title: "Add"
---


Returns the sum of two numeric values. This is one of the basic math functions available in AMPscript.

### Arguments

`Add(1,2)`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | Number | True | The first numeric value. |
| 2 | Number | True | The second numeric value. |

### Example 1: Basic Use

This example demonstrates a simple addition of two numbers.

```html
%%[

VAR @sum, @num1, @num2

SET @num1 = 5
SET @num2 = 42

SET @sum = Add(@num1, @num2)

]%%
%%=v(@num1)=%% + %%=v(@num2)=%% = %%=v(@sum)=%%
```

#### Output

```
5 + 42 = 47
```

### Example 2: Calculating a Running Total from a Data Extension

This example retrieves order amounts from a Data Extension and calculates a running total for a subscriber.

```html
%%[

VAR @rows, @rowCount, @i, @runningTotal, @orderAmount

SET @runningTotal = 0
SET @rows = LookupRows("Orders", "SubscriberKey", _subscriberKey)
SET @rowCount = RowCount(@rows)

IF @rowCount > 0 THEN
  FOR @i = 1 TO @rowCount DO

    SET @orderAmount = Field(Row(@rows, @i), "OrderAmount")

    /* Ensure the value is numeric before adding */
    IF NOT EMPTY(@orderAmount) THEN
      SET @runningTotal = Add(@runningTotal, @orderAmount)
    ENDIF

  NEXT @i
ENDIF

]%%

<p>Your total spend across %%=v(@rowCount)=%% orders is: $%%=v(@runningTotal)=%%</p>
```

### Example 3: Combining Add with FormatNumber

This example adds a tax amount to a subtotal and formats the output as currency.

```html
%%[

VAR @subtotal, @taxRate, @taxAmount, @total

SET @subtotal = 149.99
SET @taxRate = 0.08

/* Calculate tax using Multiply, then add to subtotal */
SET @taxAmount = Multiply(@subtotal, @taxRate)
SET @total = Add(@subtotal, @taxAmount)

]%%

<p>Subtotal: $%%=FormatNumber(@subtotal, "N2")=%%</p>
<p>Tax (8%): $%%=FormatNumber(@taxAmount, "N2")=%%</p>
<p><strong>Total: $%%=FormatNumber(@total, "N2")=%%</strong></p>
```

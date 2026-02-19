---
title: "Divide"
---


The `divide` function returns the quotient of two numbers. It performs a standard division operation, taking a dividend and a divisor as input.

### Arguments

| Ordinal | Type   | Required | Description                          |
|---------|--------|----------|--------------------------------------|
| 1       | Number | True     | The number to be divided (dividend). |
| 2       | Number | True     | The number to divide by (divisor).   |

### Example 1: Basic Use

This example demonstrates a straightforward division of two positive integers.

```html
%%[VAR @dividend, @divisor, @result]
SET @dividend = 512
SET @divisor = 256

/* Check if the divisor is not zero to prevent division by zero errors */
IF NOT EMPTY(@divisor) AND @divisor != 0 THEN
    SET @result = Divide(@dividend, @divisor)
    /* Output the result of the division */
    Output(Concat("The result of ", @dividend, " divided by ", @divisor, " is: ", @result))
ELSE
    /* Handle cases where the divisor is zero or empty */
    Output(Concat("Error: Divisor is zero or empty for dividend ", @dividend))
ENDIF
]%%
```

### Example 2: Advanced Scenario with Decimal Numbers and Variable Input

This example illustrates dividing decimal numbers and handling potential empty or zero divisor values from dynamic sources, such as a Data Extension field.

```html
%%[VAR @itemPrice, @quantity, @averagePrice]

/* Assume @itemPrice and @quantity are retrieved from a Data Extension or other dynamic source */
SET @itemPrice = 125.50
SET @quantity = 5

/* Defensive check for empty or zero quantity before performing division */
IF NOT EMPTY(@quantity) AND @quantity != 0 THEN
    SET @averagePrice = Divide(@itemPrice, @quantity)
    /* Output the calculated average price */
    Output(Concat("The average price per item is: ", FormatNumber(@averagePrice, "C")))
ELSE
    /* Provide a fallback or error message if quantity is invalid */
    Output(Concat("Cannot calculate average price: Invalid quantity (", @quantity, ") for item price ", @itemPrice))
ENDIF
]%%
```
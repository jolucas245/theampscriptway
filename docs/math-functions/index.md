---
title: "Math Functions"
---


AMPscript Math Functions allow you to perform various mathematical operations on numeric values within Salesforce Marketing Cloud. These functions are essential for calculations, data manipulation, and dynamic content generation in emails, landing pages, and other marketing assets.

### Arguments

As a category, `math-functions` does not take direct arguments. Individual math functions have their own specific arguments.

> NOTE: AMPscript math functions are primarily executed server-side within Salesforce Marketing Cloud environments, including emails, landing pages, and CloudPages.

### Example 1: Basic Use of Add()
This example demonstrates how to use the `Add()` function to sum two numbers, ensuring that the input values are not empty before performing the operation.
```html
%%[VAR @num1, @num2, @sum]

SET @num1 = 10
SET @num2 = 25

/* Check if both numbers are not empty before performing addition */
IF NOT EMPTY(@num1) AND NOT EMPTY(@num2) THEN
    SET @sum = Add(@num1, @num2)
ELSE
    SET @sum = 0 /* Default to 0 or handle error as appropriate */
ENDIF

/* Output the result */
]%%
The sum of %%=v(@num1)=%% and %%=v(@num2)=%% is %%=v(@sum)=%%.
```

### Example 2: Advanced Scenario with Divide()
This example illustrates how to use the `Divide()` function while implementing defensive programming to prevent division by zero errors, which would otherwise cause an AMPscript error.
```html
%%[VAR @numerator, @denominator, @result]

SET @numerator = 100
SET @denominator = 0

/* Check if the denominator is not zero before performing division */
IF NOT EMPTY(@numerator) AND NOT EMPTY(@denominator) AND @denominator != 0 THEN
    SET @result = Divide(@numerator, @denominator)
ELSE
    SET @result = 0 /* Default to 0 or handle error as appropriate */
ENDIF

/* Output the result */
]%%
When %%=v(@numerator)=%% is divided by %%=v(@denominator)=%%, the result is %%=v(@result)=%%.
```

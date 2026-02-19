---
title: "Numeric Constants"
---


Numeric constants in AMPscript represent fixed numerical values. They consist of an unquoted sequence of digits and can include a single decimal point. They can also be prefixed with a minus sign to denote negative values. It is crucial to note that numeric constants **cannot** contain commas for digit grouping, as this will result in a parsing error.

### Notes

> NOTE: Numeric constants are not functions and therefore do not accept arguments. They are fundamental data types used directly in expressions or assigned to variables.
> NOTE: Commas are not permitted within numeric constants. For example, `1,000` is invalid; it should be written as `1000`.

### Example 1: Basic Use

This example demonstrates the declaration and assignment of various numeric constants to AMPscript variables.

```html
%%[
    /* Declare variables to hold numeric constant values */
    VAR @integerValue
    VAR @decimalValue
    VAR @negativeValue
    VAR @zeroValue

    /* Assign numeric constants to variables */
    SET @integerValue = 12345 /* A positive integer */
    SET @decimalValue = 98.76  /* A positive decimal number */
    SET @negativeValue = -50   /* A negative integer */
    SET @zeroValue = 0       /* The numeric constant zero */

    /* Output the values to demonstrate their assignment */
    IF NOT EMPTY(@integerValue) THEN
        OutputLine(CONCAT("Integer Value: ", @integerValue))
    ENDIF

    IF NOT EMPTY(@decimalValue) THEN
        OutputLine(CONCAT("Decimal Value: ", @decimalValue))
    ENDIF

    IF NOT EMPTY(@negativeValue) THEN
        OutputLine(CONCAT("Negative Value: ", @negativeValue))
    ENDIF

    IF NOT EMPTY(@zeroValue) THEN
        OutputLine(CONCAT("Zero Value: ", @zeroValue))
    ENDIF
]%%
```

### Example 2: Numeric Constants in Calculations

This example illustrates how numeric constants can be directly used in mathematical operations within AMPscript.

```html
%%[
    /* Declare variables for calculation */
    VAR @price
    VAR @quantity
    VAR @total
    VAR @discountRate
    VAR @finalPrice

    /* Assign values using numeric constants */
    SET @price = 199.99
    SET @quantity = 2
    SET @discountRate = 0.15 /* Represents 15% discount */

    /* Perform calculations using numeric constants */
    SET @total = @price * @quantity
    SET @finalPrice = @total * (1 - @discountRate)

    /* Output the results of the calculations */
    IF NOT EMPTY(@price) AND NOT EMPTY(@quantity) THEN
        OutputLine(CONCAT("Original Price: ", @price))
        OutputLine(CONCAT("Quantity: ", @quantity))
        OutputLine(CONCAT("Total before discount: ", @total))
    ENDIF

    IF NOT EMPTY(@discountRate) AND NOT EMPTY(@finalPrice) THEN
        OutputLine(CONCAT("Discount Rate: ", FORMAT(@discountRate, "P")))
        OutputLine(CONCAT("Final Price after discount: ", FORMAT(@finalPrice, "C")))
    ENDIF
]%%
```
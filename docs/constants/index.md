---
title: "Constants"
---


Constants in AMPscript are fixed values that do not change during script execution. They are used directly in expressions and function arguments without being declared as variables. AMPscript supports three types of constants: string, numeric, and boolean.

### Types of Constants

| Type | Description | Link |
| --- | --- | --- |
| String | Text values enclosed in double quotes (e.g., `"Hello"`). | [String Constants](/string-constants) |
| Numeric | Integer or decimal numbers without quotes (e.g., `42`, `3.14`). | [Numeric Constants](/numeric-constants) |
| Boolean | Logical values: `true` or `false`. | [Boolean Constants](/boolean-constants) |

### Example: Using Constants in AMPscript

```html
%%[

/* String constant */
SET @greeting = "Welcome to our store"

/* Numeric constant */
SET @discountPercent = 15

/* Boolean constant */
SET @isActive = true

IF @isActive == true THEN
  Output(Concat(@greeting, "! Enjoy ", @discountPercent, "% off today."))
ENDIF

]%%
```

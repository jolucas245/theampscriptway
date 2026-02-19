---
title: "Mod"
---


This function returns the remainder after the division of two numbers (also known as a modulo operation).

### Arguments

`Mod(1,2)`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | Number | True | Value to be divided (dividend) |
| 2 | Number | True | Value to divide by (divisor) |

> NOTE: This function will return a decimal if either parameter is a decimal.

### Example

```html
%%[

var @modulus, @num1, @num2

set @num1 = 10
set @num2 = 3

set @modulus  = mod(@num1, @num2)

]%%
%%=v(@num1)=%% % %%=v(@num2)=%% = %%=v(@modulus)=%%
```

#### Output

```html
10 % 3 = 1
```
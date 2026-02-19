---
title: "Multiply"
---


This function returns the product of multiplying two numbers.

### Arguments

`Multiply(1,2)`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | Number | True | Value to be multiplied |
| 2 | Number | True | Value to be multiplied |

### Example

```html
%%[

var @product, @num1, @num2

set @num1 = 5
set @num2 = 4

set @product  = multiply(@num1, @num2)

]%%
%%=v(@num1)=%% * %%=v(@num2)=%% = %%=v(@product)=%%
```

#### Output

```html
5 * 4 = 20
```
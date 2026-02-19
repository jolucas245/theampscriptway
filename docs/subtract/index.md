---
title: "Subtract"
---


This function returns the difference between two numbers.

### Arguments

`Subtract(1,2)`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | Number | True | First value |
| 2 | Number | True | Second value |

### Example

```html
%%[

var @diff, @num1, @num2

set @num1 = 42.51
set @num2 = 5

set @diff  = Subtract(@num1, @num2)

]%%
%%=v(@num1)=%% - %%=v(@num2)=%% = %%=v(@diff)=%%
```

#### Output

```html
42.51 - 5 = 37.51
```
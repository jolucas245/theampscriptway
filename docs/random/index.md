---
title: "Random"
---


This function returns a random number between two numbers. Both upper and lower bound parameters are inclusive.

### Arguments

`Random(1,2)`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | Number | True | Value of lower bound |
| 2 | Number | True | Value of upper bound |

### Example

```html
%%[

var @random, @num1, @num2

set @num1 = 1
set @num2 = 100

set @random  = random(@num1, @num2)

]%%
Lower bound: %%=v(@num1)=%%
<br>Upper bound: %%=v(@num2)=%%
<br>Random: %%=v(@random)=%%
```

#### Output

```html
Lower bound: 1
Upper bound: 100
Random: 42
```
---
title: "Char"
---


This function returns the ASCII character for the specified ASCII character code.

### Arguments

`Char(1,2)`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | Number | True | Character code |
| 2 | Number | False | Number of times to repeat the ASCII character returned |

### Example

```html
%%[

var @greeting
set @greeting = ""
set @greeting = concat(@greeting, "Just wanted to say ", Char(34), "Hello", Char(34), " ")
set @greeting = concat(@greeting, "and tell you we", Char(39) ,"re b", Char(97,4) , "ck!")

]%%
greeting: %%=v(@greeting)=%%
```

#### Output

```html
greeting: Just wanted to say "Hello" and tell you we're baaaack!
```
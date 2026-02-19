---
title: "ReplaceList"
---


This function replaces the first string value with the second string value and any subsequent values in the specified string.

### Arguments

`ReplaceList(1,2,3,n)`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | True | String to search |
| 2 | String | True | Replacement string |
| 3 | String | True | First String to find |
| n | String | False | Subsequent string to find (see note) |

> NOTE: Additional strings to find can be appended as arguments.

### Example

```html
%%[

var @colors
var @colorsNew

set @colors = ""
set @colors = concat(@colors, "red/orange/yellow,green/blue,indigo/violet")
set @colorsNew  = ReplaceList(@colors, "|", "/", ",")

]%%
colors: %%=v(@colors)=%%
<br>colorsNew: %%=v(@colorsNew)=%%
```

#### Output

```html
colors: red/orange/yellow,green/blue,indigo/violet
colorsNew: red|orange|yellow|green|blue|indigo|violet
```
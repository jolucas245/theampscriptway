---
title: "StringToDate"
---


This function parses the specified date string and returns a .NET DateTime object.

### Arguments

`StringToDate(1,2)`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | True | Date string to parse |
| 2 | String | False | Optional .NET character-encoding type to utilize in encoding. Valid values are `UTF-8` (default) and `UTF-16`. |

> NOTE: The second argument is not supported in the current version of Marketing Cloud.

### Example

```html
%%[

var @dateString1
var @date1
var @dateString2
var @date2

set @dateString1 = "2017-10-15 00:24"
set @date1 = StringToDate(@dateString1)

set @dateString2 = "2/29/2016 23:45"
set @date2 = StringToDate(@dateString2)

]%%
dateString1: %%=v(@dateString1)=%%
<br>date1: %%=v(@date1)=%%
<br><br>dateString2: %%=v(@dateString2)=%%
<br>date2: %%=v(@date2)=%%
```

#### Output

```html
dateString1: 2017-10-15 00:24
date1: 10/15/2017 12:24:00 AM

dateString2: 2/29/2016 23:45
date2: 2/29/2016 11:45:00 PM
```
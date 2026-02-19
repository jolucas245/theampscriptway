---
title: "DatePart"
---


This function returns the specified part of a date string.

### Arguments

`DatePart(1,2)`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | True | The date string from which to extract a part |
| 2 | String | True | The part of the date to retrieve. Valid values include `year`, `Y`, `month`, `M`, `monthName`, `day`, `D`, `hour`, `H`, `minute` and `MI` |

### Example

```html
%%[

var @dateString, @year, @month, @monthName, @day, @hour, @minute

set @dateString = "Sun, 15 Oct 2017 19:35:00"
set @year = datePart(@dateString, "Y")
set @month = datePart(@dateString, "M")
set @monthName = datePart(@dateString, "monthName")
set @day = datePart(@dateString, "D")
set @hour = datePart(@dateString, "H")
set @minute = datePart(@dateString, "minute")

]%%
<br>dateString: %%=v(@dateString)=%%
<br>year: %%=v(@year)=%%
<br>month: %%=v(@month)=%%
<br>monthName: %%=v(@monthName)=%%
<br>day: %%=v(@day)=%%
<br>hour: %%=v(@hour)=%%
<br>minute: %%=v(@minute)=%%
```

#### Output

```html
dateString: Sun, 15 Oct 2017 19:35:00
year: 2017
month: 10
monthName: October
day: 15
hour: 7
minute: 35
```
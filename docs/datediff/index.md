---
title: "DateDiff"
---


This function returns the difference between two dates based on the specified date part.

### Arguments

`DateDiff(1,2,3)`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | Date | True | The start date from which to subtract |
| 2 | Date | True | The date to subtract from the start date |
| 3 | String | True | The part of the date to adjust. Valid values include `Y`, `M`, `D`, `H`, and `MI` |

### Example

```html
%%[

var @startDate, @endDate, @diffYear, @diffMonth, @diffDay, @diffHours, @diffMinutes
set @startDate = '2016-08-15 6:30 AM'
set @endDate = '2017-10-16 8:31 AM'
set @diffYear = dateDiff(@startDate, @endDate,"Y")
set @diffMonth = dateDiff(@startDate, @endDate,"M")
set @diffDay = dateDiff(@startDate, @endDate,"D")
set @diffHours = dateDiff(@startDate, @endDate,"H")
set @diffMinutes = dateDiff(@startDate, @endDate,"MI")

]%%
startDate: %%=v(@startDate)=%%
<br>endDate: %%=v(@endDate)=%%
<br>diffYear: %%=v(@diffYear)=%%
<br>diffMonth: %%=v(@diffMonth)=%%
<br>diffDay: %%=v(@diffDay)=%%
<br>diffHours: %%=v(@diffHours)=%%
<br>diffMinutes: %%=v(@diffMinutes)=%%
```

#### Output

```html
startDate: 2016-08-15 6:30 AM
endDate: 2017-10-16 8:31 AM
diffYear: 1
diffMonth: 14
diffDay: 427
diffHours: 10250
diffMinutes: 615001
```
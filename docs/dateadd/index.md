---
title: "DateAdd"
---


This function returns a date with the specified number interval added to the specified part of the date.

### Arguments

`DateAdd(1,2,3)`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | Date | True | The date to adjust |
| 2 | Number | True | The interval to add |
| 3 | String | True | The part of the date to adjust by the preceding interval. Valid values include `Y`, `M`, `D`, `H`, and `MI` |

### Example

```html
%%[

var @today, @plusOneYear, @minusOneYear, @plusOneMonth, @minusOneMonth, @plusOneDay, @minusOneDay, @plusOneHour, @minusOneHour, @plusOneMinute, @minusOneMinute
set @today = Now(1) /* valid */
set @today = "15/10/2017" /* invalid */
set @today = "15-OCT-2017" /* valid */
set @today = "2017-10-15" /* valid */
set @today = "October 15, 2017" /* valid */
set @today = "10/15/2017" /* valid */
set @today = "10/15/2017 6:30 am" /* valid */
set @plusOneYear = DateAdd(@today, 1, "Y")
set @minusOneYear = DateAdd(@today, -1, "Y")
set @plusOneMonth = DateAdd(@today, 1, "M")
set @minusOneMonth = DateAdd(@today, -1, "M")
set @plusOneDay = DateAdd(@today, 1, "D")
set @minusOneDay = DateAdd(@today, -1, "D")
set @plusOneHour = DateAdd(@today, 1, "H")
set @minusOneHour = DateAdd(@today, -1, "H")
set @plusOneMinute = DateAdd(@today, 1, "MI")
set @minusOneMinute = DateAdd(@today, -1, "MI")

]%%
today: %%=v(@today)=%%
<br>plusOneYear: %%=v(@plusOneYear)=%%
<br>minusOneYear: %%=v(@minusOneYear)=%%
<br>plusOneMonth: %%=v(@plusOneMonth)=%%
<br>minusOneMonth: %%=v(@minusOneMonth)=%%
<br>plusOneDay: %%=v(@plusOneDay)=%%
<br>minusOneDay: %%=v(@minusOneDay)=%%
<br>plusOneHour: %%=v(@plusOneHour)=%%
<br>minusOneHour: %%=v(@minusOneHour)=%%
<br>plusOneMinute: %%=v(@plusOneMinute)=%%
<br>minusOneMinute: %%=v(@minusOneMinute)=%%
```

#### Output

```html
today: 10/15/2017 6:30 am
plusOneYear: 10/15/2018 6:30:00 AM
minusOneYear: 10/15/2016 6:30:00 AM
plusOneMonth: 11/15/2017 6:30:00 AM
minusOneMonth: 9/15/2017 6:30:00 AM
plusOneDay: 10/16/2017 6:30:00 AM
minusOneDay: 10/14/2017 6:30:00 AM
plusOneHour: 10/15/2017 7:30:00 AM
minusOneHour: 10/15/2017 5:30:00 AM
plusOneMinute: 10/15/2017 6:31:00 AM
minusOneMinute: 10/15/2017 6:29:00 AM
```
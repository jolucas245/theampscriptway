---
title: "FormatDate"
---


This function formats a date/time string in the specified format pattern and locale.

### Arguments

`FormatDate(1,2,3,4)`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | True | The date string to format |
| 2 | String | True | The output date format pattern (see table below for valid values) |
| 3 | String | False | The output time format pattern (see table below for valid values) |
| 4 | String | False | The ISO locale code for the output |

These are the valid format patterns, given a date of `2017-09-15T16:07:08.1230000-06:00`:

| Element | Format Pattern | Output |
| --- | --- | --- |
| Long | l | Friday, September 15, 2017 |
| Short Date | s | 9/15/2017 |
| Month Year | Y | September 2017 |
| Year | YY | 17 |
| Year | YYYY | 2017 |
| Month | M | September 15 |
| Month | MM | 09 |
| Month | MMM | Sep |
| Month | MMMM | September |
| Day | dd | 15 |
| Day | dddd | Fri |
| Day | ddddd | Friday |
| Hour 12-hour | hh | 06 |
| Hour 24-hour | HH | 16 |
| Minutes | mm | 07 |
| Seconds | ss | 08 |
| Milliseconds (time only) | MM | 123 |
| AM/PM | tt | PM |
| Timezone offset | zz | -06 |
| Timezone offset | zzz | -06:00 |
| Short Time | s | 4:07 PM |

> NOTE: Format patterns are not case-sensitive, but they must be used in the correct pattern argument (for example, both `mm` and `MM` are date *and* time formats).
>
> NOTE: This function returns lowercase month and day names for non-US culture codes by default.

### Example

```html
%%[

var @dateString, @timeString, @dateISO, @dateRFC, @dateLong, @dateShort, @frFRDate, @monthYear, @yearShort, @yearFull, @monthNameDay, @monthNumber, @monthShortName, @monthFullName, @dayNumber, @dayShortName, @dayFullName, @hour, @minute, @seconds, @milliseconds, @AMPM, @offsetHours, @offsetHoursMinutes, @timeShort

set @dateString = "2017-09-15T16:07:08.1230000-06:00"
set @timeString = "16:07:08.123"

set @dateISO  = FormatDate(@dateString,"iso")
set @dateRFC  = FormatDate(@dateString,"rfc")
set @dateLong  = FormatDate(@dateString,"l")
set @dateShort  = FormatDate(@dateString,"s")
set @frFRDate = properCase(FormatDate(@dateString,"l","","fr-FR"))

set @monthYear = FormatDate(@dateString,"Y")
set @yearShort = FormatDate(@dateString,"YY")
set @yearFull = FormatDate(@dateString,"YYYY")
set @monthNameDay = FormatDate(@dateString,"M")
set @monthNumber = FormatDate(@dateString,"MM")
set @monthShortName = FormatDate(@dateString,"MMM")
set @monthFullName = FormatDate(@dateString,"MMMM")
set @dayNumber = FormatDate(@dateString,"dd")
set @dayShortName = FormatDate(@dateString,"dddd")
set @dayFullName = FormatDate(@dateString,"ddddd")

set @hour = FormatDate(@timeString,"","hh")
set @minute = FormatDate(@timeString,"","mm")
set @seconds = FormatDate(@timeString,"","ss")
set @milliseconds = FormatDate(@timeString,"","MMM")
set @AMPM = FormatDate(@timeString,"","tt")
set @offsetHours = FormatDate(@dateString,"zz")
set @offsetHoursMinutes = FormatDate(@dateString,"zzz")
set @timeShort = FormatDate(@timeString,"","s")

]%%
dateString: %%=v(@dateString)=%%
<br>dateISO: %%=v(@dateISO)=%%
<br>dateRFC: %%=v(@dateRFC)=%%
<br>dateLong: %%=v(@dateLong)=%%
<br>dateShort: %%=v(@dateShort)=%%
<br>frFRDate: %%=v(@frFRDate)=%%
<br><br>monthYear: %%=v(@monthYear)=%%
<br>yearShort: %%=v(@yearShort)=%%
<br>yearFull: %%=v(@yearFull)=%%
<br>monthNameDay: %%=v(@monthNameDay)=%%
<br>monthNumber: %%=v(@monthNumber)=%%
<br>monthShortName: %%=v(@monthShortName)=%%
<br>monthFullName: %%=v(@monthFullName)=%%
<br>dayNumber: %%=v(@dayNumber)=%%
<br>dayShortName: %%=v(@dayShortName)=%%
<br>dayFullName: %%=v(@dayFullName)=%%
<br><br>timeString: %%=v(@timeString)=%%
<br>hour: %%=v(@hour)=%%
<br>minute: %%=v(@minute)=%%
<br>seconds: %%=v(@seconds)=%%
<br>milliseconds: %%=v(@milliseconds)=%%
<br>AMPM: %%=v(@AMPM)=%%
<br>offsetHours: %%=v(@offsetHours)=%%
<br>offsetHoursMinutes: %%=v(@offsetHoursMinutes)=%%
<br>timeShort: %%=v(@timeShort)=%%
```

#### Output

```html
dateString: 2017-09-15T16:07:08.1230000-06:00
dateISO: 2017-09-15T16:07:08.1230000-06:00
dateRFC: Fri, 15 Sep 2017 16:07:08 GMT
dateLong: Friday, September 15, 2017
dateShort: 9/15/2017
frFRDate: Vendredi 15 Septembre 2017

monthYear: September 2017
yearShort: 17
yearFull: 2017
monthNameDay: September 15
monthNumber: 09
monthShortName: Sep
monthFullName: September
dayNumber: 15
dayShortName: Fri
dayFullName: Friday

timeString: 16:07:08.123
hour: 16
minute: 07
seconds: 08
milliseconds: 123
AMPM: PM
offsetHours: -06
offsetHoursMinutes: -06:00
timeShort: 4:07 PM
```
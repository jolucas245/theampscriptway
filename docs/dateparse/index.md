---
title: "DateParse"
---


This function converts the string representation of a date and time into its DateTime equivalent.

### Arguments

`DateParse(1,2)`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | Date | True | The date string to parse |
| 2 | Boolean | False | A `True` value returns the date in UTC format |

> NOTE: The function uses the date format defined in the respective the Business Unit. For example, `MM/DD/YYYY` when the Business Unit date format is set to English (United States) or `DD/MM/YYYY` when the Business Unit date format is set to English (United Kingdom). If you attempt to parse a string in an incorrect format based the Business Unit date format, for example `30/12/2020` when the Business Unit date format is set to English (United States), then the function will return a `String was not recognized as a valid DateTime` error.

### Example

```html
%%[

var @dateString1
var @date1
var @dateString2
var @date2
var @dateString3
var @date3
var @dateString4
var @date4
var @dateString5
var @date5

set @dateString1 = "2017-10-15"
set @date1 = DateParse(@dateString1,0)

set @dateString2 = "02/29/2016 05:42:00"
set @date2 = DateParse(@dateString2,0)

set @dateString3 = "6:00 AM"
set @date3 = DateParse(@dateString3,1)

set @dateString4 = "Sun, 15 Oct 2017 19:35:00 GMT"
set @date4 = DateParse(@dateString4,0)

set @dateString5 = "2017-10-15T19:35:00.0000000-06:00"
set @date5 = DateParse(@dateString5,0)

]%%
dateString1: %%=v(@dateString1)=%%
<br>date1: %%=v(@date1)=%%
<br><br>dateString2: %%=v(@dateString2)=%%
<br>date2: %%=v(@date2)=%%
<br><br>dateString3: %%=v(@dateString3)=%%
<br>date3: %%=v(@date3)=%%
<br><br>dateString4: %%=v(@dateString4)=%%
<br>date4: %%=v(@date4)=%%
<br><br>dateString5: %%=v(@dateString5)=%%
<br>date5: %%=v(@date5)=%%
```

#### Output

```html
dateString1: 2017-10-15
date1: 10/15/2017 12:00:00 AM

dateString2: 02/29/2016 05:42:00
date2: 2/29/2016 5:42:00 AM

dateString3: 6:00 AM
date3: 10/15/2017 12:00:00 PM

dateString4: Sun, 15 Oct 2017 19:35:00 GMT
date4: 10/15/2017 1:35:00 PM

dateString5: 2017-10-15T19:35:00.0000000-06:00
date5: 10/15/2017 7:35:00 PM
```
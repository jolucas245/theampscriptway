---
title: "SystemDateToLocalDate"
---


This function converts the specified system date/time into the local date/time.

### Arguments

`SystemDateToLocalDate(1)`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | True | The date to convert |

### Example

```html
%%[

var @systemDate, @localDate
set @systemDate  = Now(1)
set @localDate =  SystemDateToLocalDate(@systemDate)

]%%
systemDate: %%=v(@systemDate)=%%
<br>localDate: %%=v(@localDate)=%%
```

#### Output

```html
systemDate: 10/15/2017 3:45:35 PM
localDate: 10/15/2017 1:45:35 PM
```
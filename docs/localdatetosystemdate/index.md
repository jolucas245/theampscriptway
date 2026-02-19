---
title: "Localdatetosystemdate"
---


This function converts the specified date/time into system time. The date and time returned is Central Standard Time (CST) without any adjustments for daylight savings.

### Argument

`LocalDateToSystemDate(1)`

| Ordinal | Type | Required | Description |
| --- | --- | --- | --- |
| 1 | String | True | The date to convert |

### Example

```html
%%[

var @localDate, @systemDate
set @localDate = Now(1)
set @systemDate  = LocalDateToSystemDate(@localDate)

]%%
localDate: %%=v(@localDate)=%%
<br>systemDate: %%=v(@systemDate)=%%
```

#### Output

```html
localDate: 10/15/2017 1:42:35 PM
systemDate: 10/15/2017 3:42:35 PM
```